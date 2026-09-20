import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, List, Calendar, PlusCircle } from 'lucide-react';

const TABS = [
  { to: '/business', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/business/listings', label: 'Listings', icon: List },
  { to: '/business/bookings', label: 'Bookings', icon: Calendar },
  { to: '/business/register', label: 'Register new', icon: PlusCircle },
];

export default function BusinessConsole() {
  const { profile } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-muted)]">Business console</div>
        <h1 className="font-display text-4xl font-semibold">{profile?.full_name}</h1>
      </div>
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="card p-2 h-fit lg:sticky lg:top-24">
          {TABS.map(t => <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)]' : 'hover:bg-[color:var(--color-cream-2)]'}`}><t.icon className="w-4 h-4" />{t.label}</NavLink>)}
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
