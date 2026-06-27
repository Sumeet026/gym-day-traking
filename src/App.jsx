import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useFirestore } from './hooks/useFirestore';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Diet from './pages/Diet';
import Water from './pages/Water';
import Weight from './pages/Weight';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import History from './pages/History';
import Rules from './pages/Rules';
import './App.css';

function AppContent() {
  const { currentUser, isVerified, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const userId = currentUser?.uid || 'default';

  const {
    todayData, loading, weekData, weekWaterData, allWeights, streak,
    goals, profile, rules, dailyChecks,
    monthData, monthDietData, monthWaterData, monthWeightData,
    getDataForDate, getWeekReport, saveGoals, saveProfile,
    saveRule, deleteRule, toggleDailyCheck,
    addWorkout, deleteWorkout,
    addDiet, deleteDietEntry,
    updateWater, addWeight, deleteWeight
  } = useFirestore(userId);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  // Not logged in
  if (!currentUser) {
    return showLogin ? (
      <Login onToggle={() => setShowLogin(false)} />
    ) : (
      <Signup onToggle={() => setShowLogin(true)} />
    );
  }

  // Email not verified
  if (!isVerified) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-dumbbell"></i>
            </div>
            <h1>GymTracker</h1>
            <p>Your Fitness Partner</p>
          </div>
          <div className="verify-box">
            <div className="verify-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h2>Verify Your Email!</h2>
            <p>Check your <strong>{currentUser.email}</strong> inbox and click the verify link.</p>
            <p className="verify-instructions">
              1. Find the email from <strong>GymTracker</strong><br/>
              2. <strong>Click</strong> the verification link<br/>
              3. Then <strong>refresh</strong> this page
            </p>
            <p className="verify-note">Check your spam folder too!</p>
            <button className="btn btn-primary btn-full auth-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
            <button className="btn btn-secondary btn-full auth-btn" style={{ marginTop: '0.75rem' }} onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="splash">
        <div className="splash-content">
          <i className="fas fa-dumbbell splash-icon"></i>
          <h1>GymTracker</h1>
          <p>Your Fitness Partner</p>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard todayData={todayData} weekData={weekData} weekWaterData={weekWaterData} goals={goals} onNavigate={setActiveSection} />;
      case 'workout':
        return <Workout todayData={todayData} weekData={weekData} addWorkout={addWorkout} deleteWorkout={deleteWorkout} onToast={showToast} />;
      case 'diet':
        return <Diet todayData={todayData} addDiet={addDiet} deleteDietEntry={deleteDietEntry} onToast={showToast} goals={goals} />;
      case 'water':
        return <Water todayData={todayData} updateWater={updateWater} weekWaterData={weekWaterData} goals={goals} />;
      case 'weight':
        return <Weight todayData={todayData} allWeights={allWeights} addWeight={addWeight} deleteWeight={deleteWeight} onToast={showToast} goals={goals} />;
      case 'goals':
        return <Goals goals={goals} saveGoals={saveGoals} onToast={showToast} />;
      case 'reports':
        return <Reports weekData={weekData} weekWaterData={weekWaterData} monthData={monthData} monthDietData={monthDietData} monthWaterData={monthWaterData} monthWeightData={monthWeightData} goals={goals} getDataForDate={getDataForDate} />;
      case 'history':
        return <History getDataForDate={getDataForDate} />;
      case 'rules':
        return <Rules rules={rules} dailyChecks={dailyChecks} onSaveRule={saveRule} onDeleteRule={deleteRule} onToggleCheck={toggleDailyCheck} />;
      default:
        return <Dashboard todayData={todayData} weekData={weekData} weekWaterData={weekWaterData} goals={goals} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="app">
      <Header streak={streak} onLogout={logout} profile={profile} onSaveProfile={saveProfile} />
      <main className="main-content">
        {renderSection()}
      </main>
      <BottomNav activeSection={activeSection} onNavigate={setActiveSection} />
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
