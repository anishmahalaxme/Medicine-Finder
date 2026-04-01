import React from 'react';

export default function Footer() {
  return (
    <div className="container">
      <div className="glass footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12, flexWrap: 'wrap' }}>
          <div className="subtle" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} Online Medical Store Finder
          </div>
          <div className="subtle" style={{ fontSize: 12 }}>
            Privacy • Terms
          </div>
        </div>
      </div>
    </div>
  );
}

