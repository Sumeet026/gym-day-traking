import { useState, useMemo } from 'react';

const CHALLENGES = [
  { id: 1, text: 'Do 10 Push-ups!', icon: 'fa-person-running', reps: '10 reps' },
  { id: 2, text: 'Do 20 Squats!', icon: 'fa-person-walking', reps: '20 reps' },
  { id: 3, text: 'Hold 30 second Plank!', icon: 'fa-grip-lines', reps: '30 sec' },
  { id: 4, text: 'Do 15 Burpees!', icon: 'fa-bolt', reps: '15 reps' },
  { id: 5, text: 'Do 25 Jumping Jacks!', icon: 'fa-star', reps: '25 reps' },
  { id: 6, text: 'Do 10 Lunges each leg!', icon: 'fa-shoe-prints', reps: '10 each' },
  { id: 7, text: 'Do 20 Crunches!', icon: 'fa-dumbbell', reps: '20 reps' },
  { id: 8, text: 'Do 15 Mountain Climbers!', icon: 'fa-mountain', reps: '15 reps' },
  { id: 9, text: 'Do 10 Tricep Dips!', icon: 'fa-hand-fist', reps: '10 reps' },
  { id: 10, text: 'Do 20 High Knees!', icon: 'fa-arrow-up', reps: '20 reps' },
];

function getRandomChallenge() {
  const idx = Math.floor(Math.random() * CHALLENGES.length);
  return CHALLENGES[idx];
}

function getDateStr(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export default function Rules({ rules, dailyChecks, onSaveRule, onDeleteRule, onToggleCheck }) {
  const [newRule, setNewRule] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState(() => getRandomChallenge());
  const [challengeDone, setChallengeDone] = useState(false);
  const today = getDateStr();

  const todayChecks = useMemo(() => {
    const checks = {};
    dailyChecks
      .filter(c => c.date === today)
      .forEach(c => { checks[c.ruleId] = c.completed; });
    return checks;
  }, [dailyChecks, today]);

  const completedToday = Object.values(todayChecks).filter(Boolean).length;
  const totalRules = rules.length;
  const progressPercent = totalRules > 0 ? Math.round((completedToday / totalRules) * 100) : 0;
  const allDone = totalRules > 0 && completedToday === totalRules;
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 17;
  const showChallenge = totalRules > 0 && !allDone && isEvening && currentChallenge;

  const handleNewChallenge = () => {
    setCurrentChallenge(getRandomChallenge());
    setChallengeDone(false);
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      onSaveRule({ rule: newRule.trim(), createdAt: new Date().toISOString() });
      setNewRule('');
    }
  };

  const handleToggle = (ruleId) => {
    const isCompleted = todayChecks[ruleId] || false;
    onToggleCheck({
      ruleId,
      date: today,
      completed: !isCompleted
    });
  };

  return (
    <div className="section active">
      <h2 className="section-title"><i className="fas fa-clipboard-check"></i> Daily Rules</h2>

      <div className="rules-progress-card">
        <div className="rules-date">
          <i className="fas fa-calendar-day"></i>
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
        <div className="rules-progress-ring">
          <svg viewBox="0 0 36 36">
            <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path className="ring-fill rules-color"
              strokeDasharray={`${progressPercent}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <span className="ring-text">{progressPercent}%</span>
        </div>
        <p className="rules-progress-text">{completedToday}/{totalRules} completed</p>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-plus-circle"></i> Add New Rule</h3>
        <div className="add-rule-form">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="e.g., Wake up at 6 AM"
            onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddRule}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <h3><i className="fas fa-list-check"></i> Today's Rules</h3>
        {rules.length === 0 ? (
          <p className="empty-state">Add your first rule above to start tracking!</p>
        ) : (
          <div className="daily-rules-list">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`daily-rule-item ${todayChecks[rule.id] ? 'checked' : ''}`}
                onClick={() => handleToggle(rule.id)}
              >
                <div className={`rule-checkbox ${todayChecks[rule.id] ? 'checked' : ''}`}>
                  {todayChecks[rule.id] && <i className="fas fa-check"></i>}
                </div>
                <span className="daily-rule-text">{rule.rule}</span>
                <button
                  className="btn-icon delete"
                  onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.id); }}
                  title="Delete rule"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showChallenge && (
        <div className={`challenge-card ${challengeDone ? 'completed' : ''}`}>
          <div className="challenge-header">
            <i className="fas fa-fire"></i>
            <h3>Challenge!</h3>
          </div>
          <div className="challenge-body">
            <div className="challenge-icon">
              <i className={`fas ${currentChallenge.icon}`}></i>
            </div>
            <p className="challenge-text">{currentChallenge.text}</p>
            <span className="challenge-reps">{currentChallenge.reps}</span>
          </div>
          <div className="challenge-actions">
            {!challengeDone ? (
              <button className="btn btn-accent btn-full" onClick={() => setChallengeDone(true)}>
                <i className="fas fa-check"></i> Challenge Done!
              </button>
            ) : (
              <div className="challenge-done">
                <i className="fas fa-trophy"></i>
                <span>Well done! Now complete your rules!</span>
              </div>
            )}
            <button className="btn btn-secondary btn-full" onClick={handleNewChallenge} style={{ marginTop: '0.5rem' }}>
              <i className="fas fa-shuffle"></i> New Challenge
            </button>
          </div>
        </div>
      )}

      {totalRules > 0 && !allDone && !isEvening && (
        <div className="challenge-card pending">
          <div className="challenge-header">
            <i className="fas fa-clock"></i>
            <h3>Rules Pending</h3>
          </div>
          <div className="challenge-body">
            <p className="challenge-text">Complete all rules before 5 PM or face a challenge!</p>
          </div>
        </div>
      )}

      {totalRules > 0 && allDone && (
        <div className="challenge-card completed all-done">
          <div className="challenge-header">
            <i className="fas fa-trophy"></i>
            <h3>All Rules Complete!</h3>
          </div>
          <div className="challenge-body">
            <div className="challenge-icon victory">
              <i className="fas fa-medal"></i>
            </div>
            <p className="challenge-text">All rules completed! No challenge needed!</p>
          </div>
        </div>
      )}
    </div>
  );
}
