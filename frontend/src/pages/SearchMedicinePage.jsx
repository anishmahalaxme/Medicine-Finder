import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedicines } from '../api/medicines.js';
import MedicineStoreResultCard from '../components/results/MedicineStoreResultCard.jsx';
import SkeletonCard from '../components/home/SkeletonCard.jsx';
import Field from '../components/ui/Field.jsx';
import { useGeo } from '../state/geo.jsx';

function isFiniteGeo(geo) {
  if (!geo) return false;
  return (
    Number.isFinite(geo.lat) &&
    Number.isFinite(geo.lng) &&
    Number.isFinite(geo.radius) &&
    geo.radius > 0
  );
}

export default function SearchMedicinePage() {
  const { geo, setFromCoords } = useGeo();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('Paracetamol');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const geoOk = useMemo(() => {
    const parsed = { lat: Number(geo.lat), lng: Number(geo.lng), radius: Number(geo.radius) };
    return isFiniteGeo(parsed);
  }, [geo]);

  useEffect(() => {
    const q = searchParams.get('query');
    const lat = Number(searchParams.get('lat'));
    const lng = Number(searchParams.get('lng'));
    if (q) setQuery(q);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setFromCoords({ lat, lng });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e, geoOverride) {
    e?.preventDefault?.();
    setLoading(true);
    setError('');
    setItems([]);
    setHasSearched(true);
    try {
      const name = String(query ?? '').trim();
      if (!name) throw new Error('Medicine name is required.');

      const effectiveGeo = geoOverride ?? (geoOk
        ? { lat: Number(geo.lat), lng: Number(geo.lng), radius: Number(geo.radius) }
        : null);

      const results = await searchMedicines({
        name,
        lat: effectiveGeo?.lat,
        lng: effectiveGeo?.lng,
        radius: effectiveGeo?.radius
      });
      setItems(results);
    } catch (err) {
      setError(err?.message || 'Failed to search medicines.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get('query');
    if (q) {
      const lat = Number(searchParams.get('lat'));
      const lng = Number(searchParams.get('lng'));
      const radius = Number(searchParams.get('radius'));
      const hasGeoParams = Number.isFinite(lat) && Number.isFinite(lng);
      onSubmit(undefined, hasGeoParams ? { lat, lng, radius: Number.isFinite(radius) ? radius : 5 } : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="glass card">
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
          <Field label="Medicine name">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Paracetamol"
              className="input"
            />
          </Field>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? (
              <span className="row" style={{ gap: 8 }}>
                <span className="spinner" aria-hidden="true" />
                Searching…
              </span>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
      </div>

      <div className="muted" style={{ fontSize: 13 }}>
        Results: <b>{items.length}</b>
        {geoOk ? ' (sorted by nearest)' : ''}
      </div>

      {loading ? (
        <>
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={`search-sk-${idx}`} />
          ))}
        </>
      ) : (
        items.map((it) => (
          <MedicineStoreResultCard key={`${it.store_id}-${it.medicine_id}`} item={it} />
        ))
      )}

      {!loading && items.length === 0 && !error ? (
        <div className="muted" style={{ fontSize: 13 }}>
          {hasSearched ? 'No results found' : 'Start searching to see results'}
        </div>
      ) : null}
    </div>
  );
}

