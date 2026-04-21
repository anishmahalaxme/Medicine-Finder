import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored drop-pin markers — always return a new object so Leaflet re-renders
function makeIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <filter id="sh" x="-30%" y="-10%" width="160%" height="150%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.28)"/>
      </filter>
      <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 26 12 26S28 23 28 14c0-6.627-5.373-12-12-12z"
        fill="${color}" stroke="#fff" stroke-width="2.2" filter="url(#sh)"/>
      <circle cx="16" cy="14" r="5.5" fill="rgba(255,255,255,0.90)"/>
    </svg>`;
  return new L.DivIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -46],
  });
}

function formatKm(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n < 1 ? `${Math.round(n * 1000)} m` : `${n.toFixed(1)} km`;
}

// Sub-component to auto-fit map bounds when stores change
function BoundsFitter({ stores }) {
  const map = useMap();
  useEffect(() => {
    if (!stores || stores.length === 0) return;
    const lats = stores.map((s) => Number(s.latitude));
    const lngs = stores.map((s) => Number(s.longitude));
    const bounds = [
      [Math.min(...lats) - 0.003, Math.min(...lngs) - 0.003],
      [Math.max(...lats) + 0.003, Math.max(...lngs) + 0.003],
    ];
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [stores, map]);
  return null;
}

/**
 * StoreMap
 *
 * Props:
 *   stores        – array of store objects from /stores/nearby
 *   searchResults – array from /medicines/search (may be empty if no search yet)
 *   hasSearched   – boolean: whether user has done a medicine search
 *   onStoreClick  – (store) => void
 *   highlightId   – store_id currently highlighted from sidebar hover
 */
export default function StoreMap({ stores = [], searchResults = [], hasSearched, onStoreClick, highlightId }) {
  // Build a Set of store_ids that have the searched medicine in stock
  const inStockSet = useMemo(() => {
    if (!hasSearched) return null;
    return new Set(
      searchResults
        .filter((r) => Number(r.quantity) > 0)
        .map((r) => Number(r.store_id))
    );
  }, [searchResults, hasSearched]);

  // Build a lookup of store_id → search result for popup info
  const resultByStore = useMemo(() => {
    const map = {};
    searchResults.forEach((r) => { map[r.store_id] = r; });
    return map;
  }, [searchResults]);

  function iconFor(store) {
    if (!hasSearched) return makeIcon('#6d5bd0');  // purple — no search
    return inStockSet.has(Number(store.store_id))
      ? makeIcon('#10b981')  // green — has stock
      : makeIcon('#ef4444'); // red   — out of stock
  }

  return (
    <MapContainer
      center={[18.4816, 73.8929]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stores.length > 0 && <BoundsFitter stores={stores} />}

      {stores.map((store) => {
        const lat = Number(store.latitude);
        const lng = Number(store.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        const result = resultByStore[store.store_id];
        const qty = result ? Number(result.quantity) : null;
        const hasStock = qty !== null && qty > 0;

        const stockState = !hasSearched ? 'n' : inStockSet?.has(Number(store.store_id)) ? 'y' : 'x';
        return (
          <Marker
            key={`${store.store_id}-${stockState}`}
            position={[lat, lng]}
            icon={iconFor(store)}
            eventHandlers={{ click: () => onStoreClick?.(store) }}
          >
            <Popup maxWidth={260}>
              <div style={{ fontFamily: 'inherit', minWidth: 200 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>
                  🏥 {store.store_name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  📍 {store.address}
                </div>
                {store.phone && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    📞 {store.phone}
                  </div>
                )}
                {typeof store.distance_km !== 'undefined' && store.distance_km !== null && (
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: '#475569' }}>
                    📏 {formatKm(store.distance_km)} away
                  </div>
                )}

                {hasSearched && result && (
                  <div style={{
                    marginTop: 10,
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: hasStock ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${hasStock ? '#a7f3d0' : '#fecaca'}`,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: hasStock ? '#065f46' : '#991b1b' }}>
                      {hasStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </div>
                    {hasStock && (
                      <>
                        <div style={{ fontSize: 12, color: '#334155', marginTop: 3 }}>
                          💊 {result.medicine_name}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                          ₹{Number(result.price).toFixed(2)} &nbsp;·&nbsp; {qty} units
                        </div>
                      </>
                    )}
                  </div>
                )}

                {hasSearched && !result && (
                  <div style={{
                    marginTop: 10,
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    fontSize: 12,
                    color: '#64748b',
                  }}>
                    ❌ Medicine not stocked here
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
