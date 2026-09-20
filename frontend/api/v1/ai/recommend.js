import supabase from '../../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    const { budget, duration_days, travellers, travel_type, season, interests, activities: prefActivities } = req.body;

    // Fetch all destinations
    const { data: destinations } = await supabase.from('destinations').select('*');
    if (!destinations || destinations.length === 0) return res.status(200).json({ results: [], explanation: 'No destinations in database.' });

    // Fetch hotels for budget estimation
    const { data: allHotels } = await supabase.from('hotels').select('destination_id, price_per_night');
    const hotelPriceMap = {};
    (allHotels || []).forEach(h => {
      if (!hotelPriceMap[h.destination_id]) hotelPriceMap[h.destination_id] = [];
      hotelPriceMap[h.destination_id].push(h.price_per_night);
    });

    // Fetch activities for activity matching
    const { data: allActivities } = await supabase.from('activities').select('destination_id, category');
    const activityMap = {};
    (allActivities || []).forEach(a => {
      if (!activityMap[a.destination_id]) activityMap[a.destination_id] = new Set();
      activityMap[a.destination_id].add(a.category?.toLowerCase());
    });

    // Score each destination
    const budgetNum = parseBudget(budget);
    const userInterests = (interests || []).map(i => i.toLowerCase());
    const userActivities = (prefActivities || []).map(a => a.toLowerCase());
    const userSeason = (season || '').toLowerCase();

    const scored = destinations.map(d => {
      let score = 0;
      const breakdown = {};

      // 1. Interest overlap (Jaccard)
      const destTags = (d.tags || []).map(t => t.toLowerCase());
      const interUnion = new Set([...userInterests, ...destTags]);
      const interIntersect = userInterests.filter(i => destTags.includes(i));
      const interestScore = interUnion.size > 0 ? interIntersect.length / interUnion.size : 0;
      score += interestScore * 35;
      breakdown.interest_overlap = Math.round(interestScore * 100);

      // 2. Budget fit
      const prices = hotelPriceMap[d.id] || [];
      const avgPrice = prices.length > 0 ? prices.reduce((s, p) => s + p, 0) / prices.length : 3000;
      const estCost = avgPrice * (duration_days || 3) * (travellers || 1);
      const budgetFit = budgetNum > 0 ? Math.max(0, 1 - Math.abs(estCost - budgetNum) / budgetNum) : 0.5;
      score += budgetFit * 25;
      breakdown.budget_fit = Math.round(budgetFit * 100);
      breakdown.est_cost = Math.round(estCost);

      // 3. Rating normalization
      const ratingScore = (d.avg_rating || 0) / 5;
      score += ratingScore * 20;
      breakdown.rating = d.avg_rating || 0;

      // 4. Season match
      const destSeasons = (d.best_season || '').toLowerCase();
      const seasonMatch = userSeason && destSeasons.includes(userSeason) ? 1 : destSeasons ? 0.3 : 0.5;
      score += seasonMatch * 10;
      breakdown.season_match = Math.round(seasonMatch * 100);

      // 5. Activity availability
      const destActs = activityMap[d.id] || new Set();
      const actMatch = userActivities.filter(a => destActs.has(a)).length;
      const actScore = userActivities.length > 0 ? actMatch / userActivities.length : 0.5;
      score += actScore * 10;
      breakdown.activity_match = Math.round(actScore * 100);

      return { ...d, score: Math.round(score * 10) / 10, breakdown };
    });

    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, 8);

    // Save search history
    await supabase.from('search_history').insert({
      user_id: user.id,
      query: 'AI Recommendation',
      filters: { budget, duration_days, travellers, travel_type, season, interests, activities: prefActivities }
    });

    return res.status(200).json({
      results,
      explanation: `Ranked ${destinations.length} destinations using Jaccard interest similarity (35%), budget fit (25%), community rating (20%), season match (10%), and activity availability (10%). All scores from verified DB rows.`
    });
  } catch (err) {
    console.error('AI Recommend error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function parseBudget(b) {
  if (!b) return 0;
  if (typeof b === 'number') return b;
  const s = String(b).toLowerCase().replace(/[₹,\s]/g, '');
  if (s === 'budget' || s === 'low') return 15000;
  if (s === 'mid' || s === 'medium') return 40000;
  if (s === 'luxury' || s === 'high') return 100000;
  return parseInt(s) || 40000;
}
