import React, { createContext, useContext, useMemo, useState } from 'react';

const GeoContext = createContext(null);

// Default: Kondhwa, Pune
const DEFAULT_GEO = {
  lat: '18.4816',
  lng: '73.8929',
  radius: '5'
};

function loadGeo() {
  try {
    const raw = localStorage.getItem('omf.geo');
    if (!raw) return DEFAULT_GEO;
    const parsed = JSON.parse(raw);
    return {
      lat: typeof parsed.lat === 'string' ? parsed.lat : DEFAULT_GEO.lat,
      lng: typeof parsed.lng === 'string' ? parsed.lng : DEFAULT_GEO.lng,
      radius: typeof parsed.radius === 'string' ? parsed.radius : DEFAULT_GEO.radius
    };
  } catch {
    return DEFAULT_GEO;
  }
}

export function GeoProvider({ children }) {
  const [geo, setGeo] = useState(() => (typeof window === 'undefined' ? DEFAULT_GEO : loadGeo()));

  const api = useMemo(() => {
    function persist(next) {
      localStorage.setItem('omf.geo', JSON.stringify(next));
      return next;
    }

    function setLat(v) {
      setGeo((g) => persist({ ...g, lat: String(v) }));
    }
    function setLng(v) {
      setGeo((g) => persist({ ...g, lng: String(v) }));
    }
    function setRadius(v) {
      setGeo((g) => persist({ ...g, radius: String(v) }));
    }
    function setFromCoords({ lat, lng }) {
      setGeo((g) => persist({ ...g, lat: String(lat), lng: String(lng) }));
    }

    return { geo, setLat, setLng, setRadius, setFromCoords };
  }, [geo]);

  return <GeoContext.Provider value={api}>{children}</GeoContext.Provider>;
}

export function useGeo() {
  const ctx = useContext(GeoContext);
  if (!ctx) throw new Error('useGeo must be used within GeoProvider');
  return ctx;
}

