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

export async function fetchAllMedicineNames() {
  const data = await getJSON(buildUrl('/medicines/all'));
  return data.items || [];
}

export async function fetchCategories() {
  const data = await getJSON(buildUrl('/medicines/categories'));
  return data.items || [];
}

export async function fetchAlternatives({ category, exclude_id, lat, lng, radius }) {
  const url = buildUrl('/medicines/alternatives', {
    category,
    exclude_id,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    radius: radius ?? undefined
  });
  const data = await getJSON(url);
  return data.items || [];
}

export async function searchCart({ names, lat, lng, radius }) {
  const url = buildUrl('/medicines/search-cart', {
    names,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    radius: radius ?? undefined
  });
  const data = await getJSON(url);
  return data.items || [];
}
