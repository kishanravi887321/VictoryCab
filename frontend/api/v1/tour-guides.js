import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { id, destination_id, language, specialty } = req.query;

    if (id) {
      const { data, error } = await supabase.from('tour_guides').select('*').eq('id', id).single();
      if (error) throw error;
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('target_type', 'tour_guides')
        .eq('target_id', id)
        .order('created_at', { ascending: false })
        .limit(20);
      return res.status(200).json({ ...data, reviews: reviews || [] });
    }

    let query = supabase.from('tour_guides').select('*');
    if (destination_id) query = query.eq('destination_id', parseInt(destination_id));
    if (language) query = query.contains('languages', [language]);
    if (specialty) query = query.contains('specialties', [specialty]);
    query = query.order('avg_rating', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return res.status(200).json({ data: data || [] });
  } catch (err) {
    console.error('Tour guides API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
