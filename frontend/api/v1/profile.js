import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error && error.code === 'PGRST116') {
        // Create profile if not exists
        const { data: newP, error: insErr } = await supabase
          .from('profiles')
          .insert({ id: user.id, email: user.email, full_name: user.user_metadata?.full_name || user.email.split('@')[0], role: 'TOURIST' })
          .select()
          .single();
        if (insErr) throw insErr;
        return res.status(200).json(newP);
      }
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { full_name, phone, preferences, avatar_url } = req.body;
      const updates = {};
      if (full_name !== undefined) updates.full_name = full_name;
      if (phone !== undefined) updates.phone = phone;
      if (preferences !== undefined) updates.preferences = preferences;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Profile API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
