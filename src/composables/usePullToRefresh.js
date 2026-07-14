import { ref } from 'vue';

/**
 * Composable for pull-to-refresh gesture.
 * @param {Function} onRefresh - Async function to call when refresh is triggered
 * @param {Object} options - Configuration options
 */
export function usePullToRefresh(onRefresh, options = {}) {
  const {
    threshold = 80,
    maxPull = 120,
    resistance = 0.5,
  } = options;

  const isRefreshing = ref(false);
  const pullDistance = ref(0);
  const isPulling = ref(false);

  let startY = 0;
  let currentY = 0;
  let canPull = false;

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop;
  }

  function onTouchStart(e) {
    if (isRefreshing.value) return;
    canPull = getScrollTop() <= 0;
    startY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (!canPull || isRefreshing.value) return;

    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      isPulling.value = true;
      // Apply resistance after threshold
      const pull = deltaY > threshold
        ? threshold + (deltaY - threshold) * resistance
        : deltaY;
      pullDistance.value = Math.min(pull, maxPull);
      e.preventDefault();
    }
  }

  async function onTouchEnd() {
    if (!isPulling.value) return;

    if (pullDistance.value >= threshold) {
      // Trigger refresh
      isRefreshing.value = true;
      if (navigator.vibrate) navigator.vibrate(10);

      try {
        await onRefresh?.();
      } catch (e) {
        console.error('Pull-to-refresh failed:', e);
      }

      isRefreshing.value = false;
    }

    isPulling.value = false;
    pullDistance.value = 0;
    canPull = false;
  }

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
