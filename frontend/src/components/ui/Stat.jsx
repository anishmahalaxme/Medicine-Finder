import React from 'react';

export default function Stat({ label, value, tone = 'neutral' }) {
  const palette =
    tone === 'ok'
      ? { color: '#065f46', bg: '#ecfdf5' }
      : tone === 'low'
        ? { color: '#9a3412', bg: '#fff7ed' }
        : { color: '#0f172a', bg: '#f1f5f9' };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, background: palette.bg }}>
      <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 4, fontWeight: 700, color: palette.color }}>{value ?? '—'}</div>
    </div>
  );
}

