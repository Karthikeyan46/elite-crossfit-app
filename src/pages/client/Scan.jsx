import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import VisionScanner from '../../components/VisionScanner';
import { supabase, TABLES } from '../../lib/supabase';

export default function Scan() {
  const navigate = useNavigate();
  const clientId = localStorage.getItem('clientId');
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mealType, setMealType] = useState('breakfast');

  async function saveToLog() {
    if (!result) return;
    
    if (localStorage.getItem('isDemoMode') === 'true') {
      alert('Demo Scan complete! Join ELITE CROSS Fit Studio to save your logs and track progress.');
      localStorage.removeItem('isDemoMode'); // Ends demo after one scan
      navigate('/');
      return;
    }

    if (!clientId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from(TABLES.FOOD_LOGS).insert([{
        client_id: clientId,
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
        meal_type: mealType
      }]);

      if (error) throw error;
      navigate('/food');
    } catch (err) {
      console.error('Error saving scan:', err);
      alert('Failed to save log. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-main)', padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', padding: 4 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>AI Food Scanner</h1>
      </header>

      {!result ? (
        <VisionScanner onResult={setResult} />
      ) : (
        <div className="glass-panel slide-up" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: 24, marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Scan Result</h2>
          
          <div style={{ display: 'grid', gap: 12, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'var(--color-text-dim)' }}>Detected</span>
              <span style={{ fontWeight: 600 }}>{result.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'var(--color-text-dim)' }}>Calories</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{result.calories} kcal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Protein</div>
                <div style={{ fontWeight: 600 }}>{result.protein}g</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Carbs</div>
                <div style={{ fontWeight: 600 }}>{result.carbs}g</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Fats</div>
                <div style={{ fontWeight: 600 }}>{result.fats}g</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Meal Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  style={{
                    flex: 1, padding: '10px 4px', fontSize: 11, borderRadius: 8, border: '1px solid',
                    textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                    background: mealType === type ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    borderColor: mealType === type ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                    color: mealType === type ? '#000' : '#fff'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setResult(null)}
              className="secondary-button"
              style={{ flex: 1, padding: '14px' }}
            >
              Retake
            </button>
            <button
              onClick={saveToLog}
              disabled={saving}
              className="primary-button"
              style={{ flex: 2, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Saving...' : 'Confirm & Log'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
