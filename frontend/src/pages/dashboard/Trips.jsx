import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import Loader, { EmptyState } from '../../components/Loader';

export default function Trips() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get('/api/v1/trips').then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const del = async (id) => { if (confirm('Delete trip?')) { await api.del('/api/v1/trips', { id }); load(); } };

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState title="No saved trips yet" body="Use the AI Trip Planner to create and save itineraries." />;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">My trips</h2>
      <div className="space-y-3">
        {items.map(t => (
          <div key={t.id} className="card p-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-[color:var(--color-muted)]">{formatDate(t.start_date)} → {formatDate(t.end_date)} · {t.travellers} travellers</div>
            </div>
            <div className="font-display font-semibold">{formatCurrency(t.total_cost_estimate)}</div>
            <button onClick={() => del(t.id)} className="text-xs text-[color:var(--color-terra)]">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
