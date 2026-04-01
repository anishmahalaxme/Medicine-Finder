import React from 'react';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Field from './ui/Field.jsx';
import { styles } from '../ui/theme.js';

export default function GeoControls({
  lat,
  lng,
  radius,
  onChangeLat,
  onChangeLng,
  onChangeRadius,
  onUseMyLocation,
  loading,
  error
}) {
  return (
    <Card>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <Field label="Latitude">
            <input
              value={lat}
              onChange={(e) => onChangeLat(e.target.value)}
              style={styles.input}
              inputMode="decimal"
            />
          </Field>
          <Field label="Longitude">
            <input
              value={lng}
              onChange={(e) => onChangeLng(e.target.value)}
              style={styles.input}
              inputMode="decimal"
            />
          </Field>
          <Field label="Radius (km)">
            <input
              value={radius}
              onChange={(e) => onChangeRadius(e.target.value)}
              style={styles.input}
              inputMode="decimal"
            />
          </Field>

          <Button variant="secondary" onClick={onUseMyLocation} disabled={loading}>
            {loading ? 'Locating…' : 'Use my location'}
          </Button>
        </div>

        {error ? <div style={styles.errorText}>{error}</div> : null}
      </div>
    </Card>
  );
}

