import React, { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div className="glass card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Contact</div>
        <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          This is a UI-only form for now. Later we can connect it to backend email/ticketing.
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          <div>
            <div className="label">Name</div>
            <input className="input" placeholder="Your name" required />
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <div className="label">Message</div>
            <textarea className="input" rows="4" placeholder="How can we help?" required />
          </div>
          <button className="btn primary" type="submit">{sent ? 'Sent (demo)' : 'Send message'}</button>
        </form>
      </div>

      <div className="glass card">
        <div style={{ fontWeight: 900, fontSize: 16 }}>Support</div>
        <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          - Email: <b>support@omf.example</b><br />
          - Hours: <b>9am–7pm</b><br />
          - SLA: <b>24h</b>
        </div>

        <div style={{ marginTop: 14 }} className="glass card">
          <div className="subtle" style={{ fontSize: 12 }}>Note</div>
          <div style={{ marginTop: 6, fontWeight: 850, fontSize: 13 }}>
            Backend integration will enable notifications, saved searches, and admin workflows.
          </div>
        </div>
      </div>
    </div>
  );
}

