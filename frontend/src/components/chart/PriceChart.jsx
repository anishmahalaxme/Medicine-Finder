import React from 'react';

export default function PriceChart({ items }) {
  if (!items || items.length === 0) return null;

  const maxPrice = Math.max(...items.map((i) => i.value));
  const height = Math.max(200, items.length * 36 + 40);
  const rowHeight = 36;

  // Handle empty or 0 max
  const safeMax = maxPrice > 0 ? maxPrice : 100;

  return (
    <div className="price-chart" style={{ padding: '20px 0' }}>
      <svg width="100%" height={height} style={{ overflow: 'visible' }}>
        <style>
          {`
            .chart-bar { transition: width 1s ease-out; }
            .chart-text { font-family: inherit; font-size: 13px; fill: #64748b; }
            .chart-value { font-family: inherit; font-size: 13px; font-weight: 600; fill: #0f172a; }
          `}
        </style>
        
        {items.map((item, idx) => {
          const y = idx * rowHeight;
          const widthPct = (item.value / safeMax) * 100;
          const barWidth = Math.max(1, widthPct) + '%';
          const isMin = item.value === Math.min(...items.map(i => i.value));
          
          return (
            <g key={item.label + idx} transform={`translate(0, ${y})`}>
              <text x="0" y="20" className="chart-text" width="120">
                {item.label.length > 20 ? item.label.substring(0, 18) + '...' : item.label}
              </text>
              
              <rect
                x="140"
                y="6"
                width={barWidth}
                height="18"
                rx="4"
                fill={isMin ? '#22c55e' : (item.color || '#3b82f6')}
                className="chart-bar"
                style={{ scale: '1 1', transformOrigin: 'left' }}
              />
              
              <text x="148" y="20" className="chart-value" style={{ fill: '#fff', fontSize: '12px' }}>
                ₹{item.value.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
