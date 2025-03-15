import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { resetPassword, clearError } from '../../state/slices/authSlice';
import { retroTheme } from '../../styles/theme';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(resetPassword(email)).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the slice
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%' }}>
          <div>
            <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: 800 }}>
              Check your email
            </h2>
            <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
              We've sent you instructions to reset your password. Please check your
              email.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/login"
              style={{ fontWeight: 500, color: retroTheme.colors.vhsBlue }}
              onClick={() => dispatch(clearError())}
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div>
          <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: 800 }}>
            Reset your password
          </h2>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            Enter your email address and we'll send you instructions to reset your
            password.
          </p>
        </div>
        <form style={{ marginTop: '2rem' }} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" style={{ display: 'none' }}>
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: retroTheme.colors.errorRed, fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              <Link
                to="/login"
                style={{ fontWeight: 500, color: retroTheme.colors.vhsBlue }}
                onClick={() => dispatch(clearError())}
              >
                Remember your password?
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#ffffff',
                backgroundColor: retroTheme.colors.vhsBlue,
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}