import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function loadAuth() {
  try {
    const raw = localStorage.getItem('omf.auth');
    if (!raw) return { user: null };
    const parsed = JSON.parse(raw);
    if (!parsed?.user) return { user: null };
    return { user: parsed.user };
  } catch {
    return { user: null };
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => (typeof window === 'undefined' ? { user: null } : loadAuth()));

  const api = useMemo(() => {
    function persist(next) {
      localStorage.setItem('omf.auth', JSON.stringify(next));
      return next;
    }

    function login({ email, role, token }) {
      const user = {
        name: email?.split('@')?.[0] || 'User',
        email,
        role: role || 'customer',
        token
      };
      setState(persist({ user }));
      return user;
    }

    function logout() {
      setState(persist({ user: null }));
    }

    return { user: state.user, login, logout };
  }, [state.user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

