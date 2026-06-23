import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onToggle }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.user.emailVerified) {
        setError('Please verify your email first! Check your inbox.');
        setLoading(false);
        return;
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email!');
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format!');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-dumbbell"></i>
          </div>
          <h1>GymTracker</h1>
          <p>Your Fitness Partner</p>
        </div>

        <h2 className="auth-title">Login</h2>

        {error && <div className="auth-error"><i className="fas fa-exclamation-circle"></i> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full auth-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : <><i className="fas fa-sign-in-alt"></i> Login</>}
          </button>
        </form>

        <div className="auth-switch">
          <p>New user? <button onClick={onToggle}>Sign up</button></p>
        </div>
      </div>
    </div>
  );
}
