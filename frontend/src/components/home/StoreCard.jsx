import React from 'react';
import { useNavigate } from 'react-router-dom';

function fromNow(value) {
  if (!value) return 'Recently updated';
  const diffMs = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'Recently updated';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Updated just now';
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
}

export default function StoreCard({ store }) {
  const nav = useNavigate();
  const badgeClass =
    store.availability === 'In Stock'
      ? 'badge ok'
      : store.availability === 'Limited'
        ? 'badge warn'
        : 'badge out';

  return (
    <div className="home-card fade-in-card">
      <div className="row-between">
        <div className="home-card-title">{store.store_name}</div>
        <span className={badgeClass}>{store.availability}</span>
      </div>
      {store.insight_badge ? (
        <div className="home-badges" style={{ marginTop: 8 }}>
          <span className="badge info">{store.insight_badge}</span>
        </div>
      ) : null}
      <div className="home-meta">Distance: <b>{Number(store.distance_km).toFixed(2)} km</b></div>
      <div className="home-meta">Last updated: <b>{fromNow(store.last_updated).replace('Updated ', '')}</b></div>
      <button className="btn" style={{ marginTop: 12 }} onClick={() => nav('/nearby')}>
        View Details
      </button>
    </div>
  );
}

