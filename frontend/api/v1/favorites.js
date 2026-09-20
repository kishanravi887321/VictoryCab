import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { target_type, target_id } = req.body;
      // Toggle: check if exists
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_type', target_type)
        .eq('target_id', target_id)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return res.status(200).json({ favorited: false });
      }

      // Look up target info
      let target_name = '', target_image = '';
      const tableMap = { destinations: 'destinations', hotels: 'hotels', activities: 'activities', restaurants: 'restaurants', tour_guides: 'tour_guides' };
      const table = tableMap[target_type];
      if (table) {
        const { data: t } = await supabase.from(table).select('name, image_url, hero_image').eq('id', target_id).single();
        if (t) {
          target_name = t.name;
          target_image = t.image_url || t.hero_image || '';
        }
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, target_type, target_id, target_name, target_image })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ ...data, favorited: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Favorites API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
