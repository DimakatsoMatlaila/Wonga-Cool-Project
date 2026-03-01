import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Register.css';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      setPasswordError('Password must contain at least one special character (!@#$%^&*)');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');

    // Validate password
    if (!validatePassword(password)) {
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await register({ firstName, lastName, email, password });
      navigate('/profile');
    } catch (err) {
      // Error is handled by the store
      console.error('Registration error:', err);
    }
  };

  return (
    <main className="register-container">
      <article className="register-card">
        <header className="register-header">
          <img 
            src="https://www.wonga.co.za/assets/logo-Ku4JeGCj.webp" 
            alt="Wonga Finance" 
            className="wonga-logo"
          />
          <h1>Create Your Account</h1>
          <h2>Join Wonga Finance today</h2>
        </header>
        
        {error && (
          <aside className="error-message" role="alert">
            <strong>Registration Error:</strong> {error}
          </aside>
        )}

        {passwordError && (
          <aside className="error-message" role="alert">
            <strong>Password Error:</strong> {passwordError}
          </aside>
        )}

        <form onSubmit={handleSubmit}>
          <section className="form-row">
            <fieldset className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                disabled={isLoading}
                minLength={2}
              />
            </fieldset>

            <fieldset className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                disabled={isLoading}
                minLength={2}
              />
            </fieldset>
          </section>

          <fieldset className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="yourname@example.com"
              disabled={isLoading}
            />
          </fieldset>

          <fieldset className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
              disabled={isLoading}
              minLength={8}
            />
            <small className="password-hint">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </small>
          </fieldset>

          <fieldset className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
              disabled={isLoading}
            />
          </fieldset>

          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <footer className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </footer>
      </article>
    </main>
  );
}
