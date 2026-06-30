import { useEffect, useRef, useCallback } from 'react';

function getDateStr(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function useNotifications(todayData, rules, dailyChecks) {
  const scheduledRef = useRef(new Set());
  const intervalRef = useRef(null);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (Notification.permission !== 'granted') return;
    try {
      const notif = new Notification(title, {
        body,
        icon: `https://cdn-icons-png.flaticon.com/512/3209/3209072.png`,
        badge: `https://cdn-icons-png.flaticon.com/512/3209/3209072.png`,
        tag: 'gym-tracker-' + Date.now(),
        requireInteraction: false,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      setTimeout(() => notif.close(), 8000);
    } catch (e) {
      console.log('Notification error:', e);
    }
  }, []);

  const checkAndNotify = useCallback(() => {
    const today = getDateStr();
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeKey = `${today}-${hour}-${minute}`;

    if (scheduledRef.current.has(timeKey)) return;

    const hasWorkout = todayData.workouts.length > 0;
    const hasDiet = todayData.diet.length > 0;
    const hasWater = todayData.water > 0;
    const hasWeight = todayData.weight !== null;

    const todayChecks = {};
    dailyChecks
      .filter(c => c.date === today)
      .forEach(c => { todayChecks[c.ruleId] = c.completed; });
    const totalRules = rules.length;
    const completedRules = Object.values(todayChecks).filter(Boolean).length;
    const rulesPending = totalRules > 0 && completedRules < totalRules;

    if (hour === 8 && minute === 0) {
      sendNotification(
        'Good Morning! GymTracker',
        'Log your workout today. Consistency is key!',
      );
      scheduledRef.current.add(timeKey);
    }

    if (hour === 13 && minute === 0 && !hasDiet) {
      sendNotification(
        'Lunch Time Reminder!',
        'Add your lunch to diet tracker. Don\'t forget to track calories!',
      );
      scheduledRef.current.add(timeKey);
    }

    if (hour === 20 && minute === 0) {
      const missing = [];
      if (!hasWorkout) missing.push('Workout');
      if (!hasDiet) missing.push('Diet');
      if (!hasWater) missing.push('Water');
      if (!hasWeight) missing.push('Weight');
      if (rulesPending) missing.push('Rules');

      if (missing.length > 0) {
        sendNotification(
          'Your day is ending!',
          `Fill these details: ${missing.join(', ')}`,
        );
      }
      scheduledRef.current.add(timeKey);
    }

    if (hour === 21 && minute === 30) {
      if (!hasWorkout && !hasDiet) {
        sendNotification(
          'Last Reminder!',
          'Some details are still pending. Fill them now!',
        );
      }
      scheduledRef.current.add(timeKey);
    }
  }, [todayData, rules, dailyChecks, sendNotification]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    checkAndNotify();
    intervalRef.current = setInterval(checkAndNotify, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkAndNotify]);

  return { requestPermission, sendNotification };
}
