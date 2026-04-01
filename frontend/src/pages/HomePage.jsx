import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/home/SearchBar.jsx';
import MedicineCard from '../components/home/MedicineCard.jsx';
import StoreCard from '../components/home/StoreCard.jsx';
import SkeletonCard from '../components/home/SkeletonCard.jsx';
import { useHomeData } from '../hooks/useHomeData.js';
import { useGeo } from '../state/geo.jsx';

function Icon({ children }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 14,
        display: 'grid',
        placeItems: 'center',
        background: '#f8fafc',
        border: '1px solid rgba(15,23,42,.10)'
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const nav = useNavigate();
  const { geo } = useGeo();
  const { popular, stores, loadingPopular, loadingStores } = useHomeData(geo);

  return (
    <div className="grid">
      <div className="hero">
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="hero-banner" style={{ marginTop: 0 }}>
            <div className="hero-inner">
              <h1>Online Medical Store Finder</h1>
              <p>
                Find nearby stores that have your medicine in stock. View price, availability, and last updated time.
              </p>
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: 22 }}>
          <div className="section-head">
            <div className="section-title">Popular Medicines Near You</div>
          </div>
          <div className="home-grid-3">
            {(loadingPopular ? Array.from({ length: 6 }) : popular).map((item, idx) =>
              loadingPopular ? (
                <SkeletonCard key={`popular-sk-${idx}`} />
              ) : (
                <MedicineCard key={`${item.name}-${idx}`} item={item} index={idx} />
              )
            )}
          </div>
        </div>

        <div className="container" style={{ marginTop: 8 }}>
          <div className="section-head">
            <div className="section-title">Nearby Medical Stores</div>
          </div>
          <div className="home-grid-3">
            {(loadingStores ? Array.from({ length: 4 }) : stores).map((store, idx) =>
              loadingStores ? (
                <SkeletonCard key={`store-sk-${idx}`} />
              ) : (
                <StoreCard key={`${store.store_id}-${idx}`} store={store} />
              )
            )}
          </div>
        </div>

        <div className="container" style={{ marginTop: 8 }}>
          <div className="section-title">How It Works</div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-icon">1</div>
              <div className="step-title">Search Medicine</div>
              <div className="step-text">Enter medicine name and start search.</div>
            </div>
            <div className="step-card">
              <div className="step-icon">2</div>
              <div className="step-title">Enable Location</div>
              <div className="step-text">Use your current location for nearby results.</div>
            </div>
            <div className="step-card">
              <div className="step-icon">3</div>
              <div className="step-title">Compare Stores & Prices</div>
              <div className="step-text">Check availability, distance, and price range.</div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: 8 }}>
          <div className="section-title">Why Use This Platform?</div>
          <div className="feature-grid">
            <div className="feature">
              <div className="row" style={{ gap: 10 }}>
                <Icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </Icon>
                <div className="t">Real-time stock availability</div>
              </div>
              <div className="d">Know whether a medicine is available before visiting the store.</div>
            </div>
            <div className="feature">
              <div className="row" style={{ gap: 10 }}>
                <Icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Icon>
                <div className="t">Compare prices across stores</div>
              </div>
              <div className="d">Make informed decisions by comparing price ranges nearby.</div>
            </div>
            <div className="feature">
              <div className="row" style={{ gap: 10 }}>
                <Icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1l3 6 6 .8-4.5 4.3 1.2 6-5.7-3-5.7 3 1.2-6L3 7.8 9 7l3-6z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </Icon>
                <div className="t">Find medicines quickly in emergencies</div>
              </div>
              <div className="d">Fast search with location-aware results helps in urgent needs.</div>
            </div>
            <div className="feature">
              <div className="row" style={{ gap: 10 }}>
                <Icon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l4 4 12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Icon>
                <div className="t">Location-based accurate results</div>
              </div>
              <div className="d">Stores are sorted by nearest distance for practical decisions.</div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: 10 }}>
          <div className="cta-box">
            <div>
              <div className="cta-title">Find your medicine instantly</div>
              <div className="muted" style={{ marginTop: 6 }}>Start with a medicine search and compare stores near you.</div>
            </div>
            <button className="btn primary" onClick={() => nav('/find-medicine')}>
              Search Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

