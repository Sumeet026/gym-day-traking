import { useMemo } from 'react';

const GOAL = 8;

export default function Water({ todayData, updateWater, weekWaterData }) {
  const glasses = todayData.water;
  const percent = Math.min((glasses / GOAL) * 100, 100);
  const circumference = 2 * Math.PI * 45;

  const handleAdd = () => {
    if (glasses < 20) updateWater(glasses + 1);
  };

  const handleMinus = () => {
    if (glasses > 0) updateWater(glasses - 1);
  };

  const handleReset = () => {
    updateWater(0);
  };

  const weekWater = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates.map(d => ({
      date: d,
      day: new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' }),
      glasses: weekWaterData[d] || 0
    }));
  }, [weekWaterData]);

  const maxWeekWater = Math.max(...weekWater.map(d => d.glasses), 1);

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-tint"></i> Water Tracker</h2>

      <div className="water-display">
        <div className="water-circle">
          <svg viewBox="0 0 100 100">
            <circle className="water-bg-circle" cx="50" cy="50" r="45" />
            <circle
              className="water-progress-circle"
              cx="50" cy="50" r="45"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (percent / 100) * circumference}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="water-center">
            <span className="water-amount">{glasses}</span>
            <span className="water-unit">glasses</span>
          </div>
        </div>
        <p className="water-goal-text">Goal: {GOAL} glasses ({GOAL * 250}ml)</p>
      </div>

      <div className="water-buttons">
        <button className="btn btn-water minus" onClick={handleMinus} disabled={glasses <= 0}>
          <i className="fas fa-minus"></i>
        </button>
        <button className="btn btn-water plus" onClick={handleAdd}>
          <i className="fas fa-plus"></i> Add Glass
        </button>
        <button className="btn btn-water reset" onClick={handleReset}>
          <i className="fas fa-redo"></i>
        </button>
      </div>

      <div className="water-glasses">
        {Array.from({ length: GOAL }, (_, i) => (
          <div key={i} className={`glass ${i < glasses ? 'filled' : ''}`}>
            <i className="fas fa-glass-whiskey"></i>
            <span>{i + 1}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-history"></i> Weekly Water</h3>
        <div className="weekly-bars">
          {weekWater.map((d, i) => (
            <div key={i} className="weekly-bar-item">
              <div className="bar-container">
                <div className="bar-fill water-bar" style={{ height: `${(d.glasses / maxWeekWater) * 100}%` }}>
                  <span className="bar-value">{d.glasses}</span>
                </div>
              </div>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
