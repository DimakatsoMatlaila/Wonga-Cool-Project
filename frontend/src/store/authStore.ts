import { create } from 'zustand';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (status === 404) {
          errorMessage = 'Account not found. Please register first or check your email address.';
        } else if (status === 500) {
          errorMessage = data?.title || data?.message || 'Server error. Please try again later.';
        } else {
          errorMessage = data?.title || data?.message || `Error (${status}): Unable to login.`;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
       });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          // Validation errors
          if (data?.errors) {
            const validationErrors = Object.values(data.errors).flat() as string[];
            errorMessage = validationErrors.join('. ');
          } else if (data?.title) {
            errorMessage = data.title;
          } else {
            errorMessage = 'Invalid registration data. Please check your inputs.';
          }
        } else if (status === 409 || status === 422) {
          errorMessage = 'An account with this email already exists.';
        } else if (status === 500) {
          errorMessage = data?.title || data?.message || 'Server error. Please try again later.';
        } else {
          errorMessage = data?.title || data?.message || `Error (${status}): Unable to register.`;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },
}));
