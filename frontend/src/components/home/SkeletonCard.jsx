import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="home-card">
      <div className="skeleton sk-title" />
      <div className="skeleton sk-line" />
      <div className="skeleton sk-line short" />
      <div className="skeleton sk-btn" />
    </div>
  );
}

