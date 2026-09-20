import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Target, Map, MessageCircle, Star } from 'lucide-react';
import api from '../lib/api';
import { formatRating } from '../lib/utils';
import { DestinationCard, HotelCard, ActivityCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/destinations?limit=8&sort=popular'),
      api.get('/api/v1/hotels?limit=4&sort=rating'),
      api.get('/api/v1/activities?limit=6'),
      api.get('/api/v1/reviews?limit=6'),
    ]).then(([d, h, a, r]) => {
      setDestinations(d.data || []);
      setHotels(h.data || []);
      setActivities(a.data || []);
      setReviews((r || []).slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => { e.preventDefault(); navigate(`/destinations?q=${encodeURIComponent(query)}`); };

  if (loading) return <Loader label="Loading Tourism360…" />;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 stipple opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32 relative">
          <div className="flex items-center gap-2 mb-6 fade-up">
            <span className="chip bg-white"><Sparkles className="w-3 h-3 text-[color:var(--color-terra)]" /> AI Studio · SIH 2026 · PS 26204</span>
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-semibold leading-[0.98] tracking-tight max-w-4xl fade-up">
            Plan India by <em className="text-[color:var(--color-terra)] not-italic">feeling</em>,<br />
            book it by <em className="text-[color:var(--color-sage)] not-italic">reality</em>.
          </h1>
          <p className="mt-6 text-lg text-[color:var(--color-ink-2)] max-w-2xl fade-up">
            Tourism360 gives you grounded, AI-composed itineraries built from a verified database of hotels, guides and experiences — with real prices, real ratings, and real availability. No hallucinations.
          </p>
          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl fade-up">
            <div className="flex-1 flex items-center gap-3 bg-white border border-[color:var(--color-line)] rounded-full px-5 py-3 shadow-sm">
              <Search className="w-4 h-4 text-[color:var(--color-muted)]" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Jaipur, backwaters, adventure in Ladakh…" className="flex-1 outline-none bg-transparent text-sm" />
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-1">Search <ArrowRight className="w-4 h-4" /></button>
            <Link to="/ai/recommend" className="btn-ghost flex items-center justify-center gap-1 text-sm"><Sparkles className="w-4 h-4 text-[color:var(--color-terra)]" /> AI recommend</Link>
          </form>
          <div className="mt-10 flex flex-wrap gap-2 fade-up">
            {['heritage', 'beach', 'trekking', 'yoga', 'food', 'photography', 'wildlife', 'romantic'].map(t => (
              <Link key={t} to={`/destinations?tag=${t}`} className="chip hover:border-[color:var(--color-ink)]">#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Studio cards */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="grid md:grid-cols-3 gap-3">
          <AICard to="/ai/recommend" icon={Target} title="Smart recommendations" body="Get destinations ranked by real budget fit, interest overlap and season." accent="terra" />
          <AICard to="/ai/plan" icon={Map} title="AI trip planner" body="Day-wise itineraries composed from real hotels & attractions, route-optimised." accent="sage" />
          <AICard to="/ai/chat" icon={MessageCircle} title="Grounded chatbot" body="Ask anything — answers cite only verified DB entries, never hallucinated." accent="sky" />
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Trending now</div>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold">Destinations tourists can't stop viewing</h2>
          </div>
          <Link to="/destinations" className="hidden md:inline-flex items-center gap-1 text-sm font-medium link-underline">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.slice(0, 8).map(d => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>

      {/* Hotels + Reviews */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Signature stays</div>
          <h2 className="font-display text-3xl font-semibold mb-6">Verified hotels loved by our travellers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {hotels.slice(0, 4).map(h => <HotelCard key={h.id} h={h} />)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Real voices</div>
          <h2 className="font-display text-3xl font-semibold mb-6">From the community</h2>
          <div className="space-y-3">
            {reviews.length === 0 ? <div className="card p-4 text-sm text-[color:var(--color-muted)]">No reviews yet.</div> :
              reviews.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[color:var(--color-sun)] text-[color:var(--color-sun)]' : 'text-[color:var(--color-line)]'}`} />)}
                    <span className="text-xs ml-1 text-[color:var(--color-muted)]">{formatRating(r.rating)}</span>
                  </div>
                  <p className="text-sm">{r.comment}</p>
                  <div className="text-xs text-[color:var(--color-muted)] mt-2">— {r.user?.full_name || 'Traveller'} · {r.target_type}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Do more than sightsee</div>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold">Trending experiences</h2>
          </div>
          <Link to="/experiences" className="hidden md:inline-flex items-center gap-1 text-sm font-medium link-underline">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.slice(0, 6).map(a => <ActivityCard key={a.id} a={a} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[color:var(--color-ink)] text-[color:var(--color-cream)] p-10 lg:p-16">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[color:var(--color-terra)] opacity-20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[color:var(--color-sage)] opacity-20 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="chip bg-white/10 text-[color:var(--color-cream)] border-white/20 mb-4">For local businesses</div>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-tight">Own a hotel, restaurant, or run tours?</h2>
            <p className="mt-4 text-[color:var(--color-cream-2)] max-w-xl">List your business, get verified by our admin team, and start receiving bookings from travellers who match your specialty.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/business/register" className="btn-primary">List your business</Link>
              <Link to="/business" className="btn-ghost text-[color:var(--color-ink)]">Business console</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AICard({ to, icon: Icon, title, body, accent }) {
  const color = accent === 'terra' ? 'var(--color-terra)' : accent === 'sage' ? 'var(--color-sage)' : 'var(--color-sky)';
  return (
    <Link to={to} className="group card p-6 hover:shadow-xl transition-shadow relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: color }} />
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4" style={{ background: color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-xl font-semibold">{title}</div>
      <div className="text-sm text-[color:var(--color-muted)] mt-2 mb-6">{body}</div>
      <div className="flex items-center gap-1 text-sm font-medium">Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
    </Link>
  );
}
