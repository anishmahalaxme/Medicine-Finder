import React, { useCallback, useEffect, useRef, useState } from 'react';
import StoreMap from '../components/map/StoreMap.jsx';
import { fetchNearbyStores } from '../api/stores.js';
import { searchMedicines, fetchAllMedicineNames } from '../api/medicines.js';

// Kondhwa, Pune — fixed centre for this project
const KONDHWA = { lat: 18.4816, lng: 73.8929, radius: 6 };

// Real-time polling interval (ms)
const POLL_MS = 30_000;

function formatKm(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  return n < 1 ? `${Math.round(n * 1000)} m` : `${n.toFixed(1)} km`;
}

function LastUpdated({ ts }) {
  if (!ts) return null;
  const d = new Date(ts);
  return (
    <span style={{ fontSize: 11, color: '#94a3b8' }}>
      Updated {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

// Store sidebar card
function StoreCard({ store, searchResult, hasSearched, isHighlighted, onClick }) {
  const qty = searchResult ? Number(searchResult.quantity) : null;
  const hasStock = qty !== null && qty > 0;

  let tone = 'neutral';
  if (hasSearched && searchResult) tone = hasStock ? 'has-stock' : 'no-stock';

  return (
    <div
      className={`store-map-card ${tone}${isHighlighted ? ' highlighted' : ''}`}
      onClick={() => onClick(store)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(store)}
    >
      <div className="store-card-name">🏥 {store.store_name}</div>
      <div className="store-card-addr">{store.address}</div>
      {store.phone && (
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>📞 {store.phone}</div>
      )}

      <div className="store-card-row">
        <span className="store-card-dist">📏 {formatKm(store.distance_km)}</span>

        {hasSearched ? (
          searchResult ? (
            hasStock ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="avail-pill ok">✅ In Stock</span>
                <span className="avail-price">₹{Number(searchResult.price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="avail-pill out">❌ Out of Stock</span>
            )
          ) : (
            <span className="avail-pill unknown">Not stocked</span>
          )
        ) : null}
      </div>

      {hasSearched && searchResult && hasStock && (
        <div style={{
          marginTop: 6,
          fontSize: 12,
          color: '#475569',
          display: 'flex',
          gap: 12,
        }}>
          <span>💊 {searchResult.medicine_name}</span>
          <span style={{ color: '#94a3b8' }}>{qty} units</span>
          <LastUpdated ts={searchResult.last_updated} />
        </div>
      )}

      {isHighlighted && (
        <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
          <a href={`/stores/${store.store_id}`} className="btn ghost" style={{ width: '100%', fontSize: 13, padding: 6, border: '1px solid #e2e8f0' }} onClick={e => e.stopPropagation()}>
            View Full Store Catalog &rarr;
          </a>
        </div>
      )}
    </div>
  );
}

// Autocomplete search input
function MedicineSearchBar({ allMeds, query, setQuery, onSearch, loading }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = query.trim().length > 0
    ? allMeds.filter((m) =>
        m.medicine_name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function pick(name) {
    setQuery(name);
    setOpen(false);
    onSearch(name);
  }

  return (
    <div className="search-autocomplete-wrap" ref={wrapRef}>
      <input
        id="medicine-search-input"
        className="input"
        placeholder="Search medicine (e.g. Paracetamol, Dolo 650)…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { setOpen(false); onSearch(query); }
          if (e.key === 'Escape') setOpen(false);
        }}
        autoComplete="off"
        style={{ height: 42 }}
      />
      {open && filtered.length > 0 && (
        <div className="search-autocomplete-list">
          {filtered.map((m) => (
            <div
              key={m.medicine_id}
              className="search-autocomplete-item"
              onMouseDown={() => pick(m.medicine_name)}
            >
              <span>{m.medicine_name}</span>
              <span className="cat">{m.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NearbyStoresPage() {
  const [stores, setStores] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [allMeds, setAllMeds] = useState([]);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [storeError, setStoreError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const pollRef = useRef(null);

  // Build a map of store_id → search result for O(1) lookup
  const resultByStore = {};
  searchResults.forEach((r) => { resultByStore[r.store_id] = r; });

  // ── Load stores ───────────────────────────────────────────────
  const loadStores = useCallback(async () => {
    try {
      const data = await fetchNearbyStores(KONDHWA);
      setStores(data);
      setStoreError('');
      setLastRefresh(new Date());
    } catch (e) {
      setStoreError(e?.message || 'Failed to load stores.');
    } finally {
      setLoadingStores(false);
    }
  }, []);

  // ── Load autocomplete medicines list ─────────────────────────
  useEffect(() => {
    fetchAllMedicineNames().then(setAllMeds).catch(() => {});
  }, []);

  // ── Initial load + real-time polling ─────────────────────────
  useEffect(() => {
    loadStores();
    pollRef.current = setInterval(loadStores, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [loadStores]);

  // ── Re-run medicine search on each poll if search is active ──
  const lastQueryRef = useRef('');
  const runSearch = useCallback(async (name) => {
    const trimmed = (name ?? '').trim();
    if (!trimmed) return;
    lastQueryRef.current = trimmed;
    setLoadingSearch(true);
    setSearchError('');
    setHasSearched(true);
    try {
      const results = await searchMedicines({ name: trimmed, ...KONDHWA });
      setSearchResults(results);
    } catch (e) {
      setSearchError(e?.message || 'Search failed.');
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // Re-poll also re-runs the search so availability is live
  useEffect(() => {
    const id = setInterval(() => {
      if (lastQueryRef.current) runSearch(lastQueryRef.current);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [runSearch]);

  // ── Clear search ──────────────────────────────────────────────
  function clearSearch() {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchError('');
    lastQueryRef.current = '';
  }

  // ── Sorted store list: in-stock first when searching ──────────
  const sortedStores = hasSearched
    ? [...stores].sort((a, b) => {
        const aHas = resultByStore[a.store_id] && Number(resultByStore[a.store_id].quantity) > 0;
        const bHas = resultByStore[b.store_id] && Number(resultByStore[b.store_id].quantity) > 0;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return (Number(a.distance_km) || 99) - (Number(b.distance_km) || 99);
      })
    : stores;

  const inStockCount = hasSearched
    ? searchResults.filter((r) => Number(r.quantity) > 0).length
    : null;

  return (
    <div className="map-page">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="map-page-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
            📍 Kondhwa, Pune
          </span>
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        </div>

        <MedicineSearchBar
          allMeds={allMeds}
          query={query}
          setQuery={setQuery}
          onSearch={runSearch}
          loading={loadingSearch}
        />

        <button
          id="search-btn"
          className="btn primary"
          style={{ height: 42, whiteSpace: 'nowrap', flexShrink: 0 }}
          disabled={loadingSearch || !query.trim()}
          onClick={() => runSearch(query)}
        >
          {loadingSearch ? (
            <span className="row" style={{ gap: 6 }}>
              <span className="spinner" /> Searching…
            </span>
          ) : '🔍 Search'}
        </button>

        {hasSearched && (
          <button
            id="clear-search-btn"
            className="btn"
            style={{ height: 42, flexShrink: 0 }}
            onClick={clearSearch}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Status strip ─────────────────────────────────────── */}
      {(storeError || searchError || (hasSearched && inStockCount !== null)) && (
        <div style={{
          padding: '6px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: 12,
          fontSize: 12,
          alignItems: 'center',
          background: '#f8fafc',
          flexShrink: 0,
        }}>
          {storeError && <span style={{ color: '#991b1b' }}>⚠ {storeError}</span>}
          {searchError && <span style={{ color: '#991b1b' }}>⚠ {searchError}</span>}
          {hasSearched && inStockCount !== null && !searchError && (
            <span style={{ color: '#065f46', fontWeight: 600 }}>
              ✅ {inStockCount} store{inStockCount !== 1 ? 's' : ''} have this medicine in stock
              {lastRefresh && (
                <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>
                  · Refreshed at {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {/* ── Main body: map + sidebar ─────────────────────────── */}
      <div className="map-page-body">
        {/* Map pane */}
        <div className="map-pane">
          {loadingStores ? (
            <div style={{
              height: '100%', display: 'grid', placeItems: 'center',
              color: '#94a3b8', fontSize: 14,
            }}>
              <span className="row" style={{ gap: 8 }}>
                <span className="spinner" /> Loading map…
              </span>
            </div>
          ) : (
            <StoreMap
              stores={stores}
              searchResults={searchResults}
              hasSearched={hasSearched}
              onStoreClick={(s) => setHighlightId(s.store_id)}
              highlightId={highlightId}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="map-sidebar">
          <div className="map-sidebar-header">
            <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
              {hasSearched ? `Stores for "${lastQueryRef.current}"` : 'Nearby Medical Stores'}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              {sortedStores.length} found
            </span>
          </div>

          {/* Legend */}
          {hasSearched && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#64748b' }}>
              <span>🟢 Has stock</span>
              <span>🔴 Out of stock</span>
              <span>⚪ Not stocked</span>
            </div>
          )}

          {loadingStores ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="store-map-card neutral" style={{ opacity: 0.5 }}>
                <div className="skeleton sk-title" />
                <div className="skeleton sk-line" />
                <div className="skeleton sk-line short" />
              </div>
            ))
          ) : sortedStores.length === 0 ? (
            <div style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
              No stores found in Kondhwa area.
            </div>
          ) : (
            sortedStores.map((store) => (
              <StoreCard
                key={store.store_id}
                store={store}
                searchResult={resultByStore[store.store_id]}
                hasSearched={hasSearched}
                isHighlighted={highlightId === store.store_id}
                onClick={(s) => setHighlightId(s.store_id === highlightId ? null : s.store_id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
