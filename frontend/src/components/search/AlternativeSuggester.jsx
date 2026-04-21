import React, { useEffect, useState } from 'react';
import { fetchAlternatives } from '../../api/medicines.js';
import { useGeoLocation } from '../../state/geo.jsx';

export default function AlternativeSuggester({ category, excludeId, onSelectAlternative }) {
  const [alts, setAlts] = useState([]);
  const geo = useGeoLocation();

  useEffect(() => {
    if (!category || !excludeId) return;
    
    let active = true;
    fetchAlternatives({ 
      category, 
      exclude_id: excludeId, 
      lat: geo.lat, 
      lng: geo.lng, 
      radius: geo.radius 
    }).then(results => {
      if (active) {
        // Group by medicine
        const unq = [];
        const seen = new Set();
        for (const r of results) {
          if (!seen.has(r.medicine_id)) {
            seen.add(r.medicine_id);
            unq.push(r.medicine_name);
          }
        }
        setAlts(unq.slice(0, 4));
      }
    }).catch(e => console.error(e));

    return () => { active = false; };
  }, [category, excludeId, geo.lat, geo.lng, geo.radius]);

  if (alts.length === 0) return null;

  return (
    <div className="alt-suggester glass card" style={{ padding: '16px', marginTop: 16, borderLeft: '4px solid #f59e0b' }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#b45309' }}>Out of stock nearby?</div>
      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
        Try these alternative medicines in the <b>{category}</b> category which are currently in stock:
      </div>
      <div className="row" style={{ marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
        {alts.map(a => (
          <button 
            key={a} 
            className="btn ghost" 
            style={{ padding: '6px 12px', fontSize: 13, border: '1px solid #d1d5db' }}
            onClick={() => onSelectAlternative(a)}
          >
            {a} &rarr;
          </button>
        ))}
      </div>
    </div>
  );
}
