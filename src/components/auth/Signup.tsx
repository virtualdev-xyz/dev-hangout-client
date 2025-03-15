import { useState, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { signup, loginWithGithub, clearError } from '../../state/slices/authSlice';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state: RootState) => state.auth.error);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(signup({ email, password })).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setIsLoading(true);
    try {
      await dispatch(loginWithGithub()).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Sign up to DevHangout
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '50%', maxWidth: '28rem' }}>
        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error || undefined}
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link
          to="/login"
          style={{ fontSize: '0.875rem' }}
          onClick={() => dispatch(clearError())}
        >
          Already have an account?
        </Link>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="medium"
          style={{ width: '50%' }}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
          <div style={{ width: '100%', borderTop: '1px solid #4a5568' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <span style={{ padding: '0 0.5rem', backgroundColor: 'black', fontSize: '0.875rem' }}>
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          onClick={handleGithubSignup}
          disabled={isLoading}
          variant="secondary"
          size="medium"
          style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg
            style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
              clipRule="evenodd"
            />
          </svg>
          GitHub
        </Button>
      </form>
    </div>
  );
} 