import React from 'react';
import Card from '../ui/Card.jsx';
import { formatKm } from '../../ui/format.js';

export default function NearbyStoreResultCard({ store }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{store.store_name}</div>
          <div style={{ fontSize: 13, color: '#475569' }}>{store.address}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{store.phone ? `Phone: ${store.phone}` : null}</div>
        </div>
        <div style={{ textAlign: 'right', display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Distance</div>
          <div style={{ fontWeight: 800, color: '#0f172a' }}>{formatKm(store.distance_km) || '—'}</div>
        </div>
      </div>
    </Card>
  );
}

