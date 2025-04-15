import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, userRole }) {
  const { currentUser, userRole: currentUserRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (userRole && userRole !== currentUserRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
