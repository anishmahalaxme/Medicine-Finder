import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedicines, searchCart } from '../api/medicines.js';
import MedicineStoreResultCard from '../components/results/MedicineStoreResultCard.jsx';
import SkeletonCard from '../components/home/SkeletonCard.jsx';
import Field from '../components/ui/Field.jsx';
import { useGeo } from '../state/geo.jsx';
import SearchHistoryChips, { addSearchToHistory } from '../components/search/SearchHistoryChips.jsx';
import AlternativeSuggester from '../components/search/AlternativeSuggester.jsx';
import CartSearch from '../components/search/CartSearch.jsx';

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
  const [tab, setTab] = useState('single'); // single or cart
  const [query, setQuery] = useState('Paracetamol');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
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

  async function onSubmitSingle(e, geoOverride, forceQuery = null) {
    e?.preventDefault?.();
    setTab('single');
    setLoading(true);
    setError('');
    setItems([]);
    setCartItems([]);
    setHasSearched(true);
    try {
      const name = String(forceQuery || query || '').trim();
      if (!name) throw new Error('Medicine name is required.');
      
      setQuery(name);
      addSearchToHistory(name);

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

  async function handleCartSearch(names) {
    setTab('cart');
    setLoading(true);
    setError('');
    setItems([]);
    setCartItems([]);
    setHasSearched(true);
    
    // Add all to history
    names.forEach(addSearchToHistory);

    try {
      const effectiveGeo = geoOk
        ? { lat: Number(geo.lat), lng: Number(geo.lng), radius: Number(geo.radius) }
        : null;

      const results = await searchCart({
        names: names.join(','),
        lat: effectiveGeo?.lat,
        lng: effectiveGeo?.lng,
        radius: effectiveGeo?.radius
      });
      setCartItems(results);
    } catch (err) {
      setError(err?.message || 'Failed to search cart.');
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
      onSubmitSingle(undefined, hasGeoParams ? { lat, lng, radius: Number.isFinite(radius) ? radius : 5 } : undefined, q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catParam = searchParams.get('category');
  useEffect(() => {
    if (catParam) {
      // If user came from category browser
      setQuery(catParam);
      onSubmitSingle(undefined, undefined, catParam);
    }
  }, [catParam]);

  const hasInStock = items.some(i => i.quantity > 0);
  const showAlternates = hasSearched && items.length > 0 && !hasInStock && tab === 'single';

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      
      <div className="admin-tabs" style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <button className={`btn ${tab === 'single' ? 'primary' : 'ghost'}`} onClick={() => setTab('single')}>
          Single Search
        </button>
        <button className={`btn ${tab === 'cart' ? 'primary' : 'ghost'}`} onClick={() => setTab('cart')}>
          Multi-Item Cart
        </button>
      </div>

      {tab === 'single' ? (
        <div className="glass card">
          <form onSubmit={e => onSubmitSingle(e)} style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap' }}>
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
          
          <SearchHistoryChips onSelectQuery={(q) => onSubmitSingle(undefined, undefined, q)} />

          {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
        </div>
      ) : (
        <CartSearch onSearchCart={handleCartSearch} />
      )}

      {showAlternates && (
        <AlternativeSuggester 
          category={items[0].category} 
          excludeId={items[0].medicine_id}
          onSelectAlternative={(alt) => onSubmitSingle(undefined, undefined, alt)}
        />
      )}

      <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
        Results: <b>{tab === 'single' ? items.length : cartItems.length}</b>
        {geoOk ? ' (sorted by nearest)' : ''}
      </div>

      {loading ? (
        <>
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={`search-sk-${idx}`} />
          ))}
        </>
      ) : tab === 'single' ? (
        items.map((it) => (
          <MedicineStoreResultCard key={`${it.store_id}-${it.medicine_id}`} item={it} />
        ))
      ) : (
        cartItems.map((store) => (
          <div key={store.store_id} className="glass card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}><a href={`/stores/${store.store_id}`} style={{color: 'inherit', textDecoration: 'none'}}>🏥 {store.store_name}</a></div>
                  <div className="muted" style={{ fontSize: 13 }}>{store.address} • {store.phone}</div>
               </div>
               {geoOk && <div className="badge ghost">📏 {Number(store.distance_km).toFixed(1)} km</div>}
            </div>
            
            <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
               <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                  Matched {store.match_count} items in stock:
               </div>
               <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {store.matched_medicines.map(m => (
                     <div key={m.medicine_id} style={{ padding: 8, background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.medicine_name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 13 }}>
                           <span style={{ color: '#059669' }}>{m.quantity} units</span>
                           <span style={{ fontWeight: 'bold' }}>₹{Number(m.price).toFixed(2)}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        ))
      )}

      {!loading && items.length === 0 && cartItems.length === 0 && !error ? (
        <div className="muted" style={{ fontSize: 13 }}>
          {hasSearched ? 'No results found' : 'Start searching to see results'}
        </div>
      ) : null}
    </div>
  );
}

