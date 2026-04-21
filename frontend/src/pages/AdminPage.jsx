import React, { useEffect, useState } from 'react';
import { getAdminStats, listMedicines, listStores, listStock, deleteMedicine, deleteStore } from '../api/admin.js';

export default function AdminPage() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    loadData();
  }, [tab]);

  function loadData() {
    if (tab === 'stats') getAdminStats().then(setStats).catch(console.error);
    if (tab === 'medicines') listMedicines().then(setMedicines).catch(console.error);
    if (tab === 'stores') listStores().then(setStores).catch(console.error);
    if (tab === 'stock') listStock().then(setStock).catch(console.error);
  }

  async function handleDeleteMedicine(id) {
    if (!confirm('Are you sure you want to delete this medicine? This will cascade to stock.')) return;
    await deleteMedicine(id);
    loadData();
  }

  async function handleDeleteStore(id) {
    if (!confirm('Are you sure you want to delete this store?')) return;
    await deleteStore(id);
    loadData();
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24, alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Dashboard</h1>
          <p className="muted">Manage catalog, stores, and operations securely.</p>
        </div>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
        {['stats', 'medicines', 'stores', 'stock'].map(t => (
          <button 
            key={t}
            className={`btn ${tab === t ? 'primary' : 'ghost'}`} 
            style={{ textTransform: 'capitalize', padding: '8px 16px' }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div className="glass card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, fontWeight: 600 }}>Total Stores</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6' }}>{stats.totals.stores}</div>
            </div>
            <div className="glass card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, fontWeight: 600 }}>Total Medicines</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#8b5cf6' }}>{stats.totals.medicines}</div>
            </div>
            <div className="glass card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, fontWeight: 600 }}>Low Stock Warnings</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444' }}>{stats.totals.low_stock}</div>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
             <div className="glass card" style={{ padding: 20 }}>
               <h3 style={{ marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Low Stock Alerts</h3>
               {stats.low_stock_items.map((i, idx) => (
                 <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                   <div>
                     <div style={{ fontWeight: 600 }}>{i.medicine_name}</div>
                     <div style={{ fontSize: 12, color: '#64748b' }}>{i.store_name}</div>
                   </div>
                   <div style={{ color: '#ef4444', fontWeight: 'bold' }}>Qty: {i.quantity}</div>
                 </div>
               ))}
               {stats.low_stock_items.length === 0 && <div className="muted">No low stock items.</div>}
             </div>
             
             <div className="glass card" style={{ padding: 20 }}>
               <h3 style={{ marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Recent Updates</h3>
               {stats.recent_updates.map((i, idx) => (
                 <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                   <div style={{ fontWeight: 600 }}>{i.medicine_name} <span style={{ color: '#16a34a' }}>₹{Number(i.price).toFixed(2)}</span></div>
                   <div style={{ fontSize: 12, color: '#64748b' }}>Updated at {i.store_name}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {tab === 'medicines' && (
        <div className="glass card" style={{ padding: 20 }}>
          <h2 style={{ marginBottom: 16 }}>Medicines Catalog ({medicines.length})</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: 12 }}>ID</th>
                <th style={{ padding: 12 }}>Name</th>
                <th style={{ padding: 12 }}>Category</th>
                <th style={{ padding: 12 }}>Manufacturer</th>
                <th style={{ padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(m => (
                <tr key={m.medicine_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12 }}>{m.medicine_id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{m.medicine_name}</td>
                  <td style={{ padding: 12 }}>{m.category}</td>
                  <td style={{ padding: 12, color: '#64748b' }}>{m.manufacturer}</td>
                  <td style={{ padding: 12 }}>
                    <button className="badge error" style={{ cursor: 'pointer' }} onClick={() => handleDeleteMedicine(m.medicine_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stores' && (
        <div className="glass card" style={{ padding: 20 }}>
          <h2 style={{ marginBottom: 16 }}>Stores ({stores.length})</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: 12 }}>ID</th>
                <th style={{ padding: 12 }}>Store Name</th>
                <th style={{ padding: 12 }}>Phone</th>
                <th style={{ padding: 12 }}>Contact Info</th>
                <th style={{ padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.store_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12 }}>{s.store_id}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.store_name}</td>
                  <td style={{ padding: 12 }}>{s.phone}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{s.address}</div>
                    <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>{s.opening_hours}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button className="badge error" style={{ cursor: 'pointer' }} onClick={() => handleDeleteStore(s.store_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stock' && (
        <div className="glass card" style={{ padding: 20 }}>
          <h2 style={{ marginBottom: 16 }}>Live Stock Level</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: 12 }}>Store</th>
                <th style={{ padding: 12 }}>Medicine</th>
                <th style={{ padding: 12 }}>Quantity</th>
                <th style={{ padding: 12 }}>Price</th>
                <th style={{ padding: 12 }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stock.slice(0, 100).map(s => (
                <tr key={s.stock_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.store_name}</td>
                  <td style={{ padding: 12 }}>{s.medicine_name}</td>
                  <td style={{ padding: 12 }}>
                    {s.quantity < 10 ? <span className="badge error">{s.quantity}</span> : <span className="badge primary" style={{ background: '#dcfce7', color: '#166534' }}>{s.quantity}</span>}
                  </td>
                  <td style={{ padding: 12, fontWeight: 600 }}>₹{Number(s.price).toFixed(2)}</td>
                  <td style={{ padding: 12, color: '#64748b', fontSize: 12 }}>{new Date(s.last_updated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="muted" style={{ padding: 12, fontSize: 12 }}>Showing top 100 recent stock entries</div>
        </div>
      )}
    </div>
  );
}
