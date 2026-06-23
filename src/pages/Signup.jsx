import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Signup({ onToggle }) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      setShowVerifyMsg(true);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format!');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak!');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
    setLoading(false);
  };

  if (showVerifyMsg) {
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

          <div className="verify-box">
            <div className="verify-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h2>Verify Your Email!</h2>
            <p>We sent a verification link to <strong>{email}</strong></p>
            <p className="verify-instructions">
              1. Check your <strong>inbox</strong><br/>
              2. Find the email from <strong>GymTracker</strong><br/>
              3. <strong>Click</strong> the verification link<br/>
              4. Then <strong>Login</strong>
            </p>
            <p className="verify-note">Check your spam folder too!</p>
            <button className="btn btn-primary btn-full auth-btn" onClick={onToggle}>
              <i className="fas fa-sign-in-alt"></i> Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <h2 className="auth-title">Sign Up</h2>

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
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full auth-btn" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-user-plus"></i> Sign Up</>}
          </button>
        </form>

        <div className="auth-switch">
          <p>Already have an account? <button onClick={onToggle}>Login</button></p>
        </div>
      </div>
    </div>
  );
}
