import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Profile Component', () => {
  const mockLogout = vi.fn();
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it('renders user information correctly', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument(); // Avatar initials
    expect(screen.getByText('User Information')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('123e4567-e89b-12d3-a456-426614174000')).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Check that some date text exists (exact format may vary by locale)
    expect(screen.getByText(/January|2024/i)).toBeInTheDocument();
  });

  it('calls logout and navigates when logout button is clicked', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders nothing when user is null', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    const { container } = render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('displays all user information fields', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('Member Since')).toBeInTheDocument();
  });
});
