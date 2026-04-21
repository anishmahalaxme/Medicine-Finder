import { API_BASE } from './client.js';

function getAdminHeaders() {
  let token = 'change-me';
  try {
    const raw = localStorage.getItem('omf.auth');
    if (raw) {
      const auth = JSON.parse(raw);
      if (auth?.user?.token) token = auth.user.token;
    }
  } catch (e) {}
  
  return {
    'Content-Type': 'application/json',
    'x-admin-token': token
  };
}

async function adminFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getAdminHeaders(),
      ...options.headers
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Admin API Error');
  return data;
}

export async function verifyAdminToken(token) {
  const url = `${API_BASE}/admin/verify-token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return await res.json();
}

export async function getAdminStats() {
  return await adminFetch('/admin/stats');
}

export async function listMedicines() {
  const res = await adminFetch('/admin/medicines');
  return res.items || [];
}

export async function upsertMedicine(med) {
  if (med.medicine_id) {
    return await adminFetch(`/admin/medicines/${med.medicine_id}`, {
      method: 'PATCH',
      body: JSON.stringify(med)
    });
  } else {
    return await adminFetch('/admin/medicines', {
      method: 'POST',
      body: JSON.stringify(med)
    });
  }
}

export async function deleteMedicine(id) {
  return await adminFetch(`/admin/medicines/${id}`, { method: 'DELETE' });
}

export async function listStores() {
  const res = await adminFetch('/admin/stores');
  return res.items || [];
}

export async function upsertStore(store) {
  if (store.store_id) {
    return await adminFetch(`/admin/stores/${store.store_id}`, {
      method: 'PATCH',
      body: JSON.stringify(store)
    });
  } else {
    return await adminFetch('/admin/stores', {
      method: 'POST',
      body: JSON.stringify(store)
    });
  }
}

export async function deleteStore(id) {
  return await adminFetch(`/admin/stores/${id}`, { method: 'DELETE' });
}

export async function listStock() {
  const res = await adminFetch('/admin/stock');
  return res.items || [];
}

export async function upsertStock(stockItem) {
  return await adminFetch('/admin/stock', {
    method: 'POST',
    body: JSON.stringify(stockItem)
  });
}

export async function deleteStock(storeId, medicineId) {
  return await adminFetch(`/admin/stock/${storeId}/${medicineId}`, { method: 'DELETE' });
}
