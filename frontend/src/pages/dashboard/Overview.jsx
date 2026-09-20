import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Map, Star, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function Overview() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/bookings'),
      api.get('/api/v1/favorites'),
      api.get('/api/v1/trips'),
      profile?.id ? api.get(`/api/v1/reviews?user_id=${profile.id}`) : Promise.resolve([]),
    ]).then(([b, f, t, r]) => { setBookings(b); setFavorites(f); setTrips(t); setReviews(r); });
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-3">
        <StatCard label="Bookings" value={bookings.length} to="/dashboard/bookings" icon={Calendar} />
        <StatCard label="Trips saved" value={trips.length} to="/dashboard/trips" icon={Map} />
        <StatCard label="Favorites" value={favorites.length} to="/dashboard/favorites" icon={Heart} />
        <StatCard label="Reviews" value={reviews.length} to="/dashboard/reviews" icon={Star} />
      </div>
      <div className="card p-6 bg-[color:var(--color-ink)] text-[color:var(--color-cream)] border-transparent relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[color:var(--color-terra)] opacity-30 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--color-cream-2)]"><Sparkles className="w-3 h-3" /> AI Studio</div>
          <h2 className="font-display text-2xl font-semibold mt-1">Personalised for {profile?.full_name?.split(' ')[0]}</h2>
          <p className="text-sm text-[color:var(--color-cream-2)] mt-2 max-w-xl">Based on your travel preferences — {profile?.preferences?.interests?.map(i => `#${i}`).join(' ') || 'no interests set yet'}.</p>
          <div className="flex gap-2 mt-4">
            <Link to="/ai/recommend" className="btn-primary text-sm">Get recommendations</Link>
            <Link to="/ai/plan" className="btn-ghost text-sm text-[color:var(--color-ink)]">Plan a trip</Link>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-lg font-semibold">Upcoming bookings</div>
            <Link to="/dashboard/bookings" className="text-xs text-[color:var(--color-terra)]">See all</Link>
          </div>
          {bookings.slice(0, 3).map(b => (
            <div key={b.id} className="flex items-center gap-3 py-2 border-b border-[color:var(--color-line)] last:border-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-1">{b.target_name}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{formatDate(b.check_in)} · {b.status}</div>
              </div>
              <div className="text-sm font-medium">{formatCurrency(b.total_price)}</div>
            </div>
          ))}
          {bookings.length === 0 && <div className="text-sm text-[color:var(--color-muted)]">No bookings yet.</div>}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-lg font-semibold">Saved trips</div>
            <Link to="/dashboard/trips" className="text-xs text-[color:var(--color-terra)]">See all</Link>
          </div>
          {trips.slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2 border-b border-[color:var(--color-line)] last:border-0">
              <div className="flex-1">
                <div className="font-medium text-sm">{t.title}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{formatDate(t.start_date)} → {formatDate(t.end_date)}</div>
              </div>
              <div className="text-sm font-medium">{formatCurrency(t.total_cost_estimate)}</div>
            </div>
          ))}
          {trips.length === 0 && <div className="text-sm text-[color:var(--color-muted)]">No saved trips yet.</div>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, to, icon: Icon }) {
  return (
    <Link to={to} className="card p-4 hover:shadow-lg transition-shadow">
      <Icon className="w-4 h-4 text-[color:var(--color-muted)]" />
      <div className="font-display text-3xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-[color:var(--color-muted)] uppercase tracking-widest mt-1">{label}</div>
    </Link>
  );
}
