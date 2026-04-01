import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeo } from '../../state/geo.jsx';
import { useBrowserLocation } from '../../hooks/useBrowserLocation.js';

export default function SearchBar() {
  const nav = useNavigate();
  const { geo, setFromCoords } = useGeo();
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { requestLocation, loading: locating, error: geoError, clearError } = useBrowserLocation();

  const hasGeo = useMemo(
    () => Number.isFinite(Number(geo.lat)) && Number.isFinite(Number(geo.lng)),
    [geo]
  );

  async function onUseLocation() {
    clearError();
    const loc = await requestLocation();
    if (!loc) return;
    setFromCoords(loc);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSubmitting(true);
    const params = new URLSearchParams();
    params.set('query', q);
    if (hasGeo) {
      params.set('lat', String(Number(geo.lat)));
      params.set('lng', String(Number(geo.lng)));
      params.set('radius', String(Number(geo.radius) || 5));
    }
    nav(`/find-medicine?${params.toString()}`);
    setSubmitting(false);
  }

  return (
    <form className="home-search-wrap" onSubmit={onSubmit}>
      <input
        className="input home-search-input"
        placeholder="Search medicine (e.g., Paracetamol)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="button" className="btn" onClick={onUseLocation} disabled={locating}>
        {locating ? 'Locating...' : 'Use My Location'}
      </button>
      <button type="submit" className="btn primary" disabled={submitting || !query.trim()}>
        Search
      </button>
      {geoError ? <div className="home-inline-error">{geoError}</div> : null}
    </form>
  );
}

