import React from 'react';

export default function NavTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => onChange('search')}
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: `1px solid #e2e8f0`,
          background: active === 'search' ? '#0f172a' : 'white',
          color: active === 'search' ? 'white' : '#0f172a',
          cursor: 'pointer',
          fontWeight: 700
        }}
      >
        Search Medicine
      </button>
      <button
        onClick={() => onChange('nearby')}
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: `1px solid #e2e8f0`,
          background: active === 'nearby' ? '#0f172a' : 'white',
          color: active === 'nearby' ? 'white' : '#0f172a',
          cursor: 'pointer',
          fontWeight: 700
        }}
      >
        Nearby Stores
      </button>
    </div>
  );
}

