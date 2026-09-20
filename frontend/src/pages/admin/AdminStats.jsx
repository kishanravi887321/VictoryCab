import { useState, useEffect } from 'react';
import { Users, MapPin, Hotel, Calendar, Star, Building } from 'lucide-react';
import api from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function AdminStats() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/api/v1/admin/stats').then(setData); }, []);
  if (!data) return <Loader />;

  const stats = [
    { label: 'Users', value: data.total_users, icon: Users },
    { label: 'Destinations', value: data.total_destinations, icon: MapPin },
    { label: 'Hotels', value: data.total_hotels, icon: Hotel },
    { label: 'Bookings', value: data.total_bookings, icon: Calendar },
    { label: 'Reviews', value: data.total_reviews, icon: Star },
    { label: 'Businesses', value: data.total_businesses, icon: Building },
    { label: 'Pending biz', value: data.pending_businesses, icon: Building },
    { label: 'Reported reviews', value: data.reported_reviews, icon: Star },
  ];

  const maxCount = Math.max(...data.daily_series.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card p-4">
            <s.icon className="w-4 h-4 text-[color:var(--color-muted)]" />
            <div className="font-display text-2xl font-semibold mt-2">{s.value}</div>
            <div className="text-xs text-[color:var(--color-muted)] uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <div className="font-display text-lg font-semibold mb-3">Bookings, last 7 days</div>
        <div className="flex items-end justify-between gap-2 h-40">
          {data.daily_series.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex-1 flex items-end w-full">
                <div className="w-full rounded-t-md bg-[color:var(--color-terra)]" style={{ height: `${(d.count / maxCount) * 100}%` }} />
              </div>
              <div className="text-[10px] text-[color:var(--color-muted)] font-mono">{d.date.slice(5)}</div>
              <div className="text-xs font-semibold">{d.count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="font-display text-lg font-semibold mb-3">Top destinations</div>
          <div className="space-y-2">
            {data.top_destinations?.map(d => (
              <div key={d.id} className="flex items-center justify-between text-sm py-1">
                <span>{d.name}</span>
                <span className="font-mono text-xs text-[color:var(--color-muted)]">{d.view_count} views · {Number(d.avg_rating).toFixed(1)}★</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="font-display text-lg font-semibold mb-3">Recent activity</div>
          <div className="space-y-2 text-sm">
            {(data.recent_events || []).slice(0, 10).map(e => (
              <div key={e.id} className="flex items-center justify-between py-1 border-b border-[color:var(--color-line)] last:border-0">
                <div><span className="font-mono text-xs">{e.event_type}</span>{e.entity_type && <span className="text-[color:var(--color-muted)] text-xs ml-1">· {e.entity_type}#{e.entity_id}</span>}</div>
                <span className="text-xs text-[color:var(--color-muted)]">{timeAgo(e.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
