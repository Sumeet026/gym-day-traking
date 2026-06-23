export default function Header({ streak, onLogout }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
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
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        )}
      </div>
    </header>
  );
}
