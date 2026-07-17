import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/**
 * Composable for swipe-to-navigate between main tabs.
 * Returns a ref for the container element — attach via template ref.
 * @param {number} tabCount - Number of main tabs (default 4)
 * @param {Function} onSwipe - Callback fired with direction: 'left' | 'right'
 */
export function useSwipeNavigation({ tabCount = 4, onSwipe } = {}) {
  const router = useRouter();
  const route = useRoute();
  const isSwiping = ref(false);
  const swipeOffset = ref(0);
  const containerRef = ref(null);

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
  let tracking = false;
  const SWIPE_THRESHOLD = 60;
  const MAX_VERTICAL = 60;
  const MAX_TIME = 500;

  function onTouchStart(e) {
    const currentIndex = tabIndexMap[route.fullPath] ?? -1;
    if (currentIndex === -1) {
      tracking = false;
      return;
    }

    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    tracking = true;
    isSwiping.value = false;
    swipeOffset.value = 0;
  }

  function onTouchMove(e) {
    if (!tracking) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // If vertical scroll is dominant and horizontal is tiny, let it scroll
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 20) return;

    // Prevent swiping past the boundaries
    const currentIndex = tabIndexMap[route.fullPath];
    if (currentIndex === 0 && deltaX > 0) return; // Can't swipe right on the first tab
    if (currentIndex === tabCount - 1 && deltaX < 0) return; // Can't swipe left on the last tab

    // If we have meaningful horizontal movement, track it
    if (Math.abs(deltaX) > 8 && Math.abs(deltaY) < MAX_VERTICAL) {
      isSwiping.value = true;
      swipeOffset.value = deltaX * 0.3;
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  function onTouchEnd() {
    if (!tracking) return;
    tracking = false;

    if (!isSwiping.value) return;

    const deltaX = swipeOffset.value / 0.3;
    const elapsed = Date.now() - startTime;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && elapsed < MAX_TIME) {
      const currentIndex = tabIndexMap[route.fullPath] ?? -1;
      if (currentIndex === -1) return;

      let newIndex;
      if (deltaX < 0) {
        newIndex = Math.min(currentIndex + 1, tabCount - 1);
      } else {
        newIndex = Math.max(currentIndex - 1, 0);
      }

      if (newIndex !== currentIndex) {
        if (navigator.vibrate) navigator.vibrate(10);
        window.scrollTo(0, 0);
        router.push(tabRoutes[newIndex]);
        onSwipe?.(deltaX < 0 ? 'left' : 'right');
      }
    }

    isSwiping.value = false;
    swipeOffset.value = 0;
  }

  // Attach listeners directly with { passive: false } for preventDefault support
  onMounted(() => {
    const el = containerRef.value;
    if (!el) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    const el = containerRef.value;
    if (!el) return;
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
  });

  return {
    isSwiping,
    swipeOffset,
    containerRef,
  };
}
