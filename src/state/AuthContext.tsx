import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { API_ROUTES } from '../config/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => void;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const response = await fetch(API_ROUTES.AUTH.SESSION, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const loginWithGithub = () => {
    // Simply redirect to the backend GitHub auth endpoint
    window.location.href = API_ROUTES.AUTH.GITHUB;
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    // Store tokens securely (e.g., in httpOnly cookies)
    // This might not be needed if your backend already sets the cookies
    // But you might want to store them in memory for API calls
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async () => {
    try {
      setError(null);
      await fetch(API_ROUTES.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const response = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGithub,
    logout,
    signup,
    resetPassword,
    setTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 