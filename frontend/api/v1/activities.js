import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { id, destination_id, category, difficulty, max_price, limit } = req.query;

    if (id) {
      const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();
      if (error) throw error;
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('target_type', 'activities')
        .eq('target_id', id)
        .order('created_at', { ascending: false })
        .limit(20);
      const { data: dest } = await supabase.from('destinations').select('name').eq('id', data.destination_id).single();
      await supabase.from('activities').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
      return res.status(200).json({ ...data, reviews: reviews || [], destination_name: dest?.name });
    }

    let query = supabase.from('activities').select('*', { count: 'exact' });
    if (destination_id) query = query.eq('destination_id', parseInt(destination_id));
    if (category) query = query.eq('category', category);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (max_price) query = query.lte('price', parseInt(max_price));

    query = query.order('avg_rating', { ascending: false });
    const lim = Math.min(parseInt(limit) || 30, 100);
    query = query.limit(lim);

    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ data: data || [], total: count || 0 });
  } catch (err) {
    console.error('Activities API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
