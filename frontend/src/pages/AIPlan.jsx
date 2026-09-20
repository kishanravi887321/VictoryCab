import { useState, useEffect } from 'react';
import api from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { Spinner } from '../components/Loader';
import { Sun, Moon, Coffee, Utensils, Hotel, MapPin } from 'lucide-react';

export default function AIPlan() {
  const [destinations, setDestinations] = useState([]);
  const [destId, setDestId] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('mid');
  const [travellers, setTravellers] = useState(2);
  const [interests, setInterests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/api/v1/destinations?limit=50&sort=name').then(r => setDestinations(r.data || [])); }, []);

  const run = async () => {
    if (!destId) { alert('Select a destination'); return; }
    setLoading(true);
    try {
      const r = await api.post('/api/v1/ai/plan', { destination_id: parseInt(destId), days, budget, travellers, interests, start_date: startDate || undefined, save: true, title: `${days}-day ${destinations.find(d => d.id === parseInt(destId))?.name || 'trip'}` });
      setResult(r);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const iconMap = { morning: Sun, afternoon: MapPin, lunch: Coffee, dinner: Utensils, hotel: Hotel };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-2">AI Trip Planner</h1>
      <p className="text-sm text-[color:var(--color-muted)] mb-8">Compose day-wise itineraries using real hotels, attractions, and restaurants from our verified database.</p>
      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Destination</label>
            <select value={destId} onChange={e => setDestId(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white">
              <option value="">Select…</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Days</label>
            <input type="number" min={1} max={14} value={days} onChange={e => setDays(+e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Start date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Travellers</label>
            <input type="number" min={1} max={20} value={travellers} onChange={e => setTravellers(+e.target.value)} className="w-full mt-1 border border-[color:var(--color-line)] rounded-lg px-3 py-2 bg-white" />
          </div>
        </div>
        <button onClick={run} disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Spinner />} Generate itinerary</button>
      </div>

      {result && (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold mb-1">{result.destination?.name} — {result.itinerary.length}-day plan</h2>
          <p className="text-sm text-[color:var(--color-muted)] mb-6">Estimated total: {formatCurrency(result.total_cost_estimate)} · {result.explanation}</p>
          <div className="space-y-4">
            {result.itinerary.map(day => {
              const p = day.day_plan || {};
              return (
                <div key={day.day} className="card p-5">
                  <div className="font-display text-lg font-semibold mb-3">Day {day.day} {day.date ? `— ${day.date}` : ''}</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {['morning', 'afternoon', 'lunch', 'dinner', 'hotel'].map(slot => {
                      const item = p[slot];
                      if (!item) return null;
                      const Icon = iconMap[slot] || Sun;
                      return (
                        <div key={slot} className="flex items-center gap-3 py-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[color:var(--color-cream-2)]">
                            <Icon className="w-4 h-4 text-[color:var(--color-muted)]" />
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">{slot}</div>
                            <div className="text-sm font-medium">{item.name}</div>
                            {item.price != null && <div className="text-xs text-[color:var(--color-muted)]">{formatCurrency(item.price)}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
