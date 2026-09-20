import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Compass, Search, Bell, ChevronDown, LogOut, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { timeAgo } from '../lib/utils';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/hotels', label: 'Stays' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/guides', label: 'Guides' },
  { to: '/ai', label: 'AI Studio', icon: Sparkles },
];

export default function Layout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unread = notifications.filter(n => !n.read).length;

  const loadNotifs = () => api.get('/api/v1/notifications').then(setNotifications).catch(() => {});
  const markRead = async (id) => {
    if (id) { await api.put('/api/v1/notifications', { id }); }
    else { await api.put('/api/v1/notifications', { all: true }); }
    setNotifications(n => id ? n.map(x => x.id === id ? { ...x, read: true } : x) : n.map(x => ({ ...x, read: true })));
  };

  useEffect(() => { if (user) loadNotifs(); }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-cream)]/85 border-b border-[color:var(--color-line)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[color:var(--color-terra)] flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="font-display text-xl font-semibold leading-none">
              Tourism<span className="text-[color:var(--color-terra)]">360</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => `px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)]' : 'text-[color:var(--color-ink-2)] hover:bg-[color:var(--color-cream-2)]'}`}>
                {n.icon && <n.icon className="w-3.5 h-3.5" />}
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          <button onClick={() => navigate('/destinations')} className="hidden md:flex items-center gap-2 text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">
            <Search className="w-4 h-4" /><span>Search</span>
          </button>

          {user ? (
            <>
              <div className="relative">
                <button onClick={() => setNotifOpen(v => !v)} className="relative w-9 h-9 rounded-full hover:bg-[color:var(--color-cream-2)] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                  {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[color:var(--color-terra)]" />}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 card shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-line)]">
                      <div className="font-display text-base font-semibold">Notifications</div>
                      {unread > 0 && <button onClick={() => markRead()} className="text-xs text-[color:var(--color-terra)]">Mark all read</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? <div className="p-6 text-sm text-center text-[color:var(--color-muted)]">No notifications yet.</div> :
                        notifications.map(n => (
                          <button key={n.id} onClick={() => { markRead(n.id); if (n.link) navigate(n.link); setNotifOpen(false); }}
                            className={`w-full text-left px-4 py-3 border-b border-[color:var(--color-line)] last:border-b-0 hover:bg-[color:var(--color-cream)] transition-colors ${n.read ? '' : 'bg-[color:var(--color-cream)]'}`}>
                            <div className="flex items-start gap-2">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-terra)] mt-2 shrink-0" />}
                              <div className="flex-1">
                                <div className="text-sm font-medium">{n.title}</div>
                                <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{n.body}</div>
                                <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted)] mt-1">{timeAgo(n.created_at)}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-[color:var(--color-cream-2)]">
                  <div className="w-7 h-7 rounded-full bg-[color:var(--color-sage)] text-white text-xs flex items-center justify-center font-semibold">
                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 card shadow-xl overflow-hidden text-sm" onMouseLeave={() => setMenuOpen(false)}>
                    <div className="px-4 py-3 border-b border-[color:var(--color-line)]">
                      <div className="font-medium">{profile?.full_name}</div>
                      <div className="text-[color:var(--color-muted)] text-xs">{profile?.email}</div>
                      <div className="mt-1.5 chip">{profile?.role}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--color-cream-2)]">
                      <LayoutDashboard className="w-4 h-4" /> My dashboard
                    </Link>
                    {['BUSINESS_OWNER', 'TOUR_GUIDE', 'TRAVEL_AGENT'].includes(profile?.role) && (
                      <Link to="/business" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--color-cream-2)]">Business console</Link>
                    )}
                    {['ADMIN', 'SUPER_ADMIN'].includes(profile?.role) && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--color-cream-2)]">Admin console</Link>
                    )}
                    <button onClick={async () => { await signOut(); navigate('/'); }} className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--color-cream-2)] border-t border-[color:var(--color-line)] text-[color:var(--color-terra)]">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-block text-sm font-medium">Log in</Link>
              <Link to="/signup" className="btn-primary text-sm">Get started</Link>
            </>
          )}

          <button className="lg:hidden ml-1 w-9 h-9 rounded-full hover:bg-[color:var(--color-cream-2)] flex items-center justify-center" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-[color:var(--color-line)] px-4 py-3 space-y-1 bg-[color:var(--color-cream)]">
            {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-[color:var(--color-ink)] text-[color:var(--color-cream)]' : ''}`}>{n.label}</NavLink>)}
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-24 border-t border-[color:var(--color-line)] bg-[color:var(--color-cream-2)]/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[color:var(--color-terra)] flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="font-display text-lg font-semibold">Tourism360</div>
            </div>
            <p className="text-sm text-[color:var(--color-muted)] max-w-xs">AI-powered tourism platform for SIH 2026 PS 26204. Real data, grounded recommendations, verified partners.</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2">Explore</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/hotels">Stays</Link></li>
              <li><Link to="/experiences">Experiences</Link></li>
              <li><Link to="/guides">Guides</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2">AI Studio</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/ai/recommend">Recommendations</Link></li>
              <li><Link to="/ai/plan">Trip Planner</Link></li>
              <li><Link to="/ai/chat">Chatbot</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2">For partners</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/business/register">List your business</Link></li>
              <li><Link to="/business">Business console</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[color:var(--color-line)] py-4 px-4 text-xs text-[color:var(--color-muted)] text-center">
          © {new Date().getFullYear()} Tourism360 · Built for SIH 2026 · All facts from verified DB, no AI hallucinations.
        </div>
      </footer>
    </div>
  );
}
