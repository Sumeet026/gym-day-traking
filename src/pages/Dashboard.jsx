import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard({ todayData, weekData, weekWaterData, goals, onNavigate }) {
  const totalCalories = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.calories || 0), 0),
    [todayData.diet]
  );

  const totalProtein = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.protein || 0), 0),
    [todayData.diet]
  );

  const totalExercises = todayData.workouts.length;

  const chartData = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return {
      labels: dates.map(d => {
        const dt = new Date(d + 'T00:00:00');
        return DAYS[dt.getDay()];
      }),
      datasets: [{
        label: 'Total Reps',
        data: dates.map(d => weekData[d]?.totalReps || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      }, {
        label: 'Exercises',
        data: dates.map(d => weekData[d]?.exercises || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      }, {
        label: 'Water (glasses)',
        data: dates.map(d => weekWaterData[d] || 0),
        backgroundColor: 'rgba(6, 182, 212, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  }, [weekData, weekWaterData]);

  const recentActivity = useMemo(() => {
    const items = [];
    todayData.workouts.forEach(w => items.push({ type: 'workout', text: `${w.name} - ${w.sets}x${w.reps} @ ${w.weight}kg` }));
    todayData.diet.forEach(d => items.push({ type: 'diet', text: `${d.foodName} - ${d.calories} cal (${d.mealType})` }));
    return items.slice(0, 8);
  }, [todayData]);

  const waterGoal = goals.waterGoal || 8;
  const caloriesGoal = goals.caloriesGoal || 2000;
  const proteinGoal = goals.proteinGoal || 150;

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-home"></i> Today's Summary</h2>

      <div className="quick-stats">
        <div className="stat-card water-stat" onClick={() => onNavigate('water')}>
          <i className="fas fa-tint"></i>
          <div className="stat-info">
            <span className="stat-value">{todayData.water}/{waterGoal}</span>
            <span className="stat-label">Glasses</span>
          </div>
        </div>
        <div className="stat-card calories-stat" onClick={() => onNavigate('diet')}>
          <i className="fas fa-fire-alt"></i>
          <div className="stat-info">
            <span className="stat-value">{totalCalories}/{caloriesGoal}</span>
            <span className="stat-label">Calories</span>
          </div>
        </div>
        <div className="stat-card weight-stat" onClick={() => onNavigate('weight')}>
          <i className="fas fa-weight"></i>
          <div className="stat-info">
            <span className="stat-value">{todayData.weight || '--'}</span>
            <span className="stat-label">kg {goals.weightGoal ? `(Goal: ${goals.weightGoal})` : ''}</span>
          </div>
        </div>
        <div className="stat-card workout-stat" onClick={() => onNavigate('workout')}>
          <i className="fas fa-heartbeat"></i>
          <div className="stat-info">
            <span className="stat-value">{totalExercises}</span>
            <span className="stat-label">Exercises</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-bullseye"></i> Goal Progress</h3>
        <div className="overview-grid">
          <div className="overview-item">
            <div className="overview-ring">
              <svg viewBox="0 0 36 36">
                <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="ring-fill water-color"
                  strokeDasharray={`${Math.min((todayData.water / waterGoal) * 100, 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span className="ring-text">{Math.round((todayData.water / waterGoal) * 100)}%</span>
            </div>
            <p>Water ({todayData.water}/{waterGoal})</p>
          </div>
          <div className="overview-item">
            <div className="overview-ring">
              <svg viewBox="0 0 36 36">
                <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="ring-fill calories-color"
                  strokeDasharray={`${Math.min((totalCalories / caloriesGoal) * 100, 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span className="ring-text">{Math.round((totalCalories / caloriesGoal) * 100)}%</span>
            </div>
            <p>Calories ({totalCalories}/{caloriesGoal})</p>
          </div>
        </div>
        <div className="overview-grid" style={{ marginTop: '0.75rem' }}>
          <div className="overview-item">
            <div className="overview-ring">
              <svg viewBox="0 0 36 36">
                <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="ring-fill protein-ring"
                  strokeDasharray={`${Math.min((totalProtein / proteinGoal) * 100, 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span className="ring-text">{Math.round((totalProtein / proteinGoal) * 100)}%</span>
            </div>
            <p>Protein ({totalProtein}g/{proteinGoal}g)</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-history"></i> Recent Activity</h3>
        <div className="recent-list">
          {recentActivity.length === 0 ? (
            <p className="empty-state">Add something today to see activity here!</p>
          ) : (
            recentActivity.map((item, i) => (
              <div key={i} className={`recent-item ${item.type}`}>
                <i className={`fas ${item.type === 'workout' ? 'fa-dumbbell' : 'fa-utensils'}`}></i>
                <span>{item.text}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-chart-line"></i> Weekly Progress</h3>
        <Bar data={chartData} options={{
          responsive: true,
          plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
          }
        }} />
      </div>
    </div>
  );
}
