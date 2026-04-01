import { useEffect, useMemo, useState } from 'react';
import { fetchNearbyStoresPreview, fetchPopularMedicinesPreview } from '../api/home.js';

export function useHomeData(geo) {
  const parsedGeo = useMemo(
    () => ({
      lat: Number(geo?.lat),
      lng: Number(geo?.lng),
      radius: Number(geo?.radius) || 5
    }),
    [geo]
  );

  const [popular, setPopular] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingPopular(true);
    fetchPopularMedicinesPreview(parsedGeo)
      .then((items) => {
        if (!cancelled) setPopular(items);
      })
      .finally(() => {
        if (!cancelled) setLoadingPopular(false);
      });
    return () => {
      cancelled = true;
    };
  }, [parsedGeo]);

  useEffect(() => {
    let cancelled = false;
    setLoadingStores(true);
    fetchNearbyStoresPreview(parsedGeo)
      .then((items) => {
        if (!cancelled) setStores(items);
      })
      .finally(() => {
        if (!cancelled) setLoadingStores(false);
      });
    return () => {
      cancelled = true;
    };
  }, [parsedGeo]);

  return { popular, stores, loadingPopular, loadingStores };
}

