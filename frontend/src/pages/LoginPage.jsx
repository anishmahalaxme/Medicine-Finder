import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';

import { verifyAdminToken } from '../api/admin.js';

export default function LoginPage() {
  const nav = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('demo@customer.com');
  const [role, setRole] = useState('customer');
  const [token, setToken] = useState('change-me');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!valid) {
      setError('Enter a valid email.');
      return;
    }

    if (role === 'admin') {
      if (!token) {
        setError('Admin token required.');
        return;
      }
      setLoading(true);
      try {
        const res = await verifyAdminToken(token);
        if (!res.ok) {
          setError('Invalid admin token.');
          setLoading(false);
          return;
        }
      } catch (err) {
        setError('Error verifying token.');
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    login({ email, role, token: role === 'admin' ? token : null });
    nav(role === 'admin' ? '/admin' : '/');
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr .9fr', gap: 14 }}>
      <div className="glass card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Login</div>
        <div className="muted" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>
          Frontend-only auth for now so the app feels real. When backend auth is ready, we’ll swap this with JWT/session.
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          <div>
            <div className="label">Email</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <div className="label">Role</div>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin (demo)</option>
            </select>
          </div>

          {role === 'admin' && (
            <div>
              <div className="label">Admin Token</div>
              <input 
                className="input" 
                type="password" 
                value={token} 
                onChange={(e) => setToken(e.target.value)} 
                placeholder="Enter secret admin token..." 
              />
            </div>
          )}

          {error ? <div className="error" style={{ color: 'red' }}>{error}</div> : null}

          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
            <button className="btn" type="button" onClick={() => nav('/')}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="glass card">
        <div style={{ fontWeight: 900, fontSize: 16 }}>Demo accounts</div>
        <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          - Customer: <b>demo@customer.com</b><br />
          - Admin: <b>demo@admin.com</b> (select Admin role)
        </div>

        <div style={{ marginTop: 14 }} className="glass card">
          <div className="subtle" style={{ fontSize: 12 }}>Current session</div>
          <div style={{ marginTop: 6, fontWeight: 850, fontSize: 13 }}>
            {user ? `Signed in as ${user.email} (${user.role})` : 'Not signed in'}
          </div>
        </div>
      </div>
    </div>
  );
}

