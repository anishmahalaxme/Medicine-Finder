import React from 'react';
import { useNavigate } from 'react-router-dom';

function fromNow(value) {
  if (!value) return 'Last updated recently';
  const diffMs = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'Last updated recently';
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  return `Last updated ${mins} minutes ago`;
}

export default function MedicineCard({ item, index = 0 }) {
  const nav = useNavigate();

  function goToFind() {
    nav(`/find-medicine?query=${encodeURIComponent(item.name)}`);
  }

  return (
    <div className="home-card fade-in-card" style={{ animationDelay: `${index * 60}ms` }}>
      {item.insight_badge ? (
        <div className="home-badges">
          <span className="badge info">{item.insight_badge}</span>
        </div>
      ) : null}
      <div className="home-card-title">{item.name}</div>
      <div className="home-meta">Stores available: <b>{item.stores}</b></div>
      <div className="home-meta">Price range: <b>Rs {item.minPrice} - Rs {item.maxPrice}</b></div>
      <div className="home-meta">{fromNow(item.last_updated)}</div>
      <button className="btn primary" style={{ marginTop: 12 }} onClick={goToFind}>
        View Stores
      </button>
    </div>
  );
}

