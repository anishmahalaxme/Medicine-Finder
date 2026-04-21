import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/medicines.js';

const ICONS = {
  'Pain Relief': '💊',
  'Allergy': '🤧',
  'Antibiotic': '🦠',
  'Gastro': '🤢',
  'Diabetes': '🩸',
  'Cardiology': '❤️',
  'Supplements': '⚡',
  'Respiratory': '🫁',
  'Skin Care': '🧴',
  'Eye & ENT': '👁️'
};

export default function CategoryBrowserPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Loading categories...</div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Browse Categories</h1>
      <p className="muted" style={{ marginBottom: 30 }}>Explore medicines by their medical classification.</p>
      
      <div className="category-grid">
        {categories.map((c) => (
          <div 
            key={c.category} 
            className="category-card glass card" 
            onClick={() => nav(`/find-medicine?category=${encodeURIComponent(c.category)}`)}
          >
            <div className="cat-icon">{ICONS[c.category] || '💊'}</div>
            <div className="cat-details">
              <div className="cat-name">{c.category}</div>
              <div className="cat-count muted">{c.medicine_count} medicines</div>
            </div>
            <div className="cat-arrow">&rarr;</div>
          </div>
        ))}
      </div>

      <style>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .category-card {
          display: flex;
          align-items: center;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: rgba(37, 99, 235, 0.2);
        }
        .cat-icon {
          font-size: 32px;
          margin-right: 16px;
          background: rgba(255,255,255,0.5);
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .cat-details {
          flex: 1;
        }
        .cat-name {
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
        }
        .cat-count {
          font-size: 13px;
          margin-top: 4px;
        }
        .cat-arrow {
          font-weight: bold;
          color: #cbd5e1;
          transition: transform 0.2s;
        }
        .category-card:hover .cat-arrow {
          transform: translateX(4px);
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}
