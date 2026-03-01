import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      navigate('/profile');
    } catch (err) {
      // Error is handled by the store
      console.error('Login error:', err);
    }
  };

  return (
    <main className="login-container">
      <article className="login-card">
        <header className="login-header">
          <img 
            src="https://www.wonga.co.za/assets/logo-Ku4JeGCj.webp" 
            alt="Wonga Finance" 
            className="wonga-logo"
          />
          <h1>Welcome Back</h1>
          <h2>Sign in to your account</h2>
        </header>
        
        {error && (
          <aside className="error-message" role="alert">
            <strong>Login Failed:</strong> {error}
          </aside>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </fieldset>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <footer className="register-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </footer>
      </article>
    </main>
  );
}
