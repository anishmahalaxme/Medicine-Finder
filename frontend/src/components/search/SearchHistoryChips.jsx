import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'omf.search-history';

export default function SearchHistoryChips({ onSelectQuery }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
    // Listen for custom event from SearchBar
    window.addEventListener('omf-search-added', loadHistory);
    return () => window.removeEventListener('omf-search-added', loadHistory);
  }, []);

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {}
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }

  if (history.length === 0) return null;

  return (
    <div className="search-history-chips row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
      <span className="subtle" style={{ fontSize: 12, marginRight: 4 }}>Recent:</span>
      {history.map((q, idx) => (
        <button
          key={q + idx}
          className="badge ghost"
          style={{ cursor: 'pointer', padding: '4px 10px', fontSize: 12 }}
          onClick={() => onSelectQuery(q)}
        >
          {q}
        </button>
      ))}
      <button 
        className="badge error" 
        style={{ cursor: 'pointer', padding: '4px 8px', fontSize: 12, opacity: 0.6 }}
        onClick={clearHistory}
      >
        Clear
      </button>
    </div>
  );
}

// Utility to add queries from any component
export function addSearchToHistory(query) {
  if (!query || query.trim().length === 0) return;
  const cleaned = query.trim();
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let hist = raw ? JSON.parse(raw) : [];
    hist = hist.filter(q => q.toLowerCase() !== cleaned.toLowerCase());
    hist.unshift(cleaned);
    hist = hist.slice(0, 5); // Keep last 5
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
    window.dispatchEvent(new Event('omf-search-added'));
  } catch (e) {}
}
