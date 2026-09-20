import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { timeAgo } from '../../lib/utils';
import Loader, { EmptyState } from '../../components/Loader';

export default function MyReviews() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) api.get(`/api/v1/reviews?user_id=${profile.id}`).then(setItems).finally(() => setLoading(false));
  }, [profile]);

  if (loading) return <Loader />;
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">My reviews</h2>
      {items.length === 0 ? <EmptyState title="No reviews yet" body="Once you visit places, share your experience!" /> :
        <div className="space-y-3">{items.map(r => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center gap-1 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[color:var(--color-sun)] text-[color:var(--color-sun)]' : 'text-[color:var(--color-line)]'}`} />)}</div>
            <p className="text-sm">{r.comment}</p>
            <div className="text-xs text-[color:var(--color-muted)] mt-1 capitalize">{r.target_type.replace('_', ' ')} #{r.target_id} · {timeAgo(r.created_at)}</div>
          </div>
        ))}</div>}
    </div>
  );
}
