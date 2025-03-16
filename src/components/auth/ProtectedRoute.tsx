import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderColor: '#6366f1',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Redirect to home if user is already logged in (e.g., for login/signup pages)
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}