import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Utensils, Dumbbell, TrendingUp, ClipboardList, Camera, User } from 'lucide-react';
import { supabase, TABLES } from '../../lib/supabase';

const NAV = [
  { icon: Utensils,      label: 'Food',     to: '/food' },
  { icon: Camera,        label: 'Scan',     to: '/scan' },
  { icon: Dumbbell,      label: 'Workout',  to: '/workout' },
  { icon: TrendingUp,    label: 'Progress', to: '/progress' },
  { icon: ClipboardList, label: 'Check-in', to: '/checkin' },
  { icon: User,          label: 'Profile',  to: '/profile' },
];

export default function ClientHome() {
  const clientId   = localStorage.getItem('clientId');
  const clientName = localStorage.getItem('clientName') || 'Athlete';
  const [stats, setStats] = useState({ calories: 0, goal: 2000, workoutDone: false, streak: 0, trainerNote: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (localStorage.getItem('isDemoMode') === 'true') {
      import('react-router-dom').then(({ useNavigate }) => {
        // Redirection handled better by component return or useEffect hook
      });
      setLoading(false);
      return;
    }
    load(); 
  }, []);

  async function load() {
    const today = new Date().toISOString().slice(0, 10);

    const [{ data: profile }, { data: food }, { data: todayW }, { data: recentW }] = await Promise.all([
      supabase.from(TABLES.PROFILES).select('daily_goal, trainer_note').eq('id', clientId).single(),
      supabase.from(TABLES.FOOD_LOGS).select('calories').eq('client_id', clientId).gte('created_at', today),
      supabase.from(TABLES.WORKOUT_LOGS).select('id').eq('client_id', clientId).gte('created_at', today),
      supabase.from(TABLES.WORKOUT_LOGS).select('created_at').eq('client_id', clientId).order('created_at', { ascending: false }).limit(14),
    ]);

    const logDays = new Set((recentW || []).map(l => l.created_at.slice(0, 10)));
    let streak = 0;
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (logDays.has(d.toISOString().slice(0, 10))) streak++;
      else break;
    }

    setStats({
      calories: (food || []).reduce((s, f) => s + (f.calories || 0), 0),
      goal: profile?.daily_goal || 2000,
      workoutDone: (todayW || []).length > 0,
      streak,
      trainerNote: profile?.trainer_note || '',
    });
    setLoading(false);
  }

  const pct     = Math.min(100, Math.round((stats.calories / stats.goal) * 100));
  const calLeft = Math.max(0, stats.goal - stats.calories);
  const hour    = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = clientName.split(' ')[0];

  if (localStorage.getItem('isDemoMode') === 'true') {
    return <Navigate to="/scan" replace />;
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg-main)' }}>
      <div className="loader" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-dim)', marginBottom: 4 }}>{greeting},</div>
        <h1 style={{ fontFamily: 'var(--font-display,"Bebas Neue",sans-serif)', fontSize: 36, margin: 0 }}>{firstName.toUpperCase()}</h1>
        {stats.streak > 0 && (
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(163,230,53,0.1)', borderRadius: 100, padding: '4px 12px', border: '1px solid rgba(163,230,53,0.2)' }}>
            <span>🔥</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}>{stats.streak} day streak</span>
          </div>
        )}
      </div>

      {/* Calorie card */}
      <div className="glass-panel" style={{ margin: '0 16px 14px', padding: '1.25rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: 14 }}>Calories Today</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
            <circle cx="38" cy="38" r="30" fill="none" stroke="var(--color-primary)" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - pct / 100)}`}
              strokeLinecap="round" transform="rotate(-90 38 38)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text x="38" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f5f2ec">{pct}%</text>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-display,"Bebas Neue",sans-serif)', fontSize: 40, lineHeight: 1, color: 'var(--color-primary)' }}>{stats.calories}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>of {stats.goal} kcal · {calLeft} left</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.6s' }} />
        </div>
      </div>

      {/* Workout status */}
      <div className="glass-panel" style={{
        margin: '0 16px 14px', padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: 14,
        borderColor: stats.workoutDone ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.07)'
      }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: stats.workoutDone ? 'rgba(163,230,53,0.15)' : 'rgba(163,230,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Dumbbell size={20} color="var(--color-primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{stats.workoutDone ? 'Workout complete! 💪' : "Today's Workout"}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{stats.workoutDone ? 'Great work today' : 'Tap to start your session'}</div>
        </div>
        {!stats.workoutDone && (
          <Link to="/workout" className="primary-button" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>Start</Link>
        )}
      </div>

      {/* Trainer note */}
      {stats.trainerNote && (
        <div className="glass-panel" style={{ margin: '0 16px 14px', padding: '1rem 1.25rem', borderLeft: '3px solid var(--color-primary)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 8 }}>Trainer Instructions</div>
          <p style={{ fontSize: 14, color: 'var(--color-text-dim)', lineHeight: 1.6, margin: 0 }}>{stats.trainerNote}</p>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 16px' }}>
        {[
          { icon: Utensils, label: 'Log Food', sub: 'Track your meals', to: '/food' },
          { icon: Camera,   label: 'Scan Food', sub: 'AI camera', to: '/scan' },
          { icon: TrendingUp, label: 'Progress', sub: 'Charts & photos', to: '/progress' },
          { icon: ClipboardList, label: 'Check-in', sub: 'Weekly report', to: '/checkin' },
        ].map(({ icon: Icon, label, sub, to }) => (
          <Link key={to} to={to} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', textDecoration: 'none', transition: 'background 0.2s' }}>
            <Icon size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-bg-secondary, #141414)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-around', padding: '8px 0 max(8px,env(safe-area-inset-bottom))' }}>
        {NAV.map(({ icon: Icon, label, to }) => {
          const active = window.location.pathname === to;
          return (
            <Link key={to} to={to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', textDecoration: 'none', color: active ? 'var(--color-primary)' : 'var(--color-text-dim)' }}>
              <Icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
