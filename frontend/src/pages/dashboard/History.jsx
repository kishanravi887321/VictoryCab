import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import Loader, { EmptyState } from '../../components/Loader';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/api/v1/search-history').then(setItems).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState title="No search history" body="Your AI recommendation queries will appear here." />;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">Recent AI queries</h2>
      <div className="space-y-2">
        {items.map(h => (
          <div key={h.id} className="card p-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-[color:var(--color-muted)]" />
            <div className="flex-1">
              <div className="text-sm font-medium">{h.query}</div>
              <div className="text-xs text-[color:var(--color-muted)]">{JSON.stringify(h.filters).slice(0, 100)}</div>
            </div>
            <div className="text-xs text-[color:var(--color-muted)]">{timeAgo(h.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
