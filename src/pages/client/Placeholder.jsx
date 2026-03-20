import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back
      </button>
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>This feature is coming soon to the ELITE CROSS Fit Studio app!</p>
      </div>
    </div>
  );
}
