import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../lib/api';
import { formatCurrency, formatRating } from '../lib/utils';
import Loader, { Spinner } from '../components/Loader';

const INTERESTS = ['heritage', 'beach', 'nature', 'adventure', 'spiritual', 'food', 'romantic', 'trekking', 'offbeat', 'photography', 'culture', 'wellness', 'wildlife', 'tea', 'coffee'];
const ACTIVITIES = ['adventure', 'watersports', 'cultural', 'nature', 'wellness', 'trekking', 'heritage', 'cruise'];
const TRAVEL_TYPES = ['leisure', 'solo', 'family', 'romantic', 'friends', 'business'];

export default function AIRecommend() {
  const [budget, setBudget] = useState('mid');
  const [days, setDays] = useState(5);
  const [travellers, setTravellers] = useState(2);
  const [travelType, setTravelType] = useState('leisure');
  const [season, setSeason] = useState('');
  const [interests, setInterests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleItem = (arr, setArr, item) => setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);

  const run = async () => {
    setLoading(true);
    try {
      const r = await api.post('/api/v1/ai/recommend', { budget, duration_days: days, travellers, travel_type: travelType, season, interests, activities });
      setResults(r);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-2">Smart Recommendations</h1>
      <p className="text-sm text-[color:var(--color-muted)] mb-8">Tell us your preferences — we'll rank destinations using Jaccard similarity, budget fit, ratings, and season match.</p>
      <div className="card p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Budget</label>
            <select value={budget} onChange={e => setBudget(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white">
              <option value="budget">Budget (₹10-20K)</option>
              <option value="mid">Mid-range (₹30-60K)</option>
              <option value="luxury">Luxury (₹80K+)</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Duration (days)</label>
            <input type="number" min={1} max={30} value={days} onChange={e => setDays(+e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Travellers</label>
            <input type="number" min={1} max={20} value={travellers} onChange={e => setTravellers(+e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Travel type</label>
            <select value={travelType} onChange={e => setTravelType(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white">
              {TRAVEL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Season</label>
            <input value={season} onChange={e => setSeason(e.target.value)} placeholder="e.g. winter, monsoon" className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => <button key={i} onClick={() => toggleItem(interests, setInterests, i)} className={`chip ${interests.includes(i) ? 'bg-[color:var(--color-terra)] text-white border-[color:var(--color-terra)]' : ''}`}>#{i}</button>)}
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-2 block">Preferred activities</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map(a => <button key={a} onClick={() => toggleItem(activities, setActivities, a)} className={`chip ${activities.includes(a) ? 'bg-[color:var(--color-sage)] text-white border-[color:var(--color-sage)]' : ''}`}>{a}</button>)}
          </div>
        </div>
        <button onClick={run} disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Spinner />} Get recommendations</button>
      </div>

      {results && (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold mb-2">Results</h2>
          <p className="text-sm text-[color:var(--color-muted)] mb-6">{results.explanation}</p>
          <div className="space-y-4">
            {results.results.map((r, i) => (
              <Link key={r.id} to={`/destinations/${r.id}`} className="card p-5 flex gap-4 hover:shadow-lg transition-shadow">
                <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-[color:var(--color-cream-2)]">
                  {r.hero_image && <img src={r.hero_image} alt={r.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-semibold text-[color:var(--color-terra)]">{i + 1}.</span>
                    <h3 className="font-display text-xl font-semibold">{r.name}</h3>
                    <span className="ml-auto font-display text-lg font-semibold">{r.score}/100</span>
                  </div>
                  <p className="text-sm text-[color:var(--color-muted)] mt-1">{r.tagline}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[color:var(--color-muted)]">
                    <span>Interest: {r.breakdown.interest_overlap}%</span>
                    <span>Budget fit: {r.breakdown.budget_fit}%</span>
                    <span>Rating: {formatRating(r.breakdown.rating)}/5</span>
                    <span>Season: {r.breakdown.season_match}%</span>
                    <span>Activities: {r.breakdown.activity_match}%</span>
                    <span>Est. cost: {formatCurrency(r.breakdown.est_cost)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
