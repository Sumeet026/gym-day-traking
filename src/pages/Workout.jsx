import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import DeleteModal from '../components/DeleteModal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const EXERCISES = {
  'Chest': ['Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Fly', 'Cable Crossover', 'Push Ups', 'Chest Dip'],
  'Back': ['Deadlift', 'Pull Ups', 'Barbell Row', 'Lat Pulldown', 'Seated Row', 'T-Bar Row', 'Back Extension'],
  'Shoulders': ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Reverse Fly', 'Shrugs', 'Arnold Press'],
  'Arms': ['Bicep Curl', 'Hammer Curl', 'Tricep Pushdown', 'Skull Crushers', 'Preacher Curl', 'Concentration Curl'],
  'Legs': ['Squat', 'Leg Press', 'Lunges', 'Leg Extension', 'Leg Curl', 'Calf Raise', 'Bulgarian Split Squat'],
  'Abs': ['Crunches', 'Plank', 'Leg Raise', 'Russian Twist', 'Hanging Leg Raise', 'Ab Wheel Rollout'],
  'Cardio': ['Running', 'Cycling', 'Jump Rope', 'Swimming', 'Rowing', 'Stair Climber']
};

const ALL_EXERCISES = Object.values(EXERCISES).flat();

export default function Workout({ todayData, weekData, addWorkout, deleteWorkout, onToast }) {
  const [mode, setMode] = useState('quick');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = ALL_EXERCISES.filter(ex =>
    ex.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!exerciseName || !sets || !reps) {
      onToast('Please fill exercise name, sets and reps!', 'error');
      return;
    }
    try {
      await addWorkout({
        name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight) || 0,
        notes
      });
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      setNotes('');
      setSearchTerm('');
      onToast(`${exerciseName} added!`);
    } catch (e) {
      onToast('Failed to add exercise.', 'error');
    }
  };

  const quickAdd = async (name) => {
    setExerciseName(name);
    setMode('full');
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteWorkout(deleteId);
        setDeleteId(null);
        onToast('Exercise deleted!');
      } catch (e) {
        onToast('Failed to delete.', 'error');
      }
    }
  };

  const chartData = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return {
      labels: dates.map(d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' })),
      datasets: [{
        label: 'Total Reps',
        data: dates.map(d => weekData[d]?.totalReps || 0),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1'
      }]
    };
  }, [weekData]);

  const todayTotalReps = todayData.workouts.reduce((sum, w) => sum + ((w.sets || 0) * (w.reps || 0)), 0);
  const todayTotalVolume = todayData.workouts.reduce((sum, w) => sum + ((w.sets || 0) * (w.reps || 0) * (w.weight || 0)), 0);

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-dumbbell"></i> Workout Tracker</h2>

      <div className="workout-stats-row">
        <div className="workout-mini-stat">
          <span className="wms-value">{todayData.workouts.length}</span>
          <span className="wms-label">Exercises</span>
        </div>
        <div className="workout-mini-stat">
          <span className="wms-value">{todayTotalReps}</span>
          <span className="wms-label">Total Reps</span>
        </div>
        <div className="workout-mini-stat">
          <span className="wms-value">{todayTotalVolume}kg</span>
          <span className="wms-label">Volume</span>
        </div>
      </div>

      <div className="mode-toggle">
        <button className={`mode-btn ${mode === 'quick' ? 'active' : ''}`} onClick={() => setMode('quick')}>
          <i className="fas fa-bolt"></i> Quick Add
        </button>
        <button className={`mode-btn ${mode === 'full' ? 'active' : ''}`} onClick={() => setMode('full')}>
          <i className="fas fa-plus-circle"></i> Full Form
        </button>
      </div>

      {mode === 'quick' ? (
        <div className="add-form-card">
          <h3><i className="fas fa-bolt"></i> Quick Add Exercise</h3>
          <div className="form-group">
            <label>Search Exercise</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
            />
          </div>
          <div className="quick-exercise-grid">
            {(searchTerm ? filteredExercises : ALL_EXERCISES).slice(0, 20).map(ex => (
              <button key={ex} className="quick-exercise-btn" onClick={() => quickAdd(ex)}>
                {ex}
              </button>
            ))}
          </div>
          {searchTerm && filteredExercises.length === 0 && (
            <p className="empty-state">No exercise found. Try a different name.</p>
          )}
        </div>
      ) : (
        <div className="add-form-card">
          <h3><i className="fas fa-plus-circle"></i> Add Exercise</h3>
          <div className="form-group">
            <label>Exercise Name</label>
            {exerciseName ? (
              <div className="selected-exercise">
                <span>{exerciseName}</span>
                <button className="btn-icon" onClick={() => setExerciseName('')}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <select value={exerciseName} onChange={e => setExerciseName(e.target.value)}>
                <option value="">-- Select Exercise --</option>
                {Object.entries(EXERCISES).map(([cat, items]) => (
                  <optgroup key={cat} label={cat}>
                    {items.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sets</label>
              <input type="number" value={sets} onChange={e => setSets(e.target.value)} placeholder="3" min="1" max="20" />
            </div>
            <div className="form-group">
              <label>Reps</label>
              <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="12" min="1" max="100" />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="20" min="0" step="0.5" />
            </div>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. PR! Felt strong" />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleSubmit}>
            <i className="fas fa-plus"></i> Add Exercise
          </button>
        </div>
      )}

      <div className="today-list">
        <h3><i className="fas fa-list"></i> Today's Exercises ({todayData.workouts.length})</h3>
        <div className="exercise-list">
          {todayData.workouts.length === 0 ? (
            <p className="empty-state">No exercises added yet</p>
          ) : (
            todayData.workouts.map(w => (
              <div key={w.id} className="exercise-item">
                <div className="exercise-info">
                  <span className="exercise-name">{w.name}</span>
                  <span className="exercise-detail">{w.sets} sets x {w.reps} reps @ {w.weight}kg</span>
                  {w.notes && <span className="exercise-notes">{w.notes}</span>}
                </div>
                <div className="exercise-actions">
                  <span className="exercise-total">{w.sets * w.reps} reps | {w.sets * w.reps * w.weight}kg</span>
                  <button className="btn-icon delete" onClick={() => setDeleteId(w.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-chart-line"></i> Rep Progress (Last 7 days)</h3>
        <Line data={chartData} options={{
          responsive: true,
          plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
          }
        }} />
      </div>

      <DeleteModal show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
