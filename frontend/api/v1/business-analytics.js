import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    const { data: businesses } = await supabase.from('businesses').select('*').eq('owner_id', user.id);
    const { data: bookings } = await supabase.from('bookings').select('*').eq('user_id', user.id);
    const allBookings = bookings || [];

    // Get all listings owned by this user across tables
    const listings = [];
    const { data: hotels } = await supabase.from('hotels').select('id, name, avg_rating, review_count, view_count').eq('owner_id', user.id);
    (hotels || []).forEach(h => listings.push({ ...h, type: 'hotel' }));
    const { data: activities } = await supabase.from('activities').select('id, name, avg_rating, review_count, view_count').eq('owner_id', user.id);
    (activities || []).forEach(a => listings.push({ ...a, type: 'activity' }));
    const { data: restaurants } = await supabase.from('restaurants').select('id, name, avg_rating, review_count, view_count').eq('owner_id', user.id);
    (restaurants || []).forEach(r => listings.push({ ...r, type: 'restaurant' }));

    const metrics = {
      total_listings: listings.length,
      total_bookings: allBookings.length,
      total_revenue: allBookings.reduce((s, b) => s + (b.total_price || 0), 0),
      total_views: listings.reduce((s, l) => s + (l.view_count || 0), 0),
      pending_bookings: allBookings.filter(b => b.status === 'PENDING').length,
      confirmed_bookings: allBookings.filter(b => b.status === 'CONFIRMED').length,
      completed_bookings: allBookings.filter(b => b.status === 'COMPLETED').length,
    };

    return res.status(200).json({ metrics, listings });
  } catch (err) {
    console.error('Business analytics API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
