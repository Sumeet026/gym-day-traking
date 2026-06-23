import { useState, useMemo } from 'react';
import DeleteModal from '../components/DeleteModal';

const FOODS = {
  'Protein': [
    { id: 'chicken-breast', name: 'Chicken Breast (200g)', cal: 231, protein: 43, carbs: 0, fat: 5 },
    { id: 'eggs', name: 'Eggs (3 whole)', cal: 155, protein: 13, carbs: 1, fat: 11 },
    { id: 'egg-whites', name: 'Egg Whites (4)', cal: 51, protein: 11, carbs: 1, fat: 0 },
    { id: 'paneer', name: 'Paneer (100g)', cal: 265, protein: 18, carbs: 4, fat: 20 },
    { id: 'fish', name: 'Fish (150g)', cal: 206, protein: 31, carbs: 0, fat: 8 },
    { id: 'tuna-can', name: 'Tuna Can (1)', cal: 128, protein: 27, carbs: 0, fat: 1 },
    { id: 'soya-chunks', name: 'Soya Chunks (100g)', cal: 340, protein: 52, carbs: 33, fat: 1 },
  ],
  'Carbs': [
    { id: 'rice', name: 'Rice (1 plate)', cal: 206, protein: 4, carbs: 45, fat: 0 },
    { id: 'roti', name: 'Roti (1)', cal: 104, protein: 3, carbs: 18, fat: 2 },
    { id: 'oatmeal', name: 'Oatmeal (1 bowl)', cal: 154, protein: 5, carbs: 27, fat: 3 },
    { id: 'banana', name: 'Banana (1)', cal: 105, protein: 1, carbs: 27, fat: 0 },
    { id: 'sweet-potato', name: 'Sweet Potato (1)', cal: 103, protein: 2, carbs: 24, fat: 0 },
    { id: 'bread', name: 'Bread (2 slice)', cal: 79, protein: 3, carbs: 15, fat: 1 },
  ],
  'Fruits & Veggies': [
    { id: 'apple', name: 'Apple (1)', cal: 95, protein: 0, carbs: 25, fat: 0 },
    { id: 'orange', name: 'Orange (1)', cal: 62, protein: 1, carbs: 15, fat: 0 },
    { id: 'broccoli', name: 'Broccoli (1 cup)', cal: 55, protein: 4, carbs: 11, fat: 1 },
    { id: 'spinach', name: 'Spinach (1 cup)', cal: 23, protein: 3, carbs: 4, fat: 0 },
  ],
  'Indian Food': [
    { id: 'dal', name: 'Dal (1 bowl)', cal: 216, protein: 12, carbs: 35, fat: 3 },
    { id: 'rajma', name: 'Rajma (1 bowl)', cal: 250, protein: 15, carbs: 40, fat: 4 },
    { id: 'chole', name: 'Chole (1 bowl)', cal: 270, protein: 14, carbs: 38, fat: 6 },
    { id: 'biryani', name: 'Biryani (1 plate)', cal: 350, protein: 12, carbs: 50, fat: 12 },
    { id: 'paratha', name: 'Paratha (1)', cal: 250, protein: 4, carbs: 30, fat: 12 },
    { id: 'dosa', name: 'Dosa (1)', cal: 120, protein: 2, carbs: 18, fat: 4 },
    { id: 'samosa', name: 'Samosa (1)', cal: 260, protein: 4, carbs: 30, fat: 14 },
  ],
  'Dairy & Others': [
    { id: 'protein-shake', name: 'Protein Shake', cal: 120, protein: 24, carbs: 3, fat: 1 },
    { id: 'peanut-butter', name: 'Peanut Butter (2 tbsp)', cal: 188, protein: 8, carbs: 6, fat: 16 },
    { id: 'almonds', name: 'Almonds (30g)', cal: 164, protein: 6, carbs: 6, fat: 14 },
    { id: 'milk', name: 'Milk (1 glass)', cal: 149, protein: 8, carbs: 12, fat: 8 },
    { id: 'ghee', name: 'Ghee (1 tbsp)', cal: 120, protein: 0, carbs: 0, fat: 14 },
    { id: 'chai', name: 'Chai (1 cup)', cal: 12, protein: 0, carbs: 2, fat: 0 },
    { id: 'coffee', name: 'Black Coffee', cal: 5, protein: 0, carbs: 0, fat: 0 },
  ]
};

const MEAL_ICONS = {
  breakfast: '\u{1F305}',
  lunch: '\u{2600}\u{FE0F}',
  snack: '\u{1F37F}',
  dinner: '\u{1F319}',
  'pre-workout': '\u{1F4AA}',
  'post-workout': '\u{1F964}'
};

export default function Diet({ todayData, addDiet, deleteDietEntry, onToast, goals }) {
  const [mealType, setMealType] = useState('breakfast');
  const [selectedFood, setSelectedFood] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const caloriesGoal = goals.caloriesGoal || 2000;
  const proteinGoal = goals.proteinGoal || 150;

  const totalCalories = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.calories || 0), 0),
    [todayData.diet]
  );

  const totalProtein = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.protein || 0), 0),
    [todayData.diet]
  );

  const totalCarbs = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.carbs || 0), 0),
    [todayData.diet]
  );

  const totalFat = useMemo(() =>
    todayData.diet.reduce((sum, m) => sum + (m.fat || 0), 0),
    [todayData.diet]
  );

  const handleSubmit = async () => {
    if (selectedFood) {
      const parts = selectedFood.split('|');
      try {
        await addDiet({
          mealType,
          foodId: parts[0],
          foodName: parts[1],
          calories: parseInt(parts[2]),
          protein: parseInt(parts[3]) || 0,
          carbs: parseInt(parts[4]) || 0,
          fat: parseInt(parts[5]) || 0
        });
        setSelectedFood('');
        onToast(`${parts[1]} added!`);
      } catch (e) {
        onToast('Failed to add meal.', 'error');
      }
    } else if (customName && customCal) {
      try {
        await addDiet({
          mealType,
          foodId: 'custom',
          foodName: customName,
          calories: parseInt(customCal),
          protein: parseInt(customProtein) || 0,
          carbs: parseInt(customCarbs) || 0,
          fat: parseInt(customFat) || 0
        });
        setCustomName('');
        setCustomCal('');
        setCustomProtein('');
        setCustomCarbs('');
        setCustomFat('');
        onToast(`${customName} added!`);
      } catch (e) {
        onToast('Failed to add meal.', 'error');
      }
    } else {
      onToast('Select a food or enter custom entry!', 'error');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteDietEntry(deleteId);
        setDeleteId(null);
        onToast('Meal deleted!');
      } catch (e) {
        onToast('Failed to delete.', 'error');
      }
    }
  };

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-utensils"></i> Diet Tracker</h2>

      <div className="calorie-counter">
        <div className="calorie-display">
          <span className="calorie-consumed">{totalCalories}</span>
          <span className="calorie-label">of {caloriesGoal} calories</span>
        </div>
        <div className="calorie-bar">
          <div className="calorie-fill" style={{ width: `${Math.min((totalCalories / caloriesGoal) * 100, 100)}%` }}></div>
        </div>
        <span className="calorie-goal">Goal: {caloriesGoal} cal | Remaining: {Math.max(caloriesGoal - totalCalories, 0)} cal</span>
      </div>

      <div className="add-form-card">
        <h3>Add Meal</h3>
        <div className="form-group">
          <label>Meal Type</label>
          <select value={mealType} onChange={e => setMealType(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snack">Snack</option>
            <option value="dinner">Dinner</option>
            <option value="pre-workout">Pre-Workout</option>
            <option value="post-workout">Post-Workout</option>
          </select>
        </div>
        <div className="form-group">
          <label>Select Food</label>
          <select value={selectedFood} onChange={e => setSelectedFood(e.target.value)}>
            <option value="">-- Select Food --</option>
            {Object.entries(FOODS).map(([cat, items]) => (
              <optgroup key={cat} label={cat}>
                {items.map(f => (
                  <option key={f.id} value={`${f.id}|${f.name}|${f.cal}|${f.protein}|${f.carbs}|${f.fat}`}>
                    {f.name} - {f.cal} cal
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="form-divider"><span>OR</span></div>
        <div className="form-group">
          <label>Custom Food</label>
          <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Food name" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Calories</label>
            <input type="number" value={customCal} onChange={e => setCustomCal(e.target.value)} placeholder="200" />
          </div>
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" value={customProtein} onChange={e => setCustomProtein(e.target.value)} placeholder="20" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Carbs (g)</label>
            <input type="number" value={customCarbs} onChange={e => setCustomCarbs(e.target.value)} placeholder="30" />
          </div>
          <div className="form-group">
            <label>Fat (g)</label>
            <input type="number" value={customFat} onChange={e => setCustomFat(e.target.value)} placeholder="10" />
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit}>
          <i className="fas fa-plus"></i> Add Meal
        </button>
      </div>

      <div className="today-list">
        <h3><i className="fas fa-list"></i> Today's Diet ({todayData.diet.length})</h3>
        <div className="diet-list">
          {todayData.diet.length === 0 ? (
            <p className="empty-state">No meals added yet</p>
          ) : (
            todayData.diet.map(d => (
              <div key={d.id} className="diet-item">
                <span className="diet-icon">{MEAL_ICONS[d.mealType] || '\u{1F37D}\u{FE0F}'}</span>
                <div className="diet-info">
                  <span className="diet-name">{d.foodName}</span>
                  <span className="diet-detail">{d.mealType} - {d.calories} cal</span>
                </div>
                <div className="diet-actions">
                  <span className="diet-macros">P:{d.protein}g C:{d.carbs}g F:{d.fat}g</span>
                  <button className="btn-icon delete" onClick={() => setDeleteId(d.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-chart-pie"></i> Today's Macros</h3>
        <div className="macro-bars">
          <div className="macro-item">
            <span className="macro-label">Protein</span>
            <div className="macro-bar"><div className="macro-fill protein-fill" style={{ width: `${Math.min((totalProtein / proteinGoal) * 100, 100)}%` }}></div></div>
            <span className="macro-value">{totalProtein}/{proteinGoal}g</span>
          </div>
          <div className="macro-item">
            <span className="macro-label">Carbs</span>
            <div className="macro-bar"><div className="macro-fill carbs-fill" style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%` }}></div></div>
            <span className="macro-value">{totalCarbs}g</span>
          </div>
          <div className="macro-item">
            <span className="macro-label">Fats</span>
            <div className="macro-bar"><div className="macro-fill fats-fill" style={{ width: `${Math.min((totalFat / 65) * 100, 100)}%` }}></div></div>
            <span className="macro-value">{totalFat}g</span>
          </div>
        </div>
      </div>

      <DeleteModal show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
