import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Camera, Trash2, Utensils } from 'lucide-react';
import { supabase, TABLES } from '../../lib/supabase';

export default function Food() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem('clientId');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from(TABLES.FOOD_LOGS)
      .select('*')
      .eq('client_id', clientId)
      .gte('created_at', today)
      .order('created_at', { ascending: false });
    setLogs(data || []);
    setLoading(false);
  }

  async function deleteLog(id) {
    if (!window.confirm('Remove this entry?')) return;
    const { error } = await supabase.from(TABLES.FOOD_LOGS).delete().eq('id', id);
    if (!error) setLogs(logs.filter(l => l.id !== id));
  }

  const totals = logs.reduce((acc, l) => ({
    cal: acc.cal + (l.calories || 0),
    p: acc.p + (l.protein || 0),
    c: acc.c + (l.carbs || 0),
    f: acc.f + (l.fats || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', padding: '20px 20px 40px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Daily Nutrition</h1>
        </div>
        <Link to="/scan" className="primary-button" style={{ padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <Camera size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Scan</span>
        </Link>
      </header>

      {/* Summary Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {[
          { label: 'Kcal', val: totals.cal, color: 'var(--color-primary)' },
          { label: 'Prot', val: totals.p + 'g', color: '#64d2ff' },
          { label: 'Carb', val: totals.c + 'g', color: '#ffb944' },
          { label: 'Fat',  val: totals.f + 'g', color: '#ff6b6b' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
        ) : logs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <Utensils size={40} style={{ color: 'var(--color-text-dim)', marginBottom: 16 }} />
            <p style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>No meals logged yet today.</p>
            <Link to="/scan" className="primary-button" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>Start Scanning</Link>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="glass-panel slide-up" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary)', background: 'rgba(163,230,53,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {log.meal_type}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{log.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 2 }}>
                  {log.protein}g P · {log.carbs}g C · {log.fats}g F
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{log.calories}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>kcal</div>
                </div>
                <button onClick={() => deleteLog(log.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', padding: 4 }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
