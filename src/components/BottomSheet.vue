<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div
          ref="panelRef"
          class="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          :class="maxHeightClass"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div class="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          <div class="px-6 pb-6 overflow-y-auto overscroll-contain" :style="{ maxHeight: contentMaxHeight }">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { triggerHaptic } from '../utils/haptics.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  maxHeight: { type: String, default: '85vh' },
});

const emit = defineEmits(['update:modelValue', 'close']);

const panelRef = ref(null);
const contentMaxHeight = computed(() => {
  return `calc(${props.maxHeight} - 48px)`;
});
const maxHeightClass = computed(() => '');

// Drag-to-dismiss
let startY = 0;
let currentY = 0;
let isDragging = false;

function onTouchStart(e) {
  startY = e.touches[0].clientY;
  isDragging = true;
}

function onTouchMove(e) {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  const delta = currentY - startY;
  if (delta > 0 && panelRef.value) {
    panelRef.value.style.transform = `translateY(${delta}px)`;
    panelRef.value.style.transition = 'none';
  }
}

function onTouchEnd() {
  if (!isDragging) return;
  isDragging = false;
  const delta = currentY - startY;
  if (delta > 100) {
    triggerHaptic();
    close();
  } else if (panelRef.value) {
    panelRef.value.style.transform = '';
    panelRef.value.style.transition = '';
  }
  startY = 0;
  currentY = 0;
}

function close() {
  emit('update:modelValue', false);
  emit('close');
}

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}
.bottom-sheet-enter-active > div:last-child,
.bottom-sheet-leave-active > div:last-child {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}
.bottom-sheet-enter-from > div:last-child {
  transform: translateY(100%);
}
.bottom-sheet-leave-to > div:last-child {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .bottom-sheet-enter-from > div:last-child {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  .bottom-sheet-leave-to > div:last-child {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
