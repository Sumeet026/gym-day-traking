import { useState, useMemo } from 'react';

function getDateStr(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export default function Rules({ rules, dailyChecks, onSaveRule, onDeleteRule, onToggleCheck }) {
  const [newRule, setNewRule] = useState('');
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

      {totalRules > 0 && (
        <div className="dashboard-card">
          <h3><i className="fas fa-trophy"></i> Streak Info</h3>
          <div className="streak-info-grid">
            <div className="streak-info-item">
              <i className="fas fa-check-double"></i>
              <span className="streak-info-value">{completedToday === totalRules && totalRules > 0 ? '✓' : '—'}</span>
              <span className="streak-info-label">
                {completedToday === totalRules && totalRules > 0 ? 'All Done!' : 'Keep Going'}
              </span>
            </div>
            <div className="streak-info-item">
              <i className="fas fa-list"></i>
              <span className="streak-info-value">{totalRules}</span>
              <span className="streak-info-label">Total Rules</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
