import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// ── Shared Branding Logic ────────────────────────────────────────────────────
const isMobile = Capacitor.isNativePlatform() || window.innerWidth < 768;

// ── Public pages ─────────────────────────────────────────────────────────────
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';

// ── Client Mobile Pages ──────────────────────────────────────────────────────
const ClientHome     = lazy(() => import('./pages/client/Home'));
const ClientWorkout  = lazy(() => import('./pages/client/Workout'));
const ClientFood     = lazy(() => import('./pages/client/Food'));
const ClientScan     = lazy(() => import('./pages/client/Scan'));
const ClientProgress = lazy(() => import('./pages/client/Progress'));
const ClientCheckin  = lazy(() => import('./pages/client/Checkin'));
const ClientProfile  = lazy(() => import('./pages/client/Profile'));
const Dashboard      = lazy(() => import('./pages/Dashboard')); // Web client portal fallback

// ── Trainer Dashboard Pages ──────────────────────────────────────────────────
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));
const TrainerClientList   = lazy(() => import('./pages/trainer/ClientList'));
const TrainerClientDetail = lazy(() => import('./pages/trainer/ClientDetail'));
const TrainerWorkoutList  = lazy(() => import('./pages/trainer/WorkoutList'));
const TrainerWorkoutNew   = lazy(() => import('./pages/trainer/WorkoutBuilder'));
const TrainerCheckins     = lazy(() => import('./pages/trainer/Checkins'));
const TrainerSettings     = lazy(() => import('./pages/trainer/Settings'));

function App() {
  
  if (isMobile) {
    return (
      <Router>
        <Suspense fallback={<div className="loader-container"><div className="loader"></div></div>}>
          <Routes>
            <Route path="/login"      element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/"           element={<Home />} />
            <Route path="/dashboard"  element={<ProtectedRoute role="client"><ClientHome /></ProtectedRoute>} />
            <Route path="/workout"    element={<ProtectedRoute role="client"><ClientWorkout /></ProtectedRoute>} />
            <Route path="/food"       element={<ProtectedRoute role="client"><ClientFood /></ProtectedRoute>} />
            <Route path="/scan"       element={<ProtectedRoute role="client"><ClientScan /></ProtectedRoute>} />
            <Route path="/progress"   element={<ProtectedRoute role="client"><ClientProgress /></ProtectedRoute>} />
            <Route path="/checkin"    element={<ProtectedRoute role="client"><ClientCheckin /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute role="client"><ClientProfile /></ProtectedRoute>} />
            {/* Fallback to Home */}
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  // ── WEB: Full Desktop Experience ──────────────────────────────────────────
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          <Suspense fallback={<div className="loader-container"><div className="loader"></div></div>}>
            <Routes>
              {/* Marketing & Public */}
              <Route path="/"           element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/gallery"    element={<Gallery />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              
              {/* Generic Web Portal */}
              <Route path="/dashboard" element={<ProtectedRoute role="client"><Dashboard /></ProtectedRoute>} />

              {/* Trainer Management Console */}
              <Route path="/trainer-dashboard" element={<ProtectedRoute role="trainer"><TrainerDashboard /></ProtectedRoute>} />
              <Route path="/trainer/clients"     element={<ProtectedRoute role="trainer"><TrainerClientList /></ProtectedRoute>} />
              <Route path="/trainer/clients/:id" element={<ProtectedRoute role="trainer"><TrainerClientDetail /></ProtectedRoute>} />
              <Route path="/trainer/workouts"    element={<ProtectedRoute role="trainer"><TrainerWorkoutList /></ProtectedRoute>} />
              <Route path="/trainer/workouts/new" element={<ProtectedRoute role="trainer"><TrainerWorkoutNew /></ProtectedRoute>} />
              <Route path="/trainer/checkins"    element={<ProtectedRoute role="trainer"><TrainerCheckins /></ProtectedRoute>} />
              <Route path="/trainer/settings"    element={<ProtectedRoute role="trainer"><TrainerSettings /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
