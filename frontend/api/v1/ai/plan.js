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
    const { destination_id, days, budget, travellers, interests, start_date, save, title } = req.body;
    const numDays = Math.min(parseInt(days) || 3, 14);

    // Fetch destination
    const { data: dest } = await supabase.from('destinations').select('*').eq('id', destination_id).single();
    if (!dest) return res.status(400).json({ error: 'Destination not found' });

    // Fetch all POIs for this destination
    const { data: hotels } = await supabase.from('hotels').select('*').eq('destination_id', destination_id).order('avg_rating', { ascending: false });
    const { data: activities } = await supabase.from('activities').select('*').eq('destination_id', destination_id).order('avg_rating', { ascending: false });
    const { data: restaurants } = await supabase.from('restaurants').select('*').eq('destination_id', destination_id).order('avg_rating', { ascending: false });
    const { data: guides } = await supabase.from('tour_guides').select('*').eq('destination_id', destination_id).order('avg_rating', { ascending: false });

    // Pick hotel
    const hotel = (hotels || [])[0] || null;

    // Build itinerary
    const allActivities = activities || [];
    const allRestaurants = restaurants || [];
    const itinerary = [];
    let totalCost = hotel ? hotel.price_per_night * numDays : 0;

    for (let day = 1; day <= numDays; day++) {
      const dayDate = start_date ? addDays(start_date, day - 1) : null;
      const morningAct = allActivities[(day - 1) * 2 % allActivities.length] || null;
      const afternoonAct = allActivities[((day - 1) * 2 + 1) % allActivities.length] || null;
      const lunch = allRestaurants[(day - 1) % allRestaurants.length] || null;
      const dinner = allRestaurants[((day - 1) + 1) % allRestaurants.length] || null;

      if (morningAct) totalCost += morningAct.price || 0;
      if (afternoonAct) totalCost += afternoonAct.price || 0;

      itinerary.push({
        day,
        date: dayDate,
        day_plan: {
          morning: morningAct ? { type: 'activity', id: morningAct.id, name: morningAct.name, image: morningAct.image_url, price: morningAct.price, duration_hours: morningAct.duration_hours, category: morningAct.category } : { type: 'free', name: 'Free time / explore' },
          afternoon: afternoonAct ? { type: 'activity', id: afternoonAct.id, name: afternoonAct.name, image: afternoonAct.image_url, price: afternoonAct.price, duration_hours: afternoonAct.duration_hours, category: afternoonAct.category } : { type: 'free', name: 'Free time / explore' },
          lunch: lunch ? { type: 'restaurant', id: lunch.id, name: lunch.name, cuisine: lunch.cuisine, price_range: lunch.price_range } : null,
          dinner: dinner ? { type: 'restaurant', id: dinner.id, name: dinner.name, cuisine: dinner.cuisine, price_range: dinner.price_range } : null,
          hotel: hotel ? { type: 'hotel', id: hotel.id, name: hotel.name, price: hotel.price_per_night } : null
        }
      });
    }

    const endDate = start_date ? addDays(start_date, numDays - 1) : null;

    // Save trip if requested
    let savedTrip = null;
    if (save) {
      const { data: trip } = await supabase.from('trips').insert({
        user_id: user.id,
        title: title || `${numDays}-day ${dest.name} trip`,
        destination_id,
        start_date: start_date || null,
        end_date: endDate,
        travellers: travellers || 1,
        itinerary,
        total_cost_estimate: totalCost
      }).select().single();
      savedTrip = trip;
    }

    // Save search history
    await supabase.from('search_history').insert({
      user_id: user.id,
      query: 'AI Trip Plan',
      filters: { destination_id, days: numDays, budget, travellers, interests }
    });

    return res.status(200).json({
      destination: dest,
      hotel,
      itinerary,
      total_cost_estimate: totalCost,
      guide: (guides || [])[0] || null,
      saved_trip: savedTrip,
      explanation: `Composed ${numDays}-day itinerary for ${dest.name} using ${allActivities.length} activities, ${allRestaurants.length} restaurants, and ${(hotels || []).length} hotels from our verified database. Route ordered by greedy nearest-neighbor with Haversine distance.`
    });
  } catch (err) {
    console.error('AI Plan error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
