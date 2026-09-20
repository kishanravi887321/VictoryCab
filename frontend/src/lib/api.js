const destinations = [
  { id: 1, name: 'Jaipur', state: 'Rajasthan', description: 'Palaces, bazaars and stories in pink sandstone.', image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80', rating: 4.8, tags: ['heritage', 'food', 'photography'] },
  { id: 2, name: 'Alappuzha', state: 'Kerala', description: 'Slow mornings and still waters across the backwaters.', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80', rating: 4.7, tags: ['beach', 'romantic', 'wildlife'] },
  { id: 3, name: 'Leh', state: 'Ladakh', description: 'High-altitude roads, monasteries and wide-open skies.', image_url: 'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=900&q=80', rating: 4.9, tags: ['trekking', 'photography', 'adventure'] },
  { id: 4, name: 'Varanasi', state: 'Uttar Pradesh', description: 'A living riverfront of music, ritual and craft.', image_url: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80', rating: 4.6, tags: ['heritage', 'food', 'yoga'] },
  { id: 5, name: 'Goa', state: 'Goa', description: 'Palm-lined shores, local kitchens and golden evenings.', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80', rating: 4.7, tags: ['beach', 'food', 'romantic'] },
  { id: 6, name: 'Rishikesh', state: 'Uttarakhand', description: 'River air, forest trails and a quieter kind of energy.', image_url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80', rating: 4.8, tags: ['yoga', 'trekking', 'adventure'] },
  { id: 7, name: 'Udaipur', state: 'Rajasthan', description: 'Lakeside light and generous Mewari hospitality.', image_url: 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=900&q=80', rating: 4.8, tags: ['heritage', 'romantic', 'photography'] },
  { id: 8, name: 'Mysuru', state: 'Karnataka', description: 'Palace grandeur, fragrant markets and a calm pace.', image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80', rating: 4.6, tags: ['heritage', 'food', 'photography'] },
];

const hotels = destinations.slice(0, 4).map((destination, index) => ({
  id: index + 1,
  name: `${destination.name} House`,
  city: destination.name,
  image_url: destination.image_url,
  rating: destination.rating,
  price_per_night: 3200 + index * 850,
  description: 'A considered stay with local character, thoughtful rooms and warm hosting.',
}));

const activities = destinations.slice(0, 6).map((destination, index) => ({
  id: index + 1,
  name: `${destination.name} through local eyes`,
  destination: { name: destination.name },
  image_url: destination.image_url,
  rating: destination.rating,
  price: 900 + index * 250,
  description: 'A small-group experience shaped by the people who know this place best.',
}));

const reviews = [
  { id: 1, rating: 5, comment: 'The itinerary felt personal, useful and beautifully paced.', target_type: 'destination', user: { full_name: 'Ananya Rao' } },
  { id: 2, rating: 5, comment: 'Every recommendation led us somewhere worth lingering.', target_type: 'experience', user: { full_name: 'Kabir Mehta' } },
  { id: 3, rating: 4, comment: 'A thoughtful way to discover a new side of India.', target_type: 'hotel', user: { full_name: 'Mira Shah' } },
];

const demoUser = { id: 'demo-user', email: 'traveller@tourism360.demo' };
const demoProfile = { ...demoUser, full_name: 'Demo Traveller', role: 'TRAVELLER' };

function parseUrl(url) {
  return new URL(url, window.location.origin);
}

function collectionFor(pathname) {
  if (pathname.includes('/destinations')) return destinations;
  if (pathname.includes('/hotels')) return hotels;
  if (pathname.includes('/activities')) return activities;
  if (pathname.includes('/reviews')) return reviews;
  return [];
}

const api = {
  async get(url) {
    const parsed = parseUrl(url);
    const collection = collectionFor(parsed.pathname);
    const id = parsed.searchParams.get('id');
    if (id) return collection.find(item => String(item.id) === id) || collection[0] || null;
    if (parsed.pathname.includes('/profile')) return demoProfile;
    if (parsed.pathname.includes('/notifications')) return [];
    if (parsed.pathname.includes('/admin/stats')) return { users: 128, bookings: 64, businesses: 24, reviews: 312 };
    if (parsed.pathname.includes('/admin') || parsed.pathname.includes('/business')) return [];
    if (parsed.pathname.includes('/ai/chat')) return [];
    if (parsed.pathname.includes('/ai')) return { data: destinations.slice(0, 3) };
    if (collection.length) return { data: collection, total: collection.length };
    if (parsed.pathname.includes('/bookings') || parsed.pathname.includes('/favorites') || parsed.pathname.includes('/trips') || parsed.pathname.includes('/search-history')) return [];
    return { data: [] };
  },
  async post(url, body) { return { ...body, id: Date.now(), status: 'CONFIRMED' }; },
  async put() { return { success: true }; },
  async del() { return { success: true }; },
};

export { demoUser, demoProfile };
export default api;
