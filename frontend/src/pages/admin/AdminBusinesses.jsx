import { useState, useEffect } from 'react';
import api from '../../lib/api';
import Loader from '../../components/Loader';

export default function AdminBusinesses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/api/v1/businesses').then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const update = async (id, status) => { await api.put('/api/v1/businesses', { id, status }); load(); };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Business verification queue</h2>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{b.business_type} · {b.owner?.full_name || 'Unknown'} · {b.owner?.email}</div>
                <div className="text-sm mt-1">{b.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`chip capitalize ${b.status === 'verified' ? 'bg-[color:var(--color-sage)]/20' : b.status === 'rejected' ? 'bg-[color:var(--color-terra)]/20' : ''}`}>{b.status}</span>
                {b.status === 'pending' && (
                  <>
                    <button onClick={() => update(b.id, 'verified')} className="btn-primary text-xs">Verify</button>
                    <button onClick={() => update(b.id, 'rejected')} className="text-xs text-[color:var(--color-terra)]">Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-[color:var(--color-muted)]">No businesses in queue.</div>}
      </div>
    </div>
  );
}
