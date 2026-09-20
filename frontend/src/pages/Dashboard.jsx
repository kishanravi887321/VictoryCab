import { NavLink, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Heart, Map, Star, Clock, Settings } from 'lucide-react';

const TABS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { to: '/dashboard/trips', label: 'Trips', icon: Map },
  { to: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { to: '/dashboard/history', label: 'AI History', icon: Clock },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  const { profile } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">My account</div>
        <h1 className="font-display text-4xl font-semibold">Hey, {profile?.full_name?.split(' ')[0] || 'traveller'}</h1>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="card p-2 h-fit lg:sticky lg:top-24">
          {TABS.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)]' : 'hover:bg-[color:var(--color-cream-2)]'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </NavLink>
          ))}
          {['BUSINESS_OWNER', 'TOUR_GUIDE', 'TRAVEL_AGENT'].includes(profile?.role) && <Link to="/business" className="mt-3 block px-3 py-2 rounded-lg text-sm bg-[color:var(--color-cream-2)] hover:bg-[color:var(--color-line)]">Business console →</Link>}
          {['ADMIN', 'SUPER_ADMIN'].includes(profile?.role) && <Link to="/admin" className="mt-1 block px-3 py-2 rounded-lg text-sm bg-[color:var(--color-cream-2)] hover:bg-[color:var(--color-line)]">Admin console →</Link>}
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
