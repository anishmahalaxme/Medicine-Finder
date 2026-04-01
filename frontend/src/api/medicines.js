import { buildUrl, getJSON } from './client.js';

export async function searchMedicines({ name, lat, lng, radius }) {
  const url = buildUrl('/medicines/search', {
    name,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    radius: radius ?? undefined
  });

  const data = await getJSON(url);
  return data.items || [];
}

