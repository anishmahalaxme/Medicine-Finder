import { buildUrl, getJSON } from './client.js';

export async function fetchNearbyStores({ lat, lng, radius }) {
  const url = buildUrl('/stores/nearby', {
    lat,
    lng,
    radius: radius ?? 5
  });

  const data = await getJSON(url);
  return data.items || [];
}

export async function fetchStoreMedicines(storeId) {
  const url = buildUrl(`/stores/${storeId}/medicines`);
  const data = await getJSON(url);
  return data.items || [];
}

