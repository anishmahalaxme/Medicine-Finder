import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useBrowserLocation } from '../hooks/useBrowserLocation.js';
import GeoControls from '../components/GeoControls.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useGeo } from '../state/geo.jsx';

export default function AppShell() {
  const { geo, setLat, setLng, setRadius, setFromCoords } = useGeo();
  const { requestLocation, loading: geoLoading, error: geoError, clearError } = useBrowserLocation();

  const location = useLocation();

  async function onUseMyLocation() {
    clearError();
    const loc = await requestLocation();
    if (!loc) return;
    setFromCoords(loc);
  }

  return (
    <div>
      <Navbar />
      {location.pathname === '/' || location.pathname === '/nearby' || location.pathname.startsWith('/stores/') ? (
        <div className="page">
          <Outlet />
        </div>
      ) : (
        <div className="container page">
          {/* Keep geo controls visible on search pages */}
          {location.pathname === '/find' || location.pathname === '/find-medicine' ? (
            <GeoControls
              lat={geo.lat}
              lng={geo.lng}
              radius={geo.radius}
              onChangeLat={setLat}
              onChangeLng={setLng}
              onChangeRadius={setRadius}
              onUseMyLocation={onUseMyLocation}
              loading={geoLoading}
              error={geoError}
            />
          ) : null}

          <div className="grid" style={{ marginTop: 12 }}>
            <Outlet />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

