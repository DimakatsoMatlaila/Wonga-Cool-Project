import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { LoginRequest, RegisterRequest } from '../../types/auth';

// Mock axios before importing authService
const mockPost = vi.fn();
const mockGet = vi.fn();
const mockInterceptors = {
  request: { use: vi.fn() },
  response: { use: vi.fn() },
};

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        post: mockPost,
        get: mockGet,
        interceptors: mockInterceptors,
      })),
    },
  };
});

// Import authService after mocking axios
const { authService } = await import('../../services/authService');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('logs in successfully and stores token and user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'refresh-token',
          expiresAt: '2024-01-01T01:00:00Z',
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const credentials: LoginRequest = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(mockPost).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    it('handles login failure', async () => {
      mockPost.mockRejectedValue(new Error('Login failed'));

      const credentials: LoginRequest = {
        email: 'john@example.com',
        password: 'wrong-password',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('does not store token when response has no token', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const credentials: LoginRequest = {
        email: 'john@example.com',
        password: 'password123',
      };

      await authService.login(credentials);

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('registers successfully and stores token and user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          refreshToken: 'refresh-token',
          expiresAt: '2024-01-01T01:00:00Z',
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const userData: RegisterRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const result = await authService.register(userData);

      expect(mockPost).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    it('handles registration failure', async () => {
      mockPost.mockRejectedValue(new Error('Registration failed'));

      const userData: RegisterRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      await expect(authService.register(userData)).rejects.toThrow('Registration failed');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('does not store token when response has no token', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const userData: RegisterRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      await authService.register(userData);

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('gets current user successfully', async () => {
      const mockUser = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockGet).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('handles error when getting current user', async () => {
      mockGet.mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('removes token and user from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '123', email: 'test@example.com' }));

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getStoredUser', () => {
    it('returns user from localStorage', () => {
      const mockUser = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      };

      localStorage.setItem('user', JSON.stringify(mockUser));

      const result = authService.getStoredUser();

      expect(result).toEqual(mockUser);
    });

    it('returns null when no user in localStorage', () => {
      const result = authService.getStoredUser();

      expect(result).toBeNull();
    });
  });

  describe('getToken', () => {
    it('returns token from localStorage', () => {
      localStorage.setItem('token', 'test-token');

      const result = authService.getToken();

      expect(result).toBe('test-token');
    });

    it('returns null when no token in localStorage', () => {
      const result = authService.getToken();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('token', 'test-token');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('returns false when no token exists', () => {
      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
