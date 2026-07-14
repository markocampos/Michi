import { ref, onMounted, onUnmounted } from 'vue';

const NOTIFICATION_KEY = 'michi_notifications';
const REMINDER_TIME_KEY = 'michi_reminder_time';

/**
 * Notification composable for practice reminders and streak alerts.
 * Uses Web Notifications API for browser, with Capacitor Local Notifications for native.
 */
export function useNotifications() {
  const isEnabled = ref(false);
  const reminderTime = ref('09:00');
  const permission = ref('default');
  let checkInterval = null;
  let lastFiredDate = null;

  onMounted(() => {
    loadSettings();
    checkPermission();
    startChecking();
  });

  onUnmounted(() => {
    stopChecking();
  });

  function loadSettings() {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    isEnabled.value = stored === 'true';
    const time = localStorage.getItem(REMINDER_TIME_KEY);
    if (time) reminderTime.value = time;
  }

  async function checkPermission() {
    if (!('Notification' in window)) return;
    permission.value = Notification.permission;
  }

  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const result = await Notification.requestPermission();
    permission.value = result;
    return result === 'granted';
  }

  function toggleNotifications() {
    if (!isEnabled.value) {
      // Turning on — request permission first
      requestPermission().then(granted => {
        if (granted) {
          isEnabled.value = true;
          saveSettings();
        }
      });
    } else {
      isEnabled.value = false;
      saveSettings();
    }
  }

  function setReminderTime(time) {
    reminderTime.value = time;
    localStorage.setItem(REMINDER_TIME_KEY, time);
  }

  function saveSettings() {
    localStorage.setItem(NOTIFICATION_KEY, isEnabled.value.toString());
    localStorage.setItem(REMINDER_TIME_KEY, reminderTime.value);
  }

  function startChecking() {
    // Check every 30 seconds if it's time to notify
    checkInterval = setInterval(checkReminder, 30000);
  }

  function stopChecking() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }

  function checkReminder() {
    if (!isEnabled.value || permission.value !== 'granted') return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Don't fire more than once per day
    if (lastFiredDate === today) return;

    if (currentTime === reminderTime.value) {
      lastFiredDate = today;
      sendNotification('Time for your Michi practice', 'Take a moment to center yourself and practice mindfulness.');
    }
  }

  function sendNotification(title, body, icon = '/michi.png') {
    if (permission.value !== 'granted') return;

    try {
      new Notification(title, { body, icon, badge: '/michi.png', tag: 'michi-reminder' });
    } catch (e) {
      console.error('Notification failed:', e);
    }
  }

  function sendStreakMilestone(streak) {
    const messages = {
      7: { title: '7 Day Streak!', body: 'One week of consistent practice. Your dedication is growing.' },
      30: { title: '30 Day Streak!', body: 'A full month of mindfulness. You are building lasting change.' },
      100: { title: '100 Day Streak!', body: 'A hundred days of dedication. Your path is deeply rooted.' },
    };

    const msg = messages[streak];
    if (msg) {
      sendNotification(msg.title, msg.body);
    }
  }

  return {
    isEnabled,
    reminderTime,
    permission,
    toggleNotifications,
    setReminderTime,
    requestPermission,
    sendStreakMilestone,
    sendNotification,
  };
}
