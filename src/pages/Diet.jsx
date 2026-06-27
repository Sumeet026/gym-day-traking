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
    { id: 'chicken-thigh', name: 'Chicken Thigh (1 pc)', cal: 210, protein: 26, carbs: 0, fat: 11 },
    { id: 'mutton', name: 'Mutton (150g)', cal: 290, protein: 28, carbs: 0, fat: 20 },
    { id: 'prawns', name: 'Prawns (150g)', cal: 150, protein: 30, carbs: 1, fat: 2 },
    { id: 'tofu', name: 'Tofu (100g)', cal: 76, protein: 8, carbs: 2, fat: 4 },
    { id: 'whey-protein', name: 'Whey Protein (1 scoop)', cal: 120, protein: 24, carbs: 3, fat: 1 },
  ],
  'Carbs': [
    { id: 'rice', name: 'Rice (1 plate)', cal: 206, protein: 4, carbs: 45, fat: 0 },
    { id: 'roti', name: 'Roti (1)', cal: 104, protein: 3, carbs: 18, fat: 2 },
    { id: 'oatmeal', name: 'Oatmeal (1 bowl)', cal: 154, protein: 5, carbs: 27, fat: 3 },
    { id: 'banana', name: 'Banana (1)', cal: 105, protein: 1, carbs: 27, fat: 0 },
    { id: 'sweet-potato', name: 'Sweet Potato (1)', cal: 103, protein: 2, carbs: 24, fat: 0 },
    { id: 'bread', name: 'Bread (2 slice)', cal: 79, protein: 3, carbs: 15, fat: 1 },
    { id: 'pasta', name: 'Pasta (1 plate cooked)', cal: 220, protein: 8, carbs: 43, fat: 1 },
    { id: 'noodles', name: 'Noodles (1 plate)', cal: 250, protein: 6, carbs: 45, fat: 5 },
    { id: 'idli', name: 'Idli (2 pcs)', cal: 140, protein: 4, carbs: 30, fat: 1 },
    { id: 'upma', name: 'Upma (1 bowl)', cal: 180, protein: 4, carbs: 32, fat: 4 },
    { id: 'poha', name: 'Poha (1 bowl)', cal: 170, protein: 4, carbs: 30, fat: 3 },
    { id: 'dosa', name: 'Plain Dosa (1)', cal: 120, protein: 2, carbs: 18, fat: 4 },
    { id: 'uttapam', name: 'Uttapam (1)', cal: 150, protein: 4, carbs: 25, fat: 4 },
    { id: 'cheela', name: 'Moong Dal Cheela (1)', cal: 130, protein: 8, carbs: 15, fat: 3 },
  ],
  'Fruits & Veggies': [
    { id: 'apple', name: 'Apple (1)', cal: 95, protein: 0, carbs: 25, fat: 0 },
    { id: 'orange', name: 'Orange (1)', cal: 62, protein: 1, carbs: 15, fat: 0 },
    { id: 'broccoli', name: 'Broccoli (1 cup)', cal: 55, protein: 4, carbs: 11, fat: 1 },
    { id: 'spinach', name: 'Spinach (1 cup)', cal: 23, protein: 3, carbs: 4, fat: 0 },
    { id: 'mango', name: 'Mango (1)', cal: 200, protein: 2, carbs: 50, fat: 1 },
    { id: 'papaya', name: 'Papaya (1 cup)', cal: 62, protein: 1, carbs: 16, fat: 0 },
    { id: 'watermelon', name: 'Watermelon (1 slice)', cal: 86, protein: 2, carbs: 22, fat: 0 },
    { id: 'guava', name: 'Guava (1)', cal: 37, protein: 1, carbs: 9, fat: 0 },
    { id: 'carrot', name: 'Carrot (1 medium)', cal: 25, protein: 1, carbs: 6, fat: 0 },
    { id: 'cucumber', name: 'Cucumber (1)', cal: 16, protein: 1, carbs: 4, fat: 0 },
    { id: 'tomato', name: 'Tomato (1 medium)', cal: 22, protein: 1, carbs: 5, fat: 0 },
    { id: 'beetroot', name: 'Beetroot (1 medium)', cal: 43, protein: 2, carbs: 10, fat: 0 },
    { id: 'green-peas', name: 'Green Peas (1 cup)', cal: 134, protein: 8, carbs: 25, fat: 1 },
    { id: 'corn', name: 'Sweet Corn (1 cup)', cal: 143, protein: 5, carbs: 31, fat: 2 },
  ],
  'Indian Food': [
    { id: 'dal', name: 'Dal (1 bowl)', cal: 216, protein: 12, carbs: 35, fat: 3 },
    { id: 'rajma', name: 'Rajma (1 bowl)', cal: 250, protein: 15, carbs: 40, fat: 4 },
    { id: 'chole', name: 'Chole (1 bowl)', cal: 270, protein: 14, carbs: 38, fat: 6 },
    { id: 'biryani', name: 'Biryani (1 plate)', cal: 350, protein: 12, carbs: 50, fat: 12 },
    { id: 'paratha', name: 'Paratha (1)', cal: 250, protein: 4, carbs: 30, fat: 12 },
    { id: 'samosa', name: 'Samosa (1)', cal: 260, protein: 4, carbs: 30, fat: 14 },
    { id: 'aloo-gobi', name: 'Aloo Gobi (1 bowl)', cal: 180, protein: 4, carbs: 25, fat: 8 },
    { id: 'palak-paneer', name: 'Palak Paneer (1 bowl)', cal: 280, protein: 14, carbs: 10, fat: 20 },
    { id: 'butter-chicken', name: 'Butter Chicken (1 bowl)', cal: 350, protein: 25, carbs: 10, fat: 24 },
    { id: 'dal-makhani', name: 'Dal Makhani (1 bowl)', cal: 300, protein: 14, carbs: 35, fat: 12 },
    { id: 'paneer-bhurji', name: 'Paneer Bhurji (1 bowl)', cal: 270, protein: 18, carbs: 8, fat: 19 },
    { id: 'chana-masala', name: 'Chana Masala (1 bowl)', cal: 240, protein: 12, carbs: 35, fat: 6 },
    { id: 'egg-curry', name: 'Egg Curry (1 bowl)', cal: 220, protein: 14, carbs: 8, fat: 15 },
    { id: 'vegetable-curry', name: 'Mixed Veg Curry (1 bowl)', cal: 150, protein: 4, carbs: 18, fat: 8 },
    { id: 'khichdi', name: 'Khichdi (1 bowl)', cal: 200, protein: 8, carbs: 35, fat: 3 },
    { id: 'sprouts', name: 'Sprouts Salad (1 bowl)', cal: 120, protein: 8, carbs: 18, fat: 1 },
    { id: 'thali', name: 'Thali (1 full)', cal: 600, protein: 20, carbs: 80, fat: 20 },
    { id: 'chole-bhature', name: 'Chole Bhature (1 plate)', cal: 450, protein: 12, carbs: 55, fat: 22 },
    { id: 'pav-bhaji', name: 'Pav Bhaji (1 plate)', cal: 380, protein: 10, carbs: 50, fat: 16 },
  ],
  'Dairy & Others': [
    { id: 'protein-shake', name: 'Protein Shake', cal: 120, protein: 24, carbs: 3, fat: 1 },
    { id: 'peanut-butter', name: 'Peanut Butter (2 tbsp)', cal: 188, protein: 8, carbs: 6, fat: 16 },
    { id: 'almonds', name: 'Almonds (30g)', cal: 164, protein: 6, carbs: 6, fat: 14 },
    { id: 'milk', name: 'Milk (1 glass)', cal: 149, protein: 8, carbs: 12, fat: 8 },
    { id: 'ghee', name: 'Ghee (1 tbsp)', cal: 120, protein: 0, carbs: 0, fat: 14 },
    { id: 'chai', name: 'Chai (1 cup)', cal: 12, protein: 0, carbs: 2, fat: 0 },
    { id: 'coffee', name: 'Black Coffee', cal: 5, protein: 0, carbs: 0, fat: 0 },
    { id: 'curd', name: 'Curd/Yogurt (1 bowl)', cal: 98, protein: 6, carbs: 12, fat: 2 },
    { id: 'lassi', name: 'Lassi (1 glass)', cal: 150, protein: 6, carbs: 22, fat: 4 },
    { id: 'buttermilk', name: 'Buttermilk (1 glass)', cal: 40, protein: 3, carbs: 4, fat: 1 },
    { id: 'walnuts', name: 'Walnuts (30g)', cal: 196, protein: 5, carbs: 4, fat: 20 },
    { id: 'cashews', name: 'Cashews (30g)', cal: 163, protein: 5, carbs: 9, fat: 13 },
    { id: 'chia-seeds', name: 'Chia Seeds (2 tbsp)', cal: 138, protein: 5, carbs: 12, fat: 9 },
    { id: 'honey', name: 'Honey (1 tbsp)', cal: 64, protein: 0, carbs: 17, fat: 0 },
    { id: 'sugar', name: 'Sugar (1 tsp)', cal: 16, protein: 0, carbs: 4, fat: 0 },
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
  const [quantity, setQuantity] = useState(1);
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
    const qty = parseFloat(quantity) || 1;
    if (selectedFood) {
      const parts = selectedFood.split('|');
      try {
        await addDiet({
          mealType,
          foodId: parts[0],
          foodName: parts[1],
          quantity: qty,
          calories: Math.round(parseInt(parts[2]) * qty),
          protein: Math.round((parseInt(parts[3]) || 0) * qty),
          carbs: Math.round((parseInt(parts[4]) || 0) * qty),
          fat: Math.round((parseInt(parts[5]) || 0) * qty)
        });
        setSelectedFood('');
        setQuantity(1);
        onToast(`${parts[1]} x${qty} added!`);
      } catch (e) {
        onToast('Failed to add meal.', 'error');
      }
    } else if (customName && customCal) {
      try {
        await addDiet({
          mealType,
          foodId: 'custom',
          foodName: customName,
          quantity: 1,
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
        {selectedFood && (
          <div className="form-group">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button className="qty-btn" type="button" onClick={() => setQuantity(Math.max(0.25, parseFloat(quantity) - 0.25))}>
                <i className="fas fa-minus"></i>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                min="0.25"
                step="0.25"
                className="qty-input"
              />
              <button className="qty-btn" type="button" onClick={() => setQuantity(parseFloat(quantity) + 0.25)}>
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="qty-presets">
              {[0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5].map(q => (
                <button
                  key={q}
                  type="button"
                  className={`qty-preset-btn ${parseFloat(quantity) === q ? 'active' : ''}`}
                  onClick={() => setQuantity(q)}
                >
                  {q === 1 ? '1' : q}
                </button>
              ))}
            </div>
            {(() => {
              const parts = selectedFood.split('|');
              const qty = parseFloat(quantity) || 1;
              const totalCal = Math.round(parseInt(parts[2]) * qty);
              const totalProt = Math.round((parseInt(parts[3]) || 0) * qty);
              const totalCarb = Math.round((parseInt(parts[4]) || 0) * qty);
              const totalF = Math.round((parseInt(parts[5]) || 0) * qty);
              return (
                <div className="qty-preview">
                  <span>{totalCal} cal</span>
                  <span>P:{totalProt}g</span>
                  <span>C:{totalCarb}g</span>
                  <span>F:{totalF}g</span>
                </div>
              );
            })()}
          </div>
        )}
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
                  <span className="diet-name">{d.foodName}{d.quantity && d.quantity !== 1 ? ` x${d.quantity}` : ''}</span>
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
