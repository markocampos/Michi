<template>
  <Teleport to="body">
    <div class="fixed z-[200] flex flex-col items-center gap-2 pointer-events-none px-4" :class="positionClass">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md max-w-sm w-full"
          :class="typeClasses[toast.type]"
          @click="dismiss(toast.id)"
        >
          <Icon :icon="typeIcons[toast.type]" class="w-5 h-5 flex-shrink-0" />
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from '../composables/useToast.js';

const { toasts, dismiss } = useToast();

const positionClass = computed(() => 'bottom-24 md:bottom-6 left-0 right-0');

const typeClasses = {
  success: 'bg-forest/95 text-white border-forest/30',
  info: 'bg-white/95 text-charcoal border-gray-200/50',
  warning: 'bg-torii/95 text-white border-torii/30',
};

const typeIcons = {
  success: 'lucide:check-circle',
  info: 'lucide:info',
  warning: 'lucide:alert-circle',
};
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
