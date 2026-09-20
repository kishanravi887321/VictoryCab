import { useState, useEffect } from 'react';
import { Star, Building, Calendar, DollarSign, Eye } from 'lucide-react';
import api from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function BusinessOverview() {
  const [data, setData] = useState(null);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/api/v1/business-analytics'), api.get('/api/v1/businesses')]).then(([d, b]) => { setData(d); setBusinesses(b); });
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-3">
        <Stat label="Listings" value={data.metrics.total_listings} icon={Building} />
        <Stat label="Total bookings" value={data.metrics.total_bookings} icon={Calendar} />
        <Stat label="Revenue" value={formatCurrency(data.metrics.total_revenue)} icon={DollarSign} />
        <Stat label="Total views" value={data.metrics.total_views} icon={Eye} />
      </div>
      <div className="card p-5">
        <div className="font-display text-lg font-semibold mb-3">Your businesses</div>
        {businesses.length === 0 ? <div className="text-sm text-[color:var(--color-muted)]">No business registered yet.</div> :
          businesses.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-[color:var(--color-line)] last:border-0">
              <div>
                <div className="font-medium text-sm">{b.name}</div>
                <div className="text-xs text-[color:var(--color-muted)] capitalize">{b.business_type}</div>
              </div>
              <span className={`chip capitalize ${b.status === 'verified' ? 'bg-[color:var(--color-sage)]/20' : b.status === 'rejected' ? 'bg-[color:var(--color-terra)]/20' : ''}`}>{b.status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="card p-4">
      <Icon className="w-4 h-4 text-[color:var(--color-muted)]" />
      <div className="font-display text-2xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-[color:var(--color-muted)] uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}
