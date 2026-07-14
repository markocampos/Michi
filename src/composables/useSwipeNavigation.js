import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/**
 * Composable for swipe-to-navigate between main tabs.
 * @param {number} tabCount - Number of main tabs (default 4)
 * @param {Function} onSwipe - Callback fired with direction: 'left' | 'right'
 */
export function useSwipeNavigation({ tabCount = 4, onSwipe } = {}) {
  const router = useRouter();
  const route = useRoute();
  const isSwiping = ref(false);
  const swipeOffset = ref(0);

  const tabIndexMap = {
    '/': 0,
    '/practices': 1,
    '/journal': 2,
    '/growth': 3,
  };

  const tabRoutes = ['/', '/practices', '/journal', '/growth'];

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  const SWIPE_THRESHOLD = 80;
  const MAX_VERTICAL = 50;
  const MAX_TIME = 400;

  function onTouchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isSwiping.value = false;
    swipeOffset.value = 0;
  }

  function onTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // If vertical scroll is dominant, don't swipe
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 30) return;

    // Only allow horizontal swipe
    if (Math.abs(deltaX) > 10 && Math.abs(deltaY) < MAX_VERTICAL) {
      isSwiping.value = true;
      swipeOffset.value = deltaX * 0.3; // Dampened offset for visual feedback
      e.preventDefault();
    }
  }

  function onTouchEnd() {
    if (!isSwiping.value) return;

    const deltaX = swipeOffset.value / 0.3; // Undo dampening
    const elapsed = Date.now() - startTime;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && elapsed < MAX_TIME) {
      const currentIndex = tabIndexMap[route.fullPath] ?? -1;
      if (currentIndex === -1) return;

      let newIndex;
      if (deltaX < 0) {
        // Swiped left → next tab
        newIndex = Math.min(currentIndex + 1, tabCount - 1);
      } else {
        // Swiped right → previous tab
        newIndex = Math.max(currentIndex - 1, 0);
      }

      if (newIndex !== currentIndex) {
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
        router.push(tabRoutes[newIndex]);
        onSwipe?.(deltaX < 0 ? 'left' : 'right');
      }
    }

    isSwiping.value = false;
    swipeOffset.value = 0;
  }

  return {
    isSwiping,
    swipeOffset,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
