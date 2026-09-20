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
    const { event_type, page } = req.query;
    const p = parseInt(page) || 0;
    let query = supabase.from('audit_log').select('*', { count: 'exact' });
    if (event_type) query = query.eq('event_type', event_type);
    query = query.order('created_at', { ascending: false }).range(p * 30, (p + 1) * 30 - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return res.status(200).json({ data: data || [], total: count || 0 });
  } catch (err) {
    console.error('Admin audit API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
