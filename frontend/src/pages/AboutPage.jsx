import React from 'react';

export default function AboutPage() {
  return (
    <div className="grid">
      <div className="glass card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>About</div>
        <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          Online Medical Store Finder helps users quickly locate nearby medical stores that have specific medicines in stock,
          along with price and availability. This frontend is structured like a production app (routing, state, components),
          ready for a real backend and mobile expansion.
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature">
          <div className="t">Search</div>
          <div className="d">Find matching medicines across stores and compare availability.</div>
        </div>
        <div className="feature">
          <div className="t">Geo proximity</div>
          <div className="d">Discover stores within a radius, sorted by nearest distance.</div>
        </div>
        <div className="feature">
          <div className="t">Roadmap</div>
          <div className="d">Login, saved searches, admin stock updates, alerts, and realtime availability.</div>
        </div>
      </div>
    </div>
  );
}

