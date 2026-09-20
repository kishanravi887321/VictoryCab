import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState(false);

  const load = () => api.get(`/api/v1/reviews${reported ? '?reported=true' : ''}`).then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, [reported]);

  const moderate = async (id, action) => { await api.put('/api/v1/reviews', { id, action }); load(); };

  if (loading) return <Loader />;
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Review moderation</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setReported(false)} className={`chip ${!reported ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)] border-[color:var(--color-ink)]' : ''}`}>All</button>
        <button onClick={() => setReported(true)} className={`chip ${reported ? 'bg-[color:var(--color-terra)] text-white border-[color:var(--color-terra)]' : ''}`}>Reported</button>
      </div>
      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="card p-4 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-[color:var(--color-sun)] text-[color:var(--color-sun)]' : 'text-[color:var(--color-line)]'}`} />)}</div>
              <p className="text-sm">{r.comment}</p>
              <div className="text-xs text-[color:var(--color-muted)] mt-1">{r.user?.full_name} · {r.target_type} #{r.target_id} · {timeAgo(r.created_at)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => moderate(r.id, 'approve')} className="text-xs text-[color:var(--color-sage)]">Approve</button>
              <button onClick={() => moderate(r.id, 'delete')} className="text-xs text-[color:var(--color-terra)]">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
