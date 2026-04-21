import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoreDetail } from '../api/stores.js';
import PriceChart from '../components/chart/PriceChart.jsx';

export default function StoreDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreDetail(id)
      .then(setData)
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Loading store details...</div>;
  if (!data?.store) return <div className="container" style={{ padding: '40px 0' }}>Store not found.</div>;

  const { store, stats, medicines } = data;

  const topMedsPrices = medicines
    .slice(0, 10)
    .filter(m => m.quantity > 0)
    .map(m => ({ label: m.medicine_name, value: Number(m.price), color: '#6366f1' }));

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <button className="btn ghost" style={{ marginBottom: 20 }} onClick={() => nav(-1)}>
        &larr; Back
      </button>

      <div className="detail-header glass card" style={{ padding: 30, marginBottom: 30, borderTop: '4px solid #2563eb' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{store.store_name}</h1>
        <div className="row" style={{ gap: 24, fontSize: 14, color: '#475569' }}>
          <div>📍 {store.address}</div>
          <div>📞 {store.phone || 'N/A'}</div>
          <div style={{ fontWeight: 600, color: '#059669' }}>🕒 {store.opening_hours}</div>
        </div>

        <div className="row" style={{ gap: 16, marginTop: 24 }}>
          <div className="stat-pill">
            <div className="stat-val">{stats.total_medicines}</div>
            <div className="stat-lbl">Total Catalog</div>
          </div>
          <div className="stat-pill" style={{ background: '#dcfce7', color: '#166534' }}>
            <div className="stat-val">{stats.in_stock_count}</div>
            <div className="stat-lbl">In Stock</div>
          </div>
          <div className="stat-pill" style={{ background: '#fee2e2', color: '#991b1b' }}>
            <div className="stat-val">{stats.out_of_stock_count}</div>
            <div className="stat-lbl">Out of Stock</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="glass card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Inventory Log</h2>
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.5)', position: 'sticky', top: 0 }}>
                  <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Medicine</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Category</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                  <th style={{ padding: 12, borderBottom: '1px solid #e2e8f0' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.medicine_id} style={{ borderBottom: '1px solid #f1f5f9', opacity: m.quantity === 0 ? 0.5 : 1 }}>
                    <td style={{ padding: 12, fontWeight: 500 }}>{m.medicine_name}</td>
                    <td style={{ padding: 12, color: '#64748b' }}>{m.category}</td>
                    <td style={{ padding: 12 }}>
                      {m.quantity > 0 ? (
                        <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>{m.quantity}</span>
                      ) : (
                        <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>0</span>
                      )}
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>₹{Number(m.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass card" style={{ padding: 20, height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Items Pricing</h2>
          <PriceChart items={topMedsPrices} />
        </div>
      </div>

      <style>{`
        .stat-pill {
          padding: 12px 20px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          min-width: 120px;
        }
        .stat-val {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .stat-lbl {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
