import React from 'react';

export default function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#374151' }}>{label}</div>
      {children}
    </label>
  );
}

