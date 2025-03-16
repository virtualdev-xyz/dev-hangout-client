import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
          throw new Error('No tokens received');
        }

        // Store the tokens
        setTokens(accessToken, refreshToken);

        // Verify tokens were stored
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error('Failed to store tokens');
        }

        // Small delay to ensure tokens are properly stored
        // await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect to home or the original intended destination
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        // Redirect to login after a short delay to show the error
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ color: '#ef4444', marginBottom: '1rem' }}>Authentication failed: {error}</div>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Processing authentication...</div>
    </div>
  );
} 