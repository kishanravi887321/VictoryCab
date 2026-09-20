import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import api from '../lib/api';

const AuthContext = createContext({ user: null, profile: null, loading: true, refresh: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u) => {
    if (!u) { setProfile(null); return; }
    try {
      const p = await api.get('/api/v1/profile');
      setProfile(p);
    } catch (e) {
      console.error('profile load failed', e);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        await loadProfile(session?.user);
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      await loadProfile(session?.user);
      setLoading(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [loadProfile]);

  const refresh = useCallback(async () => { await loadProfile(user); }, [user, loadProfile]);
  const signOut = useCallback(async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
