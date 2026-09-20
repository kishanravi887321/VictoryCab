import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      const { as: asRole } = req.query;
      if (asRole === 'provider') {
        // Business owner sees bookings for their listings
        const { data: businesses } = await supabase.from('businesses').select('id, business_type').eq('owner_id', user.id).eq('status', 'verified');
        if (!businesses || businesses.length === 0) return res.status(200).json([]);
        // Get all bookings
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data || []);
      }
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { target_type, target_id, check_in, check_out, guests } = req.body;
      // Look up target details
      let target_name = '', target_image = '', total_price = 0;
      const tableMap = { hotels: 'hotels', activities: 'activities', tour_guides: 'tour_guides' };
      const table = tableMap[target_type];
      if (table) {
        const { data: t } = await supabase.from(table).select('*').eq('id', target_id).single();
        if (t) {
          target_name = t.name;
          target_image = t.image_url || '';
          if (target_type === 'hotels' && check_in && check_out) {
            const days = Math.max(1, Math.ceil((new Date(check_out) - new Date(check_in)) / 86400000));
            total_price = (t.price_per_night || 0) * days * (guests || 1);
          } else if (target_type === 'activities') {
            total_price = (t.price || 0) * (guests || 1);
          } else if (target_type === 'tour_guides') {
            const days = check_out && check_in ? Math.max(1, Math.ceil((new Date(check_out) - new Date(check_in)) / 86400000)) : 1;
            total_price = (t.price_per_day || 0) * days;
          }
        }
      }
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          target_type,
          target_id,
          target_name,
          target_image,
          check_in: check_in || null,
          check_out: check_out || null,
          guests: guests || 1,
          total_price,
          status: 'PENDING'
        })
        .select()
        .single();
      if (error) throw error;
      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Booking submitted',
        body: `Your booking for ${target_name} is pending confirmation.`,
        link: '/dashboard/bookings'
      });
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'BOOKING_CREATED', entity_type: target_type, entity_id: target_id });
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      // Notify user
      await supabase.from('notifications').insert({
        user_id: data.user_id,
        title: `Booking ${status.toLowerCase()}`,
        body: `Your booking for ${data.target_name} has been ${status.toLowerCase()}.`,
        link: '/dashboard/bookings'
      });
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'BOOKING_UPDATED', entity_type: 'bookings', entity_id: id, details: { status } });
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Bookings API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
