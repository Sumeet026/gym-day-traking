import { useState, useEffect } from 'react';

export default function History({ getDataForDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({ workouts: [], diet: [], water: 0, weight: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDataForDate(selectedDate).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [selectedDate, getDataForDate]);

  const changeDate = (delta) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const totalCal = data.diet.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalReps = data.workouts.reduce((sum, w) => sum + ((w.sets || 0) * (w.reps || 0)), 0);

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-calendar-alt"></i> History</h2>

      <div className="date-picker">
        <button className="btn btn-sm" onClick={() => changeDate(-1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <span className="history-date-label">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <button className="btn btn-sm" onClick={() => changeDate(1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <button className="btn btn-sm btn-accent" onClick={goToToday}>Today</button>
      </div>

      {loading ? (
        <div className="loader-container"><div className="loader"></div></div>
      ) : (
        <>
          <div className="history-summary-grid">
            <div className="history-mini-card">
              <i className="fas fa-dumbbell"></i>
              <span className="mini-value">{data.workouts.length}</span>
              <span className="mini-label">Exercises</span>
              <span className="mini-sub">{totalReps} total reps</span>
            </div>
            <div className="history-mini-card">
              <i className="fas fa-fire-alt"></i>
              <span className="mini-value">{totalCal}</span>
              <span className="mini-label">Calories</span>
              <span className="mini-sub">{data.diet.length} meals</span>
            </div>
            <div className="history-mini-card">
              <i className="fas fa-tint"></i>
              <span className="mini-value">{data.water}</span>
              <span className="mini-label">Glasses</span>
              <span className="mini-sub">{data.water * 250}ml</span>
            </div>
            <div className="history-mini-card">
              <i className="fas fa-weight"></i>
              <span className="mini-value">{data.weight || '--'}</span>
              <span className="mini-label">Weight</span>
              <span className="mini-sub">kg</span>
            </div>
          </div>

          <div className="history-card">
            <h4><i className="fas fa-dumbbell"></i> Workout</h4>
            <div className="history-items">
              {data.workouts.length === 0 ? (
                <p className="empty-state">No workout data</p>
              ) : (
                data.workouts.map(w => (
                  <div key={w.id} className="history-workout-item">
                    <span className="hw-name">{w.name}</span>
                    <span className="hw-detail">{w.sets}x{w.reps} @ {w.weight}kg</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="history-card">
            <h4><i className="fas fa-utensils"></i> Diet</h4>
            <div className="history-items">
              {data.diet.length === 0 ? (
                <p className="empty-state">No diet data</p>
              ) : (
                data.diet.map(d => (
                  <div key={d.id} className="history-diet-item">
                    <span className="hd-type">{d.mealType}</span>
                    <span className="hd-name">{d.foodName}</span>
                    <span className="hd-cal">{d.calories} cal</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="history-card">
            <h4><i className="fas fa-tint"></i> Water</h4>
            <div className="history-items">
              <div className="history-water-bar">
                <div className="hwb-fill" style={{ width: `${Math.min((data.water / 8) * 100, 100)}%` }}></div>
              </div>
              <p className="history-water-text">{data.water} / 8 glasses ({data.water * 250}ml)</p>
            </div>
          </div>

          <div className="history-card">
            <h4><i className="fas fa-weight"></i> Weight</h4>
            <div className="history-items">
              {data.weight ? (
                <p className="history-weight-value">{data.weight} kg</p>
              ) : (
                <p className="empty-state">No weight logged</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
