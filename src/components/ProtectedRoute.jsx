import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, isVerified } = useAuth();

  if (!currentUser) {
    return children;
  }

  if (!isVerified) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-dumbbell"></i>
            </div>
            <h1>GymTracker</h1>
          </div>
          <div className="verify-box">
            <div className="verify-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h2>Email Verify Karo!</h2>
            <p>Apna email check karo aur verify link pe click karo.</p>
            <p className="verify-note">Spam folder mein bhi dekh lo!</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
