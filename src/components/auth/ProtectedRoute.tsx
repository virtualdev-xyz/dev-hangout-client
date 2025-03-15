import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../state/store';
import { checkSession } from '../../state/slices/authSlice';
import { useDispatch } from 'react-redux';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

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