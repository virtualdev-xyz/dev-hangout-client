const getApiBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_API_URL || 'https://api.dev-hangout.com';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ROUTES = {
  AUTH: {
    SESSION: `${API_BASE_URL}/auth/session`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    GITHUB: `${API_BASE_URL}/auth/github`,
    SIGNUP: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
} as const; 