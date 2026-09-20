import { createContext, useContext, useState, useCallback } from 'react';
import { demoProfile, demoUser } from '../lib/api';

const AuthContext = createContext({ user: demoUser, profile: demoProfile, loading: false, signIn: () => {}, refresh: async () => {}, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(demoUser);
  const [profile, setProfile] = useState(demoProfile);
  const signIn = useCallback((email, name = 'Demo Traveller') => {
    const nextUser = { id: 'demo-user', email };
    setUser(nextUser);
    setProfile({ ...nextUser, full_name: name, role: 'TRAVELLER' });
  }, []);
  const refresh = useCallback(async () => {}, []);
  const signOut = useCallback(() => { setUser(null); setProfile(null); }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading: false, signIn, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
