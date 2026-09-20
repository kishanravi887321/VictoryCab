import supabase from '../../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!['ADMIN', 'SUPER_ADMIN'].includes(profile?.role)) return res.status(403).json({ error: 'Forbidden' });

  try {
    if (req.method === 'GET') {
      const { q, role, page } = req.query;
      const p = parseInt(page) || 0;
      let query = supabase.from('profiles').select('*', { count: 'exact' });
      if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
      if (role) query = query.eq('role', role);
      query = query.order('created_at', { ascending: false }).range(p * 20, (p + 1) * 20 - 1);
      const { data, error, count } = await query;
      if (error) throw error;
      return res.status(200).json({ data: data || [], total: count || 0 });
    }

    if (req.method === 'PUT') {
      const { id, role, blocked } = req.body;
      const updates = {};
      if (role !== undefined) updates.role = role;
      if (blocked !== undefined) updates.blocked = blocked;
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (error) throw error;
      await supabase.from('audit_log').insert({ user_id: user.id, event_type: role ? 'USER_ROLE_CHANGED' : 'USER_BLOCKED', entity_type: 'profiles', entity_id: 0, details: { target_user: id, ...updates } });
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin users API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
