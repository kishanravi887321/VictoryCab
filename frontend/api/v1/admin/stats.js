import supabase from '../../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!['ADMIN', 'SUPER_ADMIN'].includes(profile?.role)) return res.status(403).json({ error: 'Forbidden' });

  try {
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: destCount } = await supabase.from('destinations').select('*', { count: 'exact', head: true });
    const { count: hotelCount } = await supabase.from('hotels').select('*', { count: 'exact', head: true });
    const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    const { count: reviewCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
    const { count: businessCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
    const { data: topDest } = await supabase.from('destinations').select('id, name, view_count, avg_rating').order('view_count', { ascending: false }).limit(5);
    const { data: recentEvents } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(10);

    // Daily bookings series (last 7 days)
    const daily_series = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', dateStr + 'T00:00:00').lt('created_at', dateStr + 'T23:59:59');
      daily_series.push({ date: dateStr, count: count || 0 });
    }

    const { count: pendingBiz } = await supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: reportedReviews } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('reported', true);

    return res.status(200).json({
      total_users: userCount || 0,
      total_destinations: destCount || 0,
      total_hotels: hotelCount || 0,
      total_bookings: bookingCount || 0,
      total_reviews: reviewCount || 0,
      total_businesses: businessCount || 0,
      pending_businesses: pendingBiz || 0,
      reported_reviews: reportedReviews || 0,
      top_destinations: topDest || [],
      recent_events: recentEvents || [],
      daily_series
    });
  } catch (err) {
    console.error('Admin stats API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
