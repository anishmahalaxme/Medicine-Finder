import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5l8-7 8 7V20a1 1 0 01-1 1h-5v-7H10v7H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-4.2 7-11a7 7 0 10-14 0c0 6.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function LinkItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `navlink${isActive ? ' active' : ''}`}
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-inner container">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
              <rect x="6" y="6" width="20" height="20" rx="6" fill="white" opacity="0.9" />
              <path d="M16 10v12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 16h12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ lineHeight: 1.05 }}>Online Medical Store Finder</div>
            <div className="subtle" style={{ fontSize: 12, marginTop: 2 }}>Find medicines in nearby stores.</div>
          </div>
        </div>

        <div className="navlinks" role="navigation" aria-label="Primary">
          <LinkItem to="/" label="Home" icon={<IconHome />} />
          <LinkItem to="/categories" label="Categories" icon={<span style={{fontSize: 18}}>🗂️</span>} />
          <LinkItem to="/find-medicine" label="Find Medicine" icon={<IconSearch />} />
          <LinkItem to="/nearby" label="Nearby Stores" icon={<IconPin />} />
          {user && user.role === 'admin' && (
            <LinkItem to="/admin" label="Admin Dashboard" icon={<span style={{fontSize: 18}}>⚙️</span>} />
          )}
        </div>

        <div className="row" style={{ gap: 10 }}>
          {user ? (
            <>
              <div className="subtle" style={{ fontSize: 13 }}>
                {user.role === 'admin' ? 'Admin' : 'Customer'} • {user.email}
              </div>
              <button className="btn ghost" onClick={logout} style={{ padding: '8px 12px' }}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `btn ghost${isActive ? ' primary' : ''}`} style={{ padding: '8px 12px' }}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

