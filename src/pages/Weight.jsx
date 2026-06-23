import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import DeleteModal from '../components/DeleteModal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Weight({ todayData, allWeights, addWeight, deleteWeight, onToast, goals }) {
  const [newWeight, setNewWeight] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const currentWeight = todayData.weight;

  const weightChange = useMemo(() => {
    if (allWeights.length < 2) return null;
    const latest = allWeights[0].weight;
    const prev = allWeights[1].weight;
    return (latest - prev).toFixed(1);
  }, [allWeights]);

  const handleSubmit = async () => {
    if (!newWeight || parseFloat(newWeight) < 20 || parseFloat(newWeight) > 300) {
      onToast('Enter valid weight (20-300 kg)!', 'error');
      return;
    }
    try {
      await addWeight(parseFloat(newWeight));
      setNewWeight('');
      onToast(`Weight ${newWeight}kg saved!`);
    } catch (e) {
      onToast('Failed to save weight.', 'error');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteWeight(deleteId);
        setDeleteId(null);
        onToast('Weight entry deleted!');
      } catch (e) {
        onToast('Failed to delete.', 'error');
      }
    }
  };

  const chartData = useMemo(() => {
    const recent = [...allWeights].reverse().slice(-30);
    return {
      labels: recent.map(w => new Date(w.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
      datasets: [{
        label: 'Weight (kg)',
        data: recent.map(w => w.weight),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#f59e0b'
      }]
    };
  }, [allWeights]);

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-weight"></i> Weight Tracker</h2>

      <div className="weight-display">
        <div className="weight-circle">
          <span className="weight-value">{currentWeight || '--'}</span>
          <span className="weight-unit">kg</span>
        </div>
        {goals?.weightGoal && currentWeight && (
          <div className="weight-goal-info">
            Target: {goals.weightGoal}kg | 
            {currentWeight > goals.weightGoal 
              ? ` ${(currentWeight - goals.weightGoal).toFixed(1)}kg to go`
              : currentWeight < goals.weightGoal
              ? ` ${(goals.weightGoal - currentWeight).toFixed(1)}kg to gain`
              : ' Goal reached!'
            }
          </div>
        )}
        {weightChange !== null && (
          <div className={`weight-change ${parseFloat(weightChange) > 0 ? 'up' : parseFloat(weightChange) < 0 ? 'down' : ''}`}>
            <i className={`fas ${parseFloat(weightChange) > 0 ? 'fa-arrow-up' : parseFloat(weightChange) < 0 ? 'fa-arrow-down' : 'fa-minus'}`}></i>
            <span>{Math.abs(weightChange)} kg</span>
            <small>vs previous</small>
          </div>
        )}
      </div>

      <div className="add-form-card">
        <h3>Log Weight</h3>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Weight (kg)</label>
            <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="75.5" step="0.1" min="20" max="300" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>&nbsp;</label>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <i className="fas fa-check"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-chart-line"></i> Weight Trend</h3>
        {allWeights.length > 0 ? (
          <Line data={chartData} options={{
            responsive: true,
            plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } },
            scales: {
              x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { color: 'rgba(148,163,184,0.1)' } },
              y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } }
            }
          }} />
        ) : (
          <p className="empty-state">Add weight first to see the chart</p>
        )}
      </div>

      <div className="today-list">
        <h3><i className="fas fa-history"></i> Weight History</h3>
        <div className="weight-list">
          {allWeights.length === 0 ? (
            <p className="empty-state">No weight entries yet</p>
          ) : (
            allWeights.map(w => (
              <div key={w.id} className="weight-item">
                <div className="weight-item-info">
                  <span className="weight-item-value">{w.weight} kg</span>
                  <span className="weight-item-date">{new Date(w.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <button className="btn-icon delete" onClick={() => setDeleteId(w.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <DeleteModal show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
