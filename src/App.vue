<template>
  <div class="min-h-screen bg-gray-100/50 flex justify-center transition-colors duration-500">
    <a v-if="route.name !== 'onboarding' && route.name !== 'pin'" href="#main-content" class="skip-nav">Skip to main content</a>
    <div class="w-full max-w-[1440px] bg-gradient-to-br from-warm-white via-[#F5F5F0] to-[#EAEAE2] min-h-screen relative shadow-2xl pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0 md:grid md:grid-cols-[80px_1fr]">
      <!-- Settings gear (mobile only) -->
      <router-link
        v-if="showNav && route.name !== 'settings' && route.name !== 'practice'"
        to="/settings"
        class="fixed z-50 w-11 h-11 rounded-full glass border border-gray-100/50 shadow-sm flex items-center justify-center text-muted hover:text-charcoal hover:shadow-md transition-all md:hidden settings-btn"
        aria-label="Settings"
      >
        <Icon icon="lucide:settings" class="w-5 h-5" />
      </router-link>
      <BottomNav v-if="showNav" />
      <main
        ref="swipeContainer"
        id="main-content"
        class="min-h-screen"
        :class="!showNav ? 'md:col-span-2' : ''"
        tabindex="-1"
        :style="swiping ? { transform: `translateX(${swipeOffset}px)`, transition: 'none' } : {}"
      >
        <div v-if="error" class="p-8 text-center">
          <Icon icon="lucide:alert-triangle" class="w-12 h-12 text-torii mx-auto mb-4" />
          <h2 class="text-lg font-semibold text-charcoal mb-2">Something went wrong</h2>
          <p class="text-sm text-muted mb-4">{{ error.message }}</p>
          <button @click="error = null" class="px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors">
            Try again
          </button>
        </div>
        <router-view v-else v-slot="{ Component, route: viewRoute }">
          <transition :name="getTransition(viewRoute)" mode="out-in">
            <component :is="Component" :key="viewRoute.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onErrorCaptured, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import BottomNav from './components/BottomNav.vue';
import { useSwipeNavigation } from './composables/useSwipeNavigation.js';

const route = useRoute();
const error = ref(null);

const showNav = computed(() => {
  return route.name !== 'onboarding' && route.name !== 'pin';
});

// Swipe navigation
const { isSwiping: swiping, swipeOffset, containerRef: swipeContainer } = useSwipeNavigation();

// Clear PIN verification when user leaves the journal
watch(() => route.name, (newName, oldName) => {
  if (oldName === 'journal' && newName !== 'journal' && newName !== 'pin') {
    localStorage.removeItem('michi_pin_verified');
  }
});

// Tab order for determining slide direction
const tabIndexMap = {
  '/': 0,
  '/practices': 1,
  '/journal': 2,
  '/growth': 3,
};

// Track the previous path to determine direction
let prevPath = route.fullPath;

function getTransition(viewRoute) {
  const fromIndex = tabIndexMap[prevPath] ?? null;
  const toIndex = tabIndexMap[viewRoute.fullPath] ?? null;

  // Update prevPath for next navigation
  prevPath = viewRoute.fullPath;

  // If either route has no tab index, use fade
  if (fromIndex === null || toIndex === null) return 'fade';
  if (fromIndex === toIndex) return 'fade';

  // Slide direction: moving right in tab order = slide-left (content enters from right)
  return toIndex > fromIndex ? 'slide-left' : 'slide-right';
}

onErrorCaptured((err) => {
  error.value = err;
  return false;
});
</script>
