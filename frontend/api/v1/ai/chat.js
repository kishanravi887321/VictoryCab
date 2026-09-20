import supabase from '../../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    if (req.method === 'GET') {
      const { conversation_id } = req.query;
      if (conversation_id) {
        const { data, error } = await supabase.from('conversations').select('*').eq('id', conversation_id).eq('user_id', user.id).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase.from('conversations').select('id, title, created_at, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { message, conversation_id } = req.body;
      if (!message) return res.status(400).json({ error: 'Message required' });

      // Search the database for relevant info
      const query = message.toLowerCase();
      const sources = [];

      // Search destinations
      const { data: dests } = await supabase.from('destinations').select('id, name, tagline, region, avg_rating, best_season, tags').or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%,region.ilike.%${query}%`).limit(3);
      (dests || []).forEach(d => sources.push({ type: 'destination', id: d.id, name: d.name, detail: `${d.tagline} | Region: ${d.region} | Rating: ${d.avg_rating}/5 | Season: ${d.best_season} | Tags: ${(d.tags || []).join(', ')}` }));

      // Search hotels
      const { data: htls } = await supabase.from('hotels').select('id, name, address, price_per_night, avg_rating, rating_stars').or(`name.ilike.%${query}%,address.ilike.%${query}%`).limit(3);
      (htls || []).forEach(h => sources.push({ type: 'hotel', id: h.id, name: h.name, detail: `${h.address} | ₹${h.price_per_night}/night | ${h.rating_stars}★ | Rating: ${h.avg_rating}/5` }));

      // Search activities
      const { data: acts } = await supabase.from('activities').select('id, name, category, price, difficulty, avg_rating').or(`name.ilike.%${query}%,category.ilike.%${query}%`).limit(3);
      (acts || []).forEach(a => sources.push({ type: 'activity', id: a.id, name: a.name, detail: `${a.category} | ₹${a.price} | ${a.difficulty} | Rating: ${a.avg_rating}/5` }));

      // Search restaurants
      const { data: rests } = await supabase.from('restaurants').select('id, name, cuisine, avg_rating').or(`name.ilike.%${query}%`).limit(2);
      (rests || []).forEach(r => sources.push({ type: 'restaurant', id: r.id, name: r.name, detail: `Cuisine: ${(r.cuisine || []).join(', ')} | Rating: ${r.avg_rating}/5` }));

      // Search tour guides
      const { data: tgs } = await supabase.from('tour_guides').select('id, name, specialties, avg_rating, price_per_day').or(`name.ilike.%${query}%`).limit(2);
      (tgs || []).forEach(g => sources.push({ type: 'tour_guide', id: g.id, name: g.name, detail: `Specialties: ${(g.specialties || []).join(', ')} | ₹${g.price_per_day}/day | Rating: ${g.avg_rating}/5` }));

      // Compose grounded answer
      let answer = '';
      if (sources.length > 0) {
        answer = `Based on our verified database, here's what I found:\n\n`;
        sources.forEach((s, i) => {
          answer += `**${i + 1}. ${s.name}** (${s.type})\n${s.detail}\n\n`;
        });
        answer += `All information above comes directly from Tourism360's verified database — no hallucinated facts. You can click through to see full details, reviews, and booking options.`;
      } else {
        // Broader search
        const { data: allDests } = await supabase.from('destinations').select('id, name, tagline, region, avg_rating').order('avg_rating', { ascending: false }).limit(5);
        if (allDests && allDests.length > 0) {
          answer = `I couldn't find an exact match for "${message}", but here are our top-rated destinations:\n\n`;
          allDests.forEach((d, i) => {
            answer += `**${i + 1}. ${d.name}** — ${d.tagline} (${d.region}, ${d.avg_rating}/5★)\n`;
            sources.push({ type: 'destination', id: d.id, name: d.name, detail: d.tagline });
          });
          answer += `\nTry asking about a specific destination, activity type, or hotel!`;
        } else {
          answer = `I don't have specific information about that yet. Try asking about Indian destinations, hotels, activities, or restaurants!`;
        }
      }

      // Save conversation
      let convId = conversation_id;
      if (!convId) {
        const { data: conv } = await supabase.from('conversations').insert({
          user_id: user.id,
          title: message.slice(0, 60),
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: answer, sources }
          ]
        }).select().single();
        convId = conv?.id;
      } else {
        const { data: existing } = await supabase.from('conversations').select('messages').eq('id', convId).single();
        const msgs = existing?.messages || [];
        msgs.push({ role: 'user', content: message });
        msgs.push({ role: 'assistant', content: answer, sources });
        await supabase.from('conversations').update({ messages: msgs, updated_at: new Date().toISOString() }).eq('id', convId);
      }

      return res.status(200).json({ answer, sources, conversation_id: convId });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await supabase.from('conversations').delete().eq('id', id).eq('user_id', user.id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('AI Chat error:', err);
    return res.status(500).json({ error: err.message });
  }
}
