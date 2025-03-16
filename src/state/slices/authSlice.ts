import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/user';
import { API_ROUTES } from '../../config/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const response = await fetch(API_ROUTES.AUTH.SESSION, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (!response.ok) {
      throw new Error('Session check failed');
    }
    const data = await response.json();
    return data.user;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
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
    return data.user;
  }
);

export const loginWithGithub = createAsyncThunk(
  'auth/loginWithGithub',
  async () => {
    return new Promise<User>((resolve, reject) => {
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        `${API_ROUTES.AUTH.GITHUB}`,
        'github-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject(new Error('Failed to open login popup'));
        return;
      }

      window.addEventListener('message', function handler(event) {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'github-oauth-success') {
          window.removeEventListener('message', handler);
          resolve(event.data.user);
        }
        if (event.data.type === 'github-oauth-error') {
          window.removeEventListener('message', handler);
          reject(new Error(event.data.error));
        }
      });
    });
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Signup failed');
    }
    const data = await response.json();
    return data.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await fetch(API_ROUTES.AUTH.LOGOUT, {
    method: 'POST',
    credentials: 'include',
  });
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => {
    const response = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Password reset failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Session
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });

    // GitHub Login
    builder
      .addCase(loginWithGithub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGithub.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGithub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'GitHub login failed';
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password reset failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 