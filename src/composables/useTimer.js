import { ref, computed, onUnmounted } from 'vue';

export function useTimer() {
  const isRunning = ref(false);
  const elapsed = ref(0);
  const targetDuration = ref(300); // 5 minutes default
  let interval = null;

  const progress = computed(() => {
    if (targetDuration.value === 0) return 0;
    return Math.min(elapsed.value / targetDuration.value, 1);
  });

  const formattedTime = computed(() => {
    const mins = Math.floor(elapsed.value / 60);
    const secs = elapsed.value % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  const remaining = computed(() => {
    const rem = Math.max(targetDuration.value - elapsed.value, 0);
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  function start() {
    if (isRunning.value) return;
    isRunning.value = true;
    interval = setInterval(() => {
      elapsed.value++;
      if (elapsed.value >= targetDuration.value) {
        stop();
      }
    }, 1000);
  }

  function stop() {
    isRunning.value = false;
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    stop();
    elapsed.value = 0;
  }

  function setDuration(seconds) {
    targetDuration.value = seconds;
  }

  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  return { isRunning, elapsed, progress, formattedTime, remaining, start, stop, reset, setDuration, targetDuration };
}
