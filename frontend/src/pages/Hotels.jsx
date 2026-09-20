import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { HotelCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function Hotels() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const dest = params.get('destination_id') || '';
  const sort = params.get('sort') || 'rating';
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => { api.get('/api/v1/destinations?limit=50&sort=name').then(r => setDestinations(r.data || [])); }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (dest) p.set('destination_id', dest);
    p.set('sort', sort);
    p.set('limit', '30');
    api.get(`/api/v1/hotels?${p.toString()}`).then(r => { setItems(r.data || []); setTotal(r.total || 0); }).finally(() => setLoading(false));
  }, [q, dest, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-semibold mb-6">Stays</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={dest} onChange={e => setParams({ ...Object.fromEntries(params), destination_id: e.target.value })} className="border border-[color:var(--color-line)] rounded-full px-3 py-2 bg-white text-sm">
          <option value="">All destinations</option>
          {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={sort} onChange={e => setParams({ ...Object.fromEntries(params), sort: e.target.value })} className="border border-[color:var(--color-line)] rounded-full px-3 py-2 bg-white text-sm">
          <option value="rating">Top rated</option>
          <option value="price_low">Price: low to high</option>
          <option value="price_high">Price: high to low</option>
        </select>
      </div>
      {loading ? <Loader /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(h => <HotelCard key={h.id} h={h} />)}</div>
      )}
    </div>
  );
}
