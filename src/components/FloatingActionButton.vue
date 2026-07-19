<template>
  <div v-if="showFab" class="fixed z-50 bottom-20 md:bottom-6 right-4 md:right-8" style="pointer-events: auto;">
    <!-- Action pills -->
    <TransitionGroup name="fab-pill" tag="div" class="flex flex-col items-end gap-2 mb-3">
      <div v-for="(action, i) in visibleActions" :key="action.label">
        <router-link
          :to="action.to"
          @click="close"
          class="flex items-center gap-2.5 px-4 py-2.5 glass rounded-full shadow-lg border border-gray-100/50 hover:shadow-xl transition-all text-sm font-medium text-charcoal whitespace-nowrap animate-fade-in-up"
          :style="{ animationDelay: (actions.length - 1 - i) * 50 + 'ms' }"
        >
          <Icon :icon="action.icon" class="w-4 h-4 text-forest" />
          {{ action.label }}
        </router-link>
      </div>
    </TransitionGroup>

    <!-- FAB button -->
    <button
      @click="toggle"
      class="w-14 h-14 rounded-full bg-forest text-white shadow-xl flex items-center justify-center hover:bg-forest-dark transition-all active:scale-95 ml-auto"
      :class="{ 'rotate-45': isOpen }"
      aria-label="Quick actions"
    >
      <Icon icon="lucide:plus" class="w-6 h-6 transition-transform" :class="{ 'rotate-[-45deg]': isOpen }" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { triggerHaptic } from '../utils/haptics.js';

const route = useRoute();
const isOpen = ref(false);

const actions = [
  { label: 'Journal', icon: 'lucide:book-open', to: '/journal' },
  { label: 'Meditate', icon: 'lucide:wind', to: '/practice/ma' },
  { label: 'Check-in', icon: 'lucide:sparkles', to: '/practices' },
];

const visibleActions = computed(() => isOpen.value ? actions : []);

const hiddenRoutes = ['onboarding', 'pin', 'practice'];

const userFabPref = ref(localStorage.getItem('michi_show_fab') === 'true');
window.addEventListener('michi_fab_setting_changed', () => {
  userFabPref.value = localStorage.getItem('michi_show_fab') === 'true';
});

const showFab = computed(() => {
  if (!userFabPref.value) return false;
  return !hiddenRoutes.some(r => route.name?.toLowerCase().includes(r)) && route.name !== 'privacy';
});

function toggle() {
  isOpen.value = !isOpen.value;
  triggerHaptic();
}

function close() {
  isOpen.value = false;
}

watch(() => route.fullPath, () => {
  isOpen.value = false;
});
</script>

<style scoped>
.fab-pill-enter-active {
  transition: all 0.25s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.fab-pill-leave-active {
  transition: all 0.15s ease-in;
}
.fab-pill-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
.fab-pill-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}

button.rotate-45 {
  transform: rotate(45deg);
}
</style>
