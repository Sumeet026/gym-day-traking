export default function BottomNav({ activeSection, onNavigate }) {
  const items = [
    { id: 'dashboard', icon: 'fa-home', label: 'Home' },
    { id: 'workout', icon: 'fa-dumbbell', label: 'Workout' },
    { id: 'diet', icon: 'fa-utensils', label: 'Diet' },
    { id: 'water', icon: 'fa-tint', label: 'Water' },
    { id: 'weight', icon: 'fa-weight', label: 'Weight' },
    { id: 'history', icon: 'fa-calendar-alt', label: 'History' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
