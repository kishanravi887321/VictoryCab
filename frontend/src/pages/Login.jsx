import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/Loader';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ mode: initMode }) {
  const [mode, setMode] = useState(initMode || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      signIn(email, name || 'Demo Traveller');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (u) => { setEmail(u); setPassword('password123'); setMode('signin'); };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="p-8 lg:p-16 flex items-center">
        <div className="max-w-md w-full">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[color:var(--color-terra)] flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div className="font-display text-xl font-semibold">Tourism360</div>
          </Link>
          <h1 className="font-display text-4xl font-semibold">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-2">{mode === 'signup' ? 'Start planning grounded, AI-composed trips.' : 'Sign in to continue your journey.'}</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            {mode === 'signup' && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full border border-[color:var(--color-line)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[color:var(--color-ink)]" />}
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border border-[color:var(--color-line)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[color:var(--color-ink)]" />
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" minLength={6} className="w-full border border-[color:var(--color-line)] rounded-xl px-4 py-3 bg-white outline-none focus:border-[color:var(--color-ink)]" />
            {error && <div className="text-sm text-[color:var(--color-terra)] bg-[color:var(--color-terra)]/10 border border-[color:var(--color-terra)]/20 rounded-lg px-3 py-2">{error}</div>}
            <button disabled={busy} className="btn-primary w-full flex items-center justify-center gap-2">{busy && <Spinner />} {mode === 'signup' ? 'Create account' : 'Sign in'}</button>
          </form>
          <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-[color:var(--color-line)]" /><span className="text-xs text-[color:var(--color-muted)]">or</span><div className="flex-1 h-px bg-[color:var(--color-line)]" /></div>
          <button onClick={() => { signIn('google@tourism360.demo', 'Google Traveller'); navigate('/dashboard'); }} className="btn-ghost w-full flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div className="text-sm text-[color:var(--color-muted)] mt-6 text-center">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="text-[color:var(--color-terra)] font-medium">{mode === 'signup' ? 'Sign in' : 'Sign up'}</button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex bg-[color:var(--color-ink)] text-[color:var(--color-cream)] p-16 items-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[color:var(--color-terra)] opacity-20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-[color:var(--color-sage)] opacity-20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-4xl leading-tight max-w-md">"The AI planner gave me a Kerala itinerary I actually followed — and every hotel it suggested was really there."</h2>
          <p className="text-[color:var(--color-cream-2)] mt-4 text-sm">— Ananya K., beta tester</p>
          <div className="mt-12">
            <div className="text-xs uppercase tracking-widest text-[color:var(--color-cream-2)] mb-3">Demo accounts</div>
            <div className="grid grid-cols-2 gap-2">
              {[{ u: 'tourist@tourism360.app', label: 'Tourist' }, { u: 'business@tourism360.app', label: 'Business Owner' }, { u: 'guide@tourism360.app', label: 'Tour Guide' }, { u: 'admin@tourism360.app', label: 'Super Admin' }].map(d => (
                <button key={d.u} onClick={() => fillDemo(d.u)} className="text-left rounded-xl border border-white/20 bg-white/5 p-3 hover:bg-white/10 transition">
                  <div className="text-xs uppercase tracking-widest text-[color:var(--color-cream-2)]">{d.label}</div>
                  <div className="text-sm font-mono">{d.u}</div>
                  <div className="text-xs text-[color:var(--color-cream-2)] mt-1 font-mono">password123</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
