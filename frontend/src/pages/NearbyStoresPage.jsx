import React, { useEffect, useState } from 'react';
import { fetchNearbyStores } from '../api/stores.js';
import NearbyStoreResultCard from '../components/results/NearbyStoreResultCard.jsx';
import SkeletonCard from '../components/home/SkeletonCard.jsx';
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

export default function NearbyStoresPage() {
  const { geo } = useGeo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function runNearby(e) {
    e?.preventDefault?.();
    const parsed = { lat: Number(geo.lat), lng: Number(geo.lng), radius: Number(geo.radius) };
    if (!isFiniteGeo(parsed)) {
      setError('Enter valid lat/lng and radius.');
      return;
    }

    setLoading(true);
    setError('');
    setItems([]);
    setHasSearched(true);
    try {
      const results = await fetchNearbyStores({
        lat: parsed.lat,
        lng: parsed.lng,
        radius: parsed.radius
      });
      setItems(results);
    } catch (err) {
      setError(err?.message || 'Failed to load nearby stores.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Auto-run when the tab is opened and geo is valid.
    const parsed = { lat: Number(geo.lat), lng: Number(geo.lng), radius: Number(geo.radius) };
    if (isFiniteGeo(parsed)) {
      runNearby();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="glass card">
        <form onSubmit={runNearby} style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? (
              <span className="row" style={{ gap: 8 }}>
                <span className="spinner" aria-hidden="true" />
                Loading…
              </span>
            ) : (
              'Find nearby stores'
            )}
          </button>
        </form>
        {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
      </div>

      <div className="muted" style={{ fontSize: 13 }}>
        Nearby stores: <b>{items.length}</b>
      </div>

      {loading ? (
        <>
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={`nearby-sk-${idx}`} />
          ))}
        </>
      ) : (
        items.map((store) => <NearbyStoreResultCard key={store.store_id} store={store} />)
      )}

      {!loading && items.length === 0 && !error ? (
        <div className="muted" style={{ fontSize: 13 }}>
          {hasSearched ? 'No results found' : 'Start searching to see results'}
        </div>
      ) : null}
    </div>
  );
}

