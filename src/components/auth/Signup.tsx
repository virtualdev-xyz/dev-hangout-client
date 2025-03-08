import { useState, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { signup, loginWithGithub, clearError } from '../../state/slices/authSlice';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Divider } from '../ui/Divider';
import { Alert } from '../ui/Alert';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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
      await dispatch(signup({ email, password, username })).unwrap();
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
    <Card className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex items-center justify-end">
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => dispatch(clearError())}
            >
              Already have an account?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="mt-6">
            <Divider>Or continue with</Divider>

            <Button
              type="button"
              variant="outline"
              onClick={handleGithubSignup}
              disabled={isLoading}
              className="w-full mt-6"
              icon={
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              GitHub
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
} 