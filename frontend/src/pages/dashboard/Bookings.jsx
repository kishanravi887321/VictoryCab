import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import Loader from '../../components/Loader';

const STATUS_COLORS = { PENDING: 'bg-[color:var(--color-sun)]/20', CONFIRMED: 'bg-[color:var(--color-sage)]/20', CANCELLED: 'bg-[color:var(--color-terra)]/20', COMPLETED: 'bg-[color:var(--color-sky)]/20' };

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => api.get('/api/v1/bookings').then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => { if (confirm('Cancel this booking?')) { await api.put('/api/v1/bookings', { id, status: 'CANCELLED' }); load(); } };
  const filtered = filter ? items.filter(b => b.status === filter) : items;

  if (loading) return <Loader />;
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">My bookings</h2>
      <div className="flex gap-2 mb-4">
        {['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`chip ${filter === s ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)] border-[color:var(--color-ink)]' : ''}`}>{s || 'All'}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="card p-4 flex items-center gap-4">
            {b.target_image && <img src={b.target_image} className="w-14 h-14 rounded-lg object-cover" alt="" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium">{b.target_name}</div>
              <div className="text-xs text-[color:var(--color-muted)]">{formatDate(b.check_in)}{b.check_out ? ` → ${formatDate(b.check_out)}` : ''} · {b.guests} guest{b.guests > 1 ? 's' : ''}</div>
            </div>
            <span className={`chip capitalize ${STATUS_COLORS[b.status] || ''}`}>{b.status}</span>
            <div className="font-display font-semibold">{formatCurrency(b.total_price)}</div>
            {b.status === 'PENDING' && <button onClick={() => cancel(b.id)} className="text-xs text-[color:var(--color-terra)]">Cancel</button>}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-sm text-[color:var(--color-muted)]">No bookings found.</div>}
      </div>
    </div>
  );
}
