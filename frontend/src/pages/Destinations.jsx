import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { DestinationCard } from '../components/Cards';
import Loader from '../components/Loader';

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const tag = params.get('tag') || '';
  const region = params.get('region') || '';
  const sort = params.get('sort') || 'popular';
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (tag) p.set('tag', tag);
    if (region) p.set('region', region);
    p.set('sort', sort);
    p.set('limit', '24');
    api.get(`/api/v1/destinations?${p.toString()}`).then(r => { setItems(r.data || []); setTotal(r.total || 0); }).catch(console.error).finally(() => setLoading(false));
  }, [q, tag, region, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)] mb-1">Explore</div>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold">Destinations</h1>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={e => { e.preventDefault(); setParams({ ...Object.fromEntries(params), q: search }); }} className="flex-1 min-w-[200px]">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations…" className="w-full border border-[color:var(--color-line)] rounded-full px-4 py-2 bg-white text-sm outline-none focus:border-[color:var(--color-ink)]" />
        </form>
        <select value={sort} onChange={e => setParams({ ...Object.fromEntries(params), sort: e.target.value })} className="border border-[color:var(--color-line)] rounded-full px-3 py-2 bg-white text-sm">
          <option value="popular">Most popular</option>
          <option value="rating">Top rated</option>
          <option value="name">A–Z</option>
          <option value="newest">Newest</option>
        </select>
        {['heritage', 'beach', 'nature', 'adventure', 'spiritual', 'food', 'romantic', 'trekking', 'offbeat'].map(t => (
          <button key={t} onClick={() => setParams({ ...Object.fromEntries(params), tag: tag === t ? '' : t })} className={`chip ${tag === t ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)] border-[color:var(--color-ink)]' : ''}`}>#{t}</button>
        ))}
      </div>
      {loading ? <Loader /> : (
        <>
          <div className="text-sm text-[color:var(--color-muted)] mb-4">{total} destination{total !== 1 ? 's' : ''} found</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(d => <DestinationCard key={d.id} d={d} />)}
          </div>
        </>
      )}
    </div>
  );
}
