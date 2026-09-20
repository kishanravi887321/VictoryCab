import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { ActivityCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function Experiences() {
  const [params, setParams] = useSearchParams();
  const dest = params.get('destination_id') || '';
  const cat = params.get('category') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => { api.get('/api/v1/destinations?limit=50&sort=name').then(r => setDestinations(r.data || [])); }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (dest) p.set('destination_id', dest);
    if (cat) p.set('category', cat);
    p.set('limit', '30');
    api.get(`/api/v1/activities?${p.toString()}`).then(r => setItems(r.data || [])).finally(() => setLoading(false));
  }, [dest, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-6">Experiences</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={dest} onChange={e => setParams({ ...Object.fromEntries(params), destination_id: e.target.value })} className="border border-[color:var(--color-line)] rounded-full px-3 py-2 bg-white text-sm">
          <option value="">All destinations</option>
          {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {['adventure', 'watersports', 'cultural', 'nature', 'wellness', 'trekking', 'heritage', 'food'].map(c => (
          <button key={c} onClick={() => setParams({ ...Object.fromEntries(params), category: cat === c ? '' : c })} className={`chip capitalize ${cat === c ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)] border-[color:var(--color-ink)]' : ''}`}>{c}</button>
        ))}
      </div>
      {loading ? <Loader /> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(a => <ActivityCard key={a.id} a={a} />)}</div>}
    </div>
  );
}
