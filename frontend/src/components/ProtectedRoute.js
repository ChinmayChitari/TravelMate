import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getStoredToken } from '../context/AuthContext';

/**
 * Wraps routes that require authentication. Replaces history so back button doesn't return to Sign In.
 * Also checks localStorage so we don't redirect to signin right after signup/signin (context may not have updated yet).
 */
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const tokenInStorage = getStoredToken();

  useEffect(() => {
    if (!isAuthenticated && !tokenInStorage) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, tokenInStorage, navigate]);

  if (!isAuthenticated && !tokenInStorage) {
    return null;
  }

  return children;
}
