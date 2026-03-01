import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

// Mock the auth service
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getStoredUser: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('logs in successfully', async () => {
    const mockUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z',
    };

    const mockResponse = {
      token: 'test-token',
      refreshToken: 'refresh-token',
      expiresAt: '2024-01-01T01:00:00Z',
      user: mockUser,
    };

    (authService.login as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login({
        email: 'john@example.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles login failure', async () => {
    const mockError = {
      response: {
        data: {
          title: 'Invalid credentials',
        },
      },
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'john@example.com',
          password: 'wrong-password',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('logs out successfully', () => {
    const { result } = renderHook(() => useAuthStore());

    // Set initial authenticated state
    act(() => {
      useAuthStore.setState({
        user: {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          createdAt: '2024-01-01T00:00:00Z',
        },
        isAuthenticated: true,
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('clears error', () => {
    const { result } = renderHook(() => useAuthStore());

    // Set error state
    act(() => {
      useAuthStore.setState({ error: 'Some error' });
    });

    expect(result.current.error).toBe('Some error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('initializes auth from storage', () => {
    const mockUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z',
    };

    (authService.getStoredUser as any).mockReturnValue(mockUser);
    (authService.isAuthenticated as any).mockReturnValue(true);

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.initializeAuth();
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles 401 error during login with specific message', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'john@example.com',
          password: 'wrong-password',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Invalid email or password. Please check your credentials and try again.');
  });

  it('handles 404 error during login', async () => {
    const mockError = {
      response: {
        status: 404,
        data: {},
      },
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Account not found. Please register first or check your email address.');
  });

  it('handles 500 error during login', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { title: 'Internal Server Error' },
      },
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'john@example.com',
          password: 'password123',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Internal Server Error');
  });

  it('handles network error during login', async () => {
    const mockError = {
      request: {},
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'john@example.com',
          password: 'password123',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Unable to connect to the server. Please check your internet connection.');
  });

  it('handles general error during login', async () => {
    const mockError = {
      response: {
        status: 403,
        data: { message: 'Forbidden' },
      },
    };

    (authService.login as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'john@example.com',
          password: 'password123',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Forbidden');
  });

  it('registers successfully', async () => {
    const mockUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z',
    };

    const mockResponse = {
      token: 'test-token',
      refreshToken: 'refresh-token',
      expiresAt: '2024-01-01T01:00:00Z',
      user: mockUser,
    };

    (authService.register as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles 400 error during registration with validation errors', async () => {
    const mockError = {
      response: {
        status: 400,
        data: {
          errors: {
            Email: ['Email is required', 'Invalid email format'],
            Password: ['Password must be at least 8 characters'],
          },
        },
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          password: 'weak',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toContain('Email is required');
    expect(result.current.error).toContain('Password must be at least 8 characters');
  });

  it('handles 400 error during registration with title', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { title: 'Bad Request' },
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Bad Request');
  });

  it('handles 400 error during registration with generic message', async () => {
    const mockError = {
      response: {
        status: 400,
        data: {},
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Invalid registration data. Please check your inputs.');
  });

  it('handles 409 error during registration (email already exists)', async () => {
    const mockError = {
      response: {
        status: 409,
        data: {},
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'existing@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('An account with this email already exists.');
  });

  it('handles 422 error during registration (email already exists)', async () => {
    const mockError = {
      response: {
        status: 422,
        data: {},
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'existing@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('An account with this email already exists.');
  });

  it('handles 500 error during registration', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { title: 'Internal Server Error' },
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Internal Server Error');
  });

  it('handles network error during registration', async () => {
    const mockError = {
      request: {},
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Unable to connect to the server. Please check your internet connection.');
  });

  it('handles general error during registration', async () => {
    const mockError = {
      response: {
        status: 403,
        data: { message: 'Forbidden' },
      },
    };

    (authService.register as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Password123!',
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Forbidden');
  });
});
