import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

function getDateStr(date) {
  return date.toISOString().split('T')[0];
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Reports({ weekData, weekWaterData, monthData, monthDietData, monthWaterData, monthWeightData, goals, getDataForDate }) {
  const [view, setView] = useState('week');
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStart(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [dayDetailData, setDayDetailData] = useState(null);
  const [loadingDay, setLoadingDay] = useState(false);

  // Week dates
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedWeekStart);
      d.setDate(d.getDate() + i);
      dates.push(getDateStr(d));
    }
    return dates;
  }, [selectedWeekStart]);

  // Week totals
  const weekTotals = useMemo(() => {
    let totalReps = 0, totalExercises = 0, totalCal = 0, totalWater = 0, activeDays = 0;
    weekDates.forEach(d => {
      if (weekData[d]) {
        totalReps += weekData[d].totalReps || 0;
        totalExercises += weekData[d].exercises || 0;
        activeDays++;
      }
    });
    weekDates.forEach(d => {
      if (weekWaterData[d]) totalWater += weekWaterData[d];
    });
    return { totalReps, totalExercises, totalWater, activeDays };
  }, [weekDates, weekData, weekWaterData]);

  // Month dates
  const monthDates = useMemo(() => {
    const dates = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const now = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(selectedYear, selectedMonth, i);
      if (d <= now) dates.push(getDateStr(d));
    }
    return dates;
  }, [selectedMonth, selectedYear]);

  // Month totals
  const monthTotals = useMemo(() => {
    let totalReps = 0, totalExercises = 0, totalCal = 0, totalWater = 0, activeDays = 0;
    monthDates.forEach(d => {
      if (monthData[d]) {
        totalReps += monthData[d].totalReps || 0;
        totalExercises += monthData[d].exercises || 0;
        activeDays++;
      }
      if (monthDietData[d]) totalCal += monthDietData[d].totalCal || 0;
      if (monthWaterData[d]) totalWater += monthWaterData[d];
    });
    return { totalReps, totalExercises, totalCal, totalWater, activeDays };
  }, [monthDates, monthData, monthDietData, monthWaterData]);

  // Week chart data
  const weekChartData = useMemo(() => ({
    labels: weekDates.map(d => {
      const dt = new Date(d + 'T00:00:00');
      return DAY_NAMES[dt.getDay()];
    }),
    datasets: [{
      label: 'Reps',
      data: weekDates.map(d => weekData[d]?.totalReps || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderRadius: 6,
      borderSkipped: false,
    }, {
      label: 'Water (glasses)',
      data: weekDates.map(d => weekWaterData[d] || 0),
      backgroundColor: 'rgba(6, 182, 212, 0.7)',
      borderRadius: 6,
      borderSkipped: false,
    }]
  }), [weekDates, weekData, weekWaterData]);

  // Month chart data - reps
  const monthRepChartData = useMemo(() => {
    const days = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(selectedYear, selectedMonth, i);
      if (d <= new Date()) days.push(getDateStr(d));
    }
    return {
      labels: days.map(d => new Date(d + 'T00:00:00').getDate().toString()),
      datasets: [{
        label: 'Reps',
        data: days.map(d => monthData[d]?.totalReps || 0),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#6366f1'
      }]
    };
  }, [selectedMonth, selectedYear, monthData]);

  // Month weight chart
  const monthWeightChartData = useMemo(() => {
    const days = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(selectedYear, selectedMonth, i);
      if (d <= new Date()) days.push(getDateStr(d));
    }
    const weightData = days.map(d => monthWeightData[d] || null);
    const hasWeight = weightData.some(w => w !== null);
    if (!hasWeight) return null;
    return {
      labels: days.map(d => new Date(d + 'T00:00:00').getDate().toString()),
      datasets: [{
        label: 'Weight (kg)',
        data: weightData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#f59e0b',
        spanGaps: true
      }]
    };
  }, [selectedMonth, selectedYear, monthWeightData]);

  const handleDayClick = async (dateStr) => {
    setSelectedDayDetail(dateStr);
    setLoadingDay(true);
    const data = await getDataForDate(dateStr);
    setDayDetailData(data);
    setLoadingDay(false);
  };

  const changeWeek = (delta) => {
    const d = new Date(selectedWeekStart);
    d.setDate(d.getDate() + (delta * 7));
    setSelectedWeekStart(d);
  };

  const changeMonth = (delta) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-chart-bar"></i> Reports</h2>

      <div className="report-tabs">
        <button className={`report-tab ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
          <i className="fas fa-calendar-week"></i> Weekly
        </button>
        <button className={`report-tab ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>
          <i className="fas fa-calendar"></i> Monthly
        </button>
      </div>

      {view === 'week' && (
        <>
          <div className="date-picker">
            <button className="btn btn-sm" onClick={() => changeWeek(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="history-date-label">
              {new Date(weekDates[0] + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {' - '}
              {new Date(weekDates[6] + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button className="btn btn-sm" onClick={() => changeWeek(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="report-summary-grid">
            <div className="report-stat-card">
              <i className="fas fa-fire" style={{ color: '#f43f5e' }}></i>
              <span className="report-stat-value">{weekTotals.totalReps}</span>
              <span className="report-stat-label">Total Reps</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-dumbbell" style={{ color: '#6366f1' }}></i>
              <span className="report-stat-value">{weekTotals.totalExercises}</span>
              <span className="report-stat-label">Exercises</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-tint" style={{ color: '#06b6d4' }}></i>
              <span className="report-stat-value">{weekTotals.totalWater}</span>
              <span className="report-stat-label">Glasses</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              <span className="report-stat-value">{weekTotals.activeDays}/7</span>
              <span className="report-stat-label">Active Days</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3><i className="fas fa-chart-bar"></i> Daily Breakdown</h3>
            <Bar data={weekChartData} options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
              }
            }} />
          </div>

          <div className="today-list">
            <h3><i className="fas fa-list"></i> Day by Day</h3>
            <div className="day-list">
              {weekDates.map((d, i) => {
                const wd = weekData[d] || {};
                const ww = weekWaterData[d] || 0;
                const dt = new Date(d + 'T00:00:00');
                const isToday = d === getDateStr(new Date());
                return (
                  <div key={d} className={`day-item ${isToday ? 'today' : ''}`} onClick={() => handleDayClick(d)}>
                    <div className="day-info">
                      <span className="day-name">{DAY_FULL[dt.getDay()]}</span>
                      <span className="day-date">{dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="day-stats">
                      <span className="day-stat"><i className="fas fa-dumbbell"></i> {wd.exercises || 0}</span>
                      <span className="day-stat"><i className="fas fa-fire"></i> {wd.totalReps || 0}</span>
                      <span className="day-stat"><i className="fas fa-tint"></i> {ww}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {view === 'month' && (
        <>
          <div className="date-picker">
            <button className="btn btn-sm" onClick={() => changeMonth(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="history-date-label">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <button className="btn btn-sm" onClick={() => changeMonth(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="report-summary-grid">
            <div className="report-stat-card">
              <i className="fas fa-fire" style={{ color: '#f43f5e' }}></i>
              <span className="report-stat-value">{monthTotals.totalReps}</span>
              <span className="report-stat-label">Total Reps</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-dumbbell" style={{ color: '#6366f1' }}></i>
              <span className="report-stat-value">{monthTotals.totalExercises}</span>
              <span className="report-stat-label">Exercises</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-fire-alt" style={{ color: '#f43f5e' }}></i>
              <span className="report-stat-value">{monthTotals.totalCal}</span>
              <span className="report-stat-label">Calories</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-tint" style={{ color: '#06b6d4' }}></i>
              <span className="report-stat-value">{monthTotals.totalWater}</span>
              <span className="report-stat-label">Glasses</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
              <span className="report-stat-value">{monthTotals.activeDays}</span>
              <span className="report-stat-label">Active Days</span>
            </div>
            <div className="report-stat-card">
              <i className="fas fa-chart-line" style={{ color: '#f59e0b' }}></i>
              <span className="report-stat-value">{monthTotals.activeDays > 0 ? Math.round(monthTotals.totalReps / monthTotals.activeDays) : 0}</span>
              <span className="report-stat-label">Avg Reps/Day</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3><i className="fas fa-chart-line"></i> Rep Trend</h3>
            <Line data={monthRepChartData} options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
              }
            }} />
          </div>

          {monthWeightChartData && (
            <div className="dashboard-card">
              <h3><i className="fas fa-weight"></i> Weight Trend</h3>
              <Line data={monthWeightChartData} options={{
                responsive: true,
                plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
                  y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
                }
              }} />
            </div>
          )}

          <div className="today-list">
            <h3><i className="fas fa-list"></i> Daily Summary</h3>
            <div className="day-list">
              {monthDates.map(d => {
                const md = monthData[d] || {};
                const dd = monthDietData[d] || {};
                const ww = monthWaterData[d] || 0;
                const wt = monthWeightData[d];
                const dt = new Date(d + 'T00:00:00');
                const isToday = d === getDateStr(new Date());
                return (
                  <div key={d} className={`day-item ${isToday ? 'today' : ''}`} onClick={() => handleDayClick(d)}>
                    <div className="day-info">
                      <span className="day-name">{DAY_NAMES[dt.getDay()]}</span>
                      <span className="day-date">{dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="day-stats">
                      <span className="day-stat"><i className="fas fa-dumbbell"></i> {md.exercises || 0}</span>
                      <span className="day-stat"><i className="fas fa-fire"></i> {dd.totalCal || 0} cal</span>
                      <span className="day-stat"><i className="fas fa-tint"></i> {ww}</span>
                      {wt && <span className="day-stat"><i className="fas fa-weight"></i> {wt}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Day Detail Modal */}
      {selectedDayDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDayDetail(null)}>
          <div className="modal-content day-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="day-detail-header">
              <h3>{new Date(selectedDayDetail + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
              <button className="btn-icon" onClick={() => setSelectedDayDetail(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {loadingDay ? (
              <div className="loader-container"><div className="loader"></div></div>
            ) : dayDetailData ? (
              <div className="day-detail-content">
                <div className="detail-section">
                  <h4><i className="fas fa-dumbbell"></i> Workout ({dayDetailData.workouts.length})</h4>
                  {dayDetailData.workouts.length === 0 ? (
                    <p className="empty-state">No workout</p>
                  ) : (
                    dayDetailData.workouts.map(w => (
                      <div key={w.id} className="detail-item">
                        <span>{w.name}</span>
                        <span>{w.sets}x{w.reps} @ {w.weight}kg</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="detail-section">
                  <h4><i className="fas fa-utensils"></i> Diet ({dayDetailData.diet.length})</h4>
                  {dayDetailData.diet.length === 0 ? (
                    <p className="empty-state">No diet</p>
                  ) : (
                    dayDetailData.diet.map(d => (
                      <div key={d.id} className="detail-item">
                        <span>{d.foodName} ({d.mealType})</span>
                        <span>{d.calories} cal</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="detail-section">
                  <h4><i className="fas fa-tint"></i> Water: {dayDetailData.water} glasses</h4>
                  <div className="history-water-bar">
                    <div className="hwb-fill" style={{ width: `${Math.min((dayDetailData.water / (goals.waterGoal || 8)) * 100, 100)}%` }}></div>
                  </div>
                </div>
                {dayDetailData.weight && (
                  <div className="detail-section">
                    <h4><i className="fas fa-weight"></i> Weight: {dayDetailData.weight} kg</h4>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
