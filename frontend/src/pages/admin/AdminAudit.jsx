import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function AdminAudit() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/v1/admin/audit').then(r => setItems(r.data || [])).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader />;
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Audit log</h2>
      <div className="space-y-2">
        {items.map(e => (
          <div key={e.id} className="card p-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs">{e.event_type}</span>
              {e.entity_type && <span className="text-[color:var(--color-muted)] text-xs ml-1">· {e.entity_type}#{e.entity_id}</span>}
              {e.details && Object.keys(e.details).length > 0 && <span className="text-xs text-[color:var(--color-muted)] ml-2">{JSON.stringify(e.details)}</span>}
            </div>
            <span className="text-xs text-[color:var(--color-muted)]">{timeAgo(e.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
