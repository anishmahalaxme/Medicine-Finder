import React, { useState } from 'react';

export default function CartSearch({ onSearchCart }) {
  const [cart, setCart] = useState([]);
  const [input, setInput] = useState('');

  function addInput() {
    const val = input.trim();
    if (!val) return;
    if (cart.includes(val.toLowerCase())) return;
    if (cart.length >= 5) return alert('Maximum 5 items in cart');
    
    setCart([...cart, val.toLowerCase()]);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInput();
    }
  }

  function remove(idx) {
    setCart(cart.filter((_, i) => i !== idx));
  }

  function onSearch() {
    if (cart.length === 0) {
      if (input.trim()) {
        onSearchCart([input.trim()]);
        return;
      }
      alert('Add some medicines to your list first.');
      return;
    }
    onSearchCart(cart);
  }

  return (
    <div className="cart-search-box glass card" style={{ padding: 20 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Multi-Medicine Cart Search</div>
      <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        Search for your entire prescription at once. We'll find the store that has the most matching items in stock!
      </div>
      
      <div className="cart-input-row" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input 
          className="input" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type medicine name and press Enter..." 
          style={{ flex: 1 }}
        />
        <button className="btn ghost" onClick={addInput}>Add to list</button>
      </div>

      {cart.length > 0 && (
        <div className="cart-chips row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {cart.map((c, i) => (
            <div key={c} className="badge primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
              {c}
              <span style={{ cursor: 'pointer', opacity: 0.7, fontWeight: 'bold' }} onClick={() => remove(i)}>×</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn primary" style={{ width: '100%', padding: 12, fontSize: 16 }} onClick={onSearch}>
        Search All Items
      </button>
    </div>
  );
}
