import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="profile-container">
      <article className="profile-card">
        <header className="profile-header">
          <img 
            src="https://www.wonga.co.za/assets/logo-Ku4JeGCj.webp" 
            alt="Wonga Finance" 
            className="wonga-logo-small"
          />
          <figure className="profile-avatar">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </figure>
          <h1>Welcome, {user.firstName}!</h1>
        </header>

        <section className="profile-content">
          <h2>User Information</h2>
          
          <dl className="info-grid">
            <div className="info-item">
              <dt>First Name</dt>
              <dd className="info-value">{user.firstName}</dd>
            </div>

            <div className="info-item">
              <dt>Last Name</dt>
              <dd className="info-value">{user.lastName}</dd>
            </div>

            <div className="info-item">
              <dt>Email</dt>
              <dd className="info-value">{user.email}</dd>
            </div>

            <div className="info-item">
              <dt>User ID</dt>
              <dd className="info-value">{user.id}</dd>
            </div>

            <div className="info-item">
              <dt>Member Since</dt>
              <dd className="info-value">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <footer className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </footer>
      </article>
    </main>
  );
}
