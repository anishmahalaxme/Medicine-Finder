import React from 'react';
import Card from '../ui/Card.jsx';
import Stat from '../ui/Stat.jsx';
import { formatDateTime, formatKm } from '../../ui/format.js';

export default function MedicineStoreResultCard({ item }) {
  const key = item ? `${item.store_id}-${item.medicine_id}` : '';
  const qty = Number(item.quantity);
  const tone = Number.isFinite(qty) && qty > 0 ? 'ok' : 'low';

  return (
    <Card style={{ margin: 0 }} key={key}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.store_name}</div>
          <div style={{ fontSize: 13, color: '#475569' }}>{item.address}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {item.phone || item.store_phone ? `Phone: ${item.phone || item.store_phone}` : null}
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Distance</div>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{formatKm(item.distance_km) || '—'}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Stat label="Medicine" value={item.medicine_name} />
        <Stat label="Price" value={Number(item.price).toFixed(2)} />
        <Stat label="Quantity" value={String(item.quantity)} tone={tone} />
        <Stat label="Category" value={item.category} />
        <Stat label="Manufacturer" value={item.manufacturer} />
        <Stat label="Last updated" value={formatDateTime(item.last_updated)} />
      </div>
    </Card>
  );
}

