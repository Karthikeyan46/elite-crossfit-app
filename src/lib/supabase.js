import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Auth helpers ─────────────────────────────────────────────────────────────
export const signOut = () => {
  localStorage.clear();
  return Promise.resolve();
};

// ── Table name constants ─────────────────────────────────────────────────────
export const TABLES = {
  PROFILES:      'client_profiles',
  WORKOUT_LOGS:  'workout_logs',
  FOOD_LOGS:     'food_logs',
  WEIGHT_LOGS:   'weight_logs',
  CHALLENGES:    'challenges',
  CHECKINS:      'checkins',
  PROGRESS_PHOTOS: 'progress_photos',
  LEADS:         'demo_leads'
};
