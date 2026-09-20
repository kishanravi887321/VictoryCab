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
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      // Admin can see all, business owners see their own
      if (['ADMIN', 'SUPER_ADMIN'].includes(profile?.role)) {
        const status = req.query.status;
        let query = supabase.from('businesses').select('*, owner:profiles(full_name, email)').order('created_at', { ascending: false });
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json(data || []);
      }
      const { data, error } = await supabase.from('businesses').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { business_type, name, description, address, phone, website } = req.body;
      const { data, error } = await supabase
        .from('businesses')
        .insert({ owner_id: user.id, business_type, name, description, address, phone, website, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      // Update profile role
      await supabase.from('profiles').update({ role: 'BUSINESS_OWNER' }).eq('id', user.id);
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'BUSINESS_REGISTERED', entity_type: 'businesses', entity_id: data.id });
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!['ADMIN', 'SUPER_ADMIN'].includes(profile?.role)) return res.status(403).json({ error: 'Forbidden' });
      const { data, error } = await supabase.from('businesses').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: 'BUSINESS_STATUS_CHANGED', entity_type: 'businesses', entity_id: id, details: { status } });
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Businesses API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
