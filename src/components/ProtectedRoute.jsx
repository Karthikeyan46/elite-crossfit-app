import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 *
 * Your app uses localStorage for auth (isClientLoggedIn, isTrainer flags).
 * This wraps that logic so routes redirect cleanly to /login when not authenticated.
 *
 * Usage:
 *   <ProtectedRoute>           — any logged-in user
 *   <ProtectedRoute role="trainer">  — trainer only
 *   <ProtectedRoute role="client">   — client only
 */
export default function ProtectedRoute({ children, role }) {
  const isLoggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
  const isTrainer  = localStorage.getItem('isTrainer') === 'true';
  const isDemoMode = localStorage.getItem('isDemoMode') === 'true';

  // Not logged in at all and not in demo mode → login page
  if (!isLoggedIn && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (role === 'trainer' && !isTrainer) {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'client' && isTrainer) {
    return <Navigate to="/trainer-dashboard" replace />;
  }

  return children;
}
