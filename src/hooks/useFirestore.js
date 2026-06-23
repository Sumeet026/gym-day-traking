import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, deleteDoc, doc, query, where,
  onSnapshot, serverTimestamp, getDocs, updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

function getDateStr(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function getWeekDates() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getDateStr(d));
  }
  return dates;
}

function getMonthDates() {
  const dates = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    if (d <= now) {
      dates.push(getDateStr(d));
    }
  }
  return dates;
}

export function useFirestore(userId = 'default') {
  const [todayData, setTodayData] = useState({
    workouts: [],
    diet: [],
    water: 0,
    weight: null
  });
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState({});
  const [weekWaterData, setWeekWaterData] = useState({});
  const [allWeights, setAllWeights] = useState([]);
  const [streak, setStreak] = useState(0);
  const [goals, setGoals] = useState({
    caloriesGoal: 2000,
    waterGoal: 8,
    proteinGoal: 150,
    weightGoal: null
  });
  const [profile, setProfile] = useState({ name: '', photoUrl: '' });
  const [rules, setRules] = useState([]);
  const [dailyChecks, setDailyChecks] = useState([]);

  const today = getDateStr();

  // Subscribe to user goals
  useEffect(() => {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setGoals({
          caloriesGoal: data.caloriesGoal || 2000,
          waterGoal: data.waterGoal || 8,
          proteinGoal: data.proteinGoal || 150,
          weightGoal: data.weightGoal || null
        });
      }
    }, (err) => console.error('Goals error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to user profile
  useEffect(() => {
    const q = query(
      collection(db, 'profiles'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setProfile({ name: data.name || '', photoUrl: data.photoUrl || '' });
      }
    }, (err) => console.error('Profile error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to rules
  useEffect(() => {
    const q = query(
      collection(db, 'rules'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRules(data);
    }, (err) => console.error('Rules error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to daily checks
  useEffect(() => {
    const q = query(
      collection(db, 'dailyChecks'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDailyChecks(data);
    }, (err) => console.error('Daily checks error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to today's workouts
  useEffect(() => {
    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTodayData(prev => ({ ...prev, workouts: data }));
      setLoading(false);
    }, (err) => {
      console.error('Workouts error:', err);
      setLoading(false);
    });
    return unsub;
  }, [userId, today]);

  // Subscribe to today's diet
  useEffect(() => {
    const q = query(
      collection(db, 'diet'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTodayData(prev => ({ ...prev, diet: data }));
    }, (err) => console.error('Diet error:', err));
    return unsub;
  }, [userId, today]);

  // Subscribe to today's water
  useEffect(() => {
    const q = query(
      collection(db, 'water'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setTodayData(prev => ({ ...prev, water: snap.docs[0].data().glasses }));
      } else {
        setTodayData(prev => ({ ...prev, water: 0 }));
      }
    }, (err) => console.error('Water error:', err));
    return unsub;
  }, [userId, today]);

  // Subscribe to today's weight
  useEffect(() => {
    const q = query(
      collection(db, 'weights'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setTodayData(prev => ({ ...prev, weight: snap.docs[0].data().weight }));
      } else {
        setTodayData(prev => ({ ...prev, weight: null }));
      }
    }, (err) => console.error('Weight error:', err));
    return unsub;
  }, [userId, today]);

  // Subscribe to all weights for chart
  useEffect(() => {
    const q = query(
      collection(db, 'weights'),
      where('userId', '==', userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.date.localeCompare(a.date));
      setAllWeights(data);
    }, (err) => console.error('All weights error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to week workout data for charts
  useEffect(() => {
    const weekDates = getWeekDates();
    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', userId),
      where('date', 'in', weekDates)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        if (!data[doc.date]) data[doc.date] = { totalReps: 0, totalSets: 0, exercises: 0, names: [] };
        data[doc.date].totalReps += (doc.sets || 0) * (doc.reps || 0);
        data[doc.date].totalSets += (doc.sets || 0);
        data[doc.date].exercises += 1;
        data[doc.date].names.push(doc.name);
      });
      setWeekData(data);
    }, (err) => console.error('Week data error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to week water data
  useEffect(() => {
    const weekDates = getWeekDates();
    const q = query(
      collection(db, 'water'),
      where('userId', '==', userId),
      where('date', 'in', weekDates)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        data[doc.date] = doc.glasses;
      });
      setWeekWaterData(data);
    }, (err) => console.error('Week water error:', err));
    return unsub;
  }, [userId]);

  // Subscribe to month data for reports
  const [monthData, setMonthData] = useState({});
  const [monthDietData, setMonthDietData] = useState({});
  const [monthWaterData, setMonthWaterData] = useState({});
  const [monthWeightData, setMonthWeightData] = useState({});

  useEffect(() => {
    const monthDates = getMonthDates();
    if (monthDates.length === 0) return;

    const q1 = query(
      collection(db, 'workouts'),
      where('userId', '==', userId),
      where('date', 'in', monthDates)
    );
    const unsub1 = onSnapshot(q1, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        if (!data[doc.date]) data[doc.date] = { totalReps: 0, exercises: 0 };
        data[doc.date].totalReps += (doc.sets || 0) * (doc.reps || 0);
        data[doc.date].exercises += 1;
      });
      setMonthData(data);
    }, (err) => console.error('Month workout error:', err));

    const q2 = query(
      collection(db, 'diet'),
      where('userId', '==', userId),
      where('date', 'in', monthDates)
    );
    const unsub2 = onSnapshot(q2, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        if (!data[doc.date]) data[doc.date] = { totalCal: 0, meals: 0 };
        data[doc.date].totalCal += (doc.calories || 0);
        data[doc.date].meals += 1;
      });
      setMonthDietData(data);
    }, (err) => console.error('Month diet error:', err));

    const q3 = query(
      collection(db, 'water'),
      where('userId', '==', userId),
      where('date', 'in', monthDates)
    );
    const unsub3 = onSnapshot(q3, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        data[doc.date] = doc.glasses;
      });
      setMonthWaterData(data);
    }, (err) => console.error('Month water error:', err));

    const q4 = query(
      collection(db, 'weights'),
      where('userId', '==', userId),
      where('date', 'in', monthDates)
    );
    const unsub4 = onSnapshot(q4, (snap) => {
      const data = {};
      snap.docs.forEach(d => {
        const doc = d.data();
        data[doc.date] = doc.weight;
      });
      setMonthWeightData(data);
    }, (err) => console.error('Month weight error:', err));

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, [userId]);

  // Calculate streak
  useEffect(() => {
    let cancelled = false;
    async function calcStreak() {
      let count = 0;
      let d = new Date();
      try {
        while (count < 365) {
          const dateStr = getDateStr(d);
          const q = query(
            collection(db, 'workouts'),
            where('userId', '==', userId),
            where('date', '==', dateStr)
          );
          const snap = await getDocs(q);
          if (snap.empty) break;
          count++;
          d.setDate(d.getDate() - 1);
        }
      } catch (e) {
        console.error('Streak calc error:', e);
      }
      if (!cancelled) setStreak(count);
    }
    calcStreak();
    return () => { cancelled = true; };
  }, [userId, todayData.workouts.length]);

  // Get data for any specific date (for history)
  const getDataForDate = useCallback(async (dateStr) => {
    try {
      const [workoutsSnap, dietSnap, waterSnap, weightSnap] = await Promise.all([
        getDocs(query(collection(db, 'workouts'), where('userId', '==', userId), where('date', '==', dateStr))),
        getDocs(query(collection(db, 'diet'), where('userId', '==', userId), where('date', '==', dateStr))),
        getDocs(query(collection(db, 'water'), where('userId', '==', userId), where('date', '==', dateStr))),
        getDocs(query(collection(db, 'weights'), where('userId', '==', userId), where('date', '==', dateStr)))
      ]);
      return {
        workouts: workoutsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        diet: dietSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        water: waterSnap.empty ? 0 : waterSnap.docs[0].data().glasses,
        weight: weightSnap.empty ? null : weightSnap.docs[0].data().weight
      };
    } catch (e) {
      console.error('History fetch error:', e);
      return { workouts: [], diet: [], water: 0, weight: null };
    }
  }, [userId]);

  // Get week report data
  const getWeekReport = useCallback(async (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate + 'T00:00:00');
      d.setDate(d.getDate() + i);
      dates.push(getDateStr(d));
    }
    const results = {};
    for (const dateStr of dates) {
      results[dateStr] = await getDataForDate(dateStr);
    }
    return results;
  }, [getDataForDate]);

  // Save goals
  const saveGoals = async (newGoals) => {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'goals', snap.docs[0].id), newGoals);
    } else {
      await addDoc(collection(db, 'goals'), {
        userId,
        ...newGoals,
        createdAt: new Date().toISOString()
      });
    }
  };

  // Add workout
  const addWorkout = async (exercise) => {
    await addDoc(collection(db, 'workouts'), {
      userId,
      date: today,
      ...exercise,
      createdAt: new Date().toISOString()
    });
  };

  // Delete workout
  const deleteWorkout = async (id) => {
    await deleteDoc(doc(db, 'workouts', id));
  };

  // Add diet
  const addDiet = async (meal) => {
    await addDoc(collection(db, 'diet'), {
      userId,
      date: today,
      ...meal,
      createdAt: new Date().toISOString()
    });
  };

  // Delete diet
  const deleteDietEntry = async (id) => {
    await deleteDoc(doc(db, 'diet', id));
  };

  // Update water
  const updateWater = async (glasses) => {
    const q = query(
      collection(db, 'water'),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'water', snap.docs[0].id), { glasses });
    } else {
      await addDoc(collection(db, 'water'), {
        userId,
        date: today,
        glasses,
        createdAt: new Date().toISOString()
      });
    }
  };

  // Add weight
  const addWeight = async (weight) => {
    await addDoc(collection(db, 'weights'), {
      userId,
      date: today,
      weight,
      createdAt: new Date().toISOString()
    });
  };

  // Delete weight
  const deleteWeight = async (id) => {
    await deleteDoc(doc(db, 'weights', id));
  };

  // Save profile
  const saveProfile = async (profileData) => {
    const q = query(
      collection(db, 'profiles'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'profiles', snap.docs[0].id), profileData);
    } else {
      await addDoc(collection(db, 'profiles'), {
        userId,
        ...profileData,
        createdAt: new Date().toISOString()
      });
    }
  };

  // Save rule
  const saveRule = async (ruleData) => {
    await addDoc(collection(db, 'rules'), {
      userId,
      ...ruleData
    });
  };

  // Delete rule
  const deleteRule = async (id) => {
    await deleteDoc(doc(db, 'rules', id));
  };

  // Toggle daily check
  const toggleDailyCheck = async (checkData) => {
    const q = query(
      collection(db, 'dailyChecks'),
      where('userId', '==', userId),
      where('ruleId', '==', checkData.ruleId),
      where('date', '==', checkData.date)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'dailyChecks', snap.docs[0].id), {
        completed: checkData.completed
      });
    } else {
      await addDoc(collection(db, 'dailyChecks'), {
        userId,
        ...checkData
      });
    }
  };

  return {
    todayData,
    loading,
    weekData,
    weekWaterData,
    allWeights,
    streak,
    goals,
    profile,
    rules,
    dailyChecks,
    monthData,
    monthDietData,
    monthWaterData,
    monthWeightData,
    getDataForDate,
    getWeekReport,
    saveGoals,
    saveProfile,
    saveRule,
    deleteRule,
    toggleDailyCheck,
    addWorkout,
    deleteWorkout,
    addDiet,
    deleteDietEntry,
    updateWater,
    addWeight,
    deleteWeight
  };
}
