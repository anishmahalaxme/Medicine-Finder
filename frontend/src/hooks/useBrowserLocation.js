import { useCallback, useState } from 'react';

export function useBrowserLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!('geolocation' in navigator)) {
        setError('Geolocation not available in this browser.');
        return null;
      }

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (p) => resolve(p),
          (e) => reject(e),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {
      setError('Location permission denied or unavailable.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { requestLocation, loading, error, clearError };
}

