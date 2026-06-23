import { useState } from 'react';
import ProfileModal from './ProfileModal';

export default function Header({ streak, onLogout, profile, onSaveProfile }) {
  const [showProfile, setShowProfile] = useState(false);
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i className="fas fa-dumbbell"></i>
          <h1>GymTracker</h1>
        </div>
        <div className="header-right">
          <span className="date-badge">{today}</span>
          <div className="streak-badge">
            <i className="fas fa-fire"></i>
            <span>{streak}</span>
          </div>
          <button className="profile-btn" onClick={() => setShowProfile(true)}>
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt="Profile" className="header-profile-img" />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </button>
          {onLogout && (
            <button className="logout-btn" onClick={onLogout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          )}
        </div>
      </header>
      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={onSaveProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
