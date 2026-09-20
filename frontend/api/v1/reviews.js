import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id, reported, limit: lim } = req.query;
      let query = supabase.from('reviews').select('*, user:profiles(full_name, avatar_url)');
      if (user_id) query = query.eq('user_id', user_id);
      if (reported === 'true') query = query.eq('reported', true);
      query = query.order('created_at', { ascending: false });
      const l = Math.min(parseInt(lim) || 50, 100);
      query = query.limit(l);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

    if (req.method === 'POST') {
      const { target_type, target_id, rating, comment } = req.body;
      const { data, error } = await supabase
        .from('reviews')
        .insert({ user_id: user.id, target_type, target_id, rating, comment })
        .select('*, user:profiles(full_name, avatar_url)')
        .single();
      if (error) throw error;
      // Update avg_rating on target
      await updateAvgRating(target_type, target_id);
      // Audit
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'REVIEW_CREATED', entity_type: target_type, entity_id: target_id });
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, action } = req.body;
      // Admin moderation
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!['ADMIN', 'SUPER_ADMIN'].includes(profile?.role)) return res.status(403).json({ error: 'Forbidden' });
      if (action === 'approve') {
        await supabase.from('reviews').update({ reported: false }).eq('id', id);
      } else if (action === 'delete') {
        const { data: rev } = await supabase.from('reviews').select('target_type, target_id').eq('id', id).single();
        await supabase.from('reviews').delete().eq('id', id);
        if (rev) await updateAvgRating(rev.target_type, rev.target_id);
      }
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'REVIEW_MODERATED', entity_type: 'reviews', entity_id: id, details: { action } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reviews API error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateAvgRating(target_type, target_id) {
  const tableMap = { destinations: 'destinations', hotels: 'hotels', activities: 'activities', restaurants: 'restaurants', tour_guides: 'tour_guides' };
  const table = tableMap[target_type];
  if (!table) return;
  const { data: reviews } = await supabase.from('reviews').select('rating').eq('target_type', target_type).eq('target_id', target_id);
  if (!reviews || reviews.length === 0) return;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await supabase.from(table).update({ avg_rating: Math.round(avg * 10) / 10, review_count: reviews.length }).eq('id', target_id);
}
