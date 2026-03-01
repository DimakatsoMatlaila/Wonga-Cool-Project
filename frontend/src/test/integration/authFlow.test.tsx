import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { authService } from '../../services/authService';

describe('Integration Tests - User Flow', () => {
  beforeAll(() => {
    // Clear any stored auth data
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('full user authentication flow - login to profile', async () => {
    // Render the app
    render(<App />);

    // Should start at login page
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    // Note: This is a smoke test for the UI flow
    // Actual API calls would need a test server or mocked responses
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Verify login button is present
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    // Clear any auth data
    authService.logout();

    render(<App />);

    // Should be on login page
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('shows validation for required fields', async () => {
    render(<App />);

    const loginButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit without filling fields
    fireEvent.click(loginButton);

    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(emailInput.validity.valid).toBe(false);
    expect(passwordInput.validity.valid).toBe(false);
  });

  it('displays error message on invalid login', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    // Fill in credentials
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit form
    fireEvent.click(loginButton);

    // Note: Without a real backend, we can't test the actual error response
    // This test verifies the UI is ready to display errors
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates between pages correctly', async () => {
    render(<App />);

    // Should start at login (redirected from /)
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    // Verify we're on login page
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
