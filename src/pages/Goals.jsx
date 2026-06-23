import { useState, useEffect } from 'react';

export default function Goals({ goals, saveGoals, onToast }) {
  const [caloriesGoal, setCaloriesGoal] = useState(goals.caloriesGoal);
  const [waterGoal, setWaterGoal] = useState(goals.waterGoal);
  const [proteinGoal, setProteinGoal] = useState(goals.proteinGoal);
  const [weightGoal, setWeightGoal] = useState(goals.weightGoal || '');

  useEffect(() => {
    setCaloriesGoal(goals.caloriesGoal);
    setWaterGoal(goals.waterGoal);
    setProteinGoal(goals.proteinGoal);
    setWeightGoal(goals.weightGoal || '');
  }, [goals]);

  const handleSave = async () => {
    try {
      await saveGoals({
        caloriesGoal: parseInt(caloriesGoal) || 2000,
        waterGoal: parseInt(waterGoal) || 8,
        proteinGoal: parseInt(proteinGoal) || 150,
        weightGoal: parseFloat(weightGoal) || null
      });
      onToast('Goals saved!');
    } catch (e) {
      onToast('Failed to save goals.', 'error');
    }
  };

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-bullseye"></i> My Goals</h2>

      <div className="goals-intro">
        <p>Set your daily goals to track your fitness progress.</p>
      </div>

      <div className="add-form-card">
        <h3><i className="fas fa-fire-alt"></i> Daily Calories Goal</h3>
        <div className="form-group">
          <label>Calories per day</label>
          <input
            type="number"
            value={caloriesGoal}
            onChange={e => setCaloriesGoal(e.target.value)}
            placeholder="2000"
            min="500"
            max="10000"
          />
        </div>
        <div className="goal-presets">
          <button className="preset-btn" onClick={() => setCaloriesGoal(1500)}>1500</button>
          <button className="preset-btn" onClick={() => setCaloriesGoal(2000)}>2000</button>
          <button className="preset-btn" onClick={() => setCaloriesGoal(2500)}>2500</button>
          <button className="preset-btn" onClick={() => setCaloriesGoal(3000)}>3000</button>
        </div>
      </div>

      <div className="add-form-card">
        <h3><i className="fas fa-tint"></i> Daily Water Goal</h3>
        <div className="form-group">
          <label>Glasses per day</label>
          <input
            type="number"
            value={waterGoal}
            onChange={e => setWaterGoal(e.target.value)}
            placeholder="8"
            min="1"
            max="30"
          />
        </div>
        <p className="goal-note">1 glass = 250ml. Recommended: 8-10 glasses.</p>
        <div className="goal-presets">
          <button className="preset-btn" onClick={() => setWaterGoal(6)}>6</button>
          <button className="preset-btn" onClick={() => setWaterGoal(8)}>8</button>
          <button className="preset-btn" onClick={() => setWaterGoal(10)}>10</button>
          <button className="preset-btn" onClick={() => setWaterGoal(12)}>12</button>
        </div>
      </div>

      <div className="add-form-card">
        <h3><i className="fas fa-drumstick-bite"></i> Daily Protein Goal</h3>
        <div className="form-group">
          <label>Protein (grams) per day</label>
          <input
            type="number"
            value={proteinGoal}
            onChange={e => setProteinGoal(e.target.value)}
            placeholder="150"
            min="20"
            max="500"
          />
        </div>
        <div className="goal-presets">
          <button className="preset-btn" onClick={() => setProteinGoal(100)}>100g</button>
          <button className="preset-btn" onClick={() => setProteinGoal(150)}>150g</button>
          <button className="preset-btn" onClick={() => setProteinGoal(200)}>200g</button>
        </div>
      </div>

      <div className="add-form-card">
        <h3><i className="fas fa-weight"></i> Target Weight</h3>
        <div className="form-group">
          <label>Target weight (kg) - optional</label>
          <input
            type="number"
            value={weightGoal}
            onChange={e => setWeightGoal(e.target.value)}
            placeholder="75"
            step="0.5"
            min="20"
            max="300"
          />
        </div>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleSave} style={{ marginTop: '1rem' }}>
        <i className="fas fa-save"></i> Save All Goals
      </button>
    </div>
  );
}
