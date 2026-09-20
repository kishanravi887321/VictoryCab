import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { id, q, tag, region, sort, limit } = req.query;

    if (id) {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      // Get reviews for this destination
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('target_type', 'destinations')
        .eq('target_id', id)
        .order('created_at', { ascending: false })
        .limit(20);
      // Get nearby hotels
      const { data: hotels } = await supabase
        .from('hotels')
        .select('*')
        .eq('destination_id', id)
        .order('avg_rating', { ascending: false })
        .limit(4);
      // Get activities
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('destination_id', id)
        .limit(6);
      // Get restaurants
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .eq('destination_id', id)
        .limit(6);
      // Increment view count
      await supabase.from('destinations').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
      return res.status(200).json({ ...data, reviews: reviews || [], hotels: hotels || [], activities: activities || [], restaurants: restaurants || [] });
    }

    let query = supabase.from('destinations').select('*', { count: 'exact' });

    if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%,region.ilike.%${q}%`);
    if (tag) query = query.contains('tags', [tag]);
    if (region) query = query.eq('region', region);

    if (sort === 'popular' || !sort) query = query.order('view_count', { ascending: false });
    else if (sort === 'rating') query = query.order('avg_rating', { ascending: false });
    else if (sort === 'name') query = query.order('name', { ascending: true });
    else if (sort === 'newest') query = query.order('created_at', { ascending: false });

    const lim = Math.min(parseInt(limit) || 24, 100);
    query = query.limit(lim);

    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ data: data || [], total: count || 0 });
  } catch (err) {
    console.error('Destinations API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
