<template>
  <div class="relative overflow-hidden">
    <!-- Delete action behind -->
    <div class="absolute inset-y-0 right-0 flex items-center">
      <button
        @click="$emit('delete')"
        class="h-full px-6 flex items-center justify-center bg-torii text-white font-medium text-sm"
      >
        <Icon icon="lucide:trash-2" class="w-5 h-5" />
      </button>
    </div>

    <!-- Swipeable content -->
    <div
      ref="contentRef"
      class="relative z-10 transition-transform"
      :class="{ 'transition-transform': !isDragging }"
      :style="{ transform: `translateX(${offset}px)` }"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { triggerHaptic } from '../utils/haptics.js';

const emit = defineEmits(['delete']);

const contentRef = ref(null);
const offset = ref(0);
const isDragging = ref(false);
let startX = 0;
let startY = 0;
let hasMoved = false;

function onTouchStart(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  hasMoved = false;
  isDragging.value = true;
}

function onTouchMove(e) {
  if (!isDragging.value) return;
  const deltaX = e.touches[0].clientX - startX;
  const deltaY = e.touches[0].clientY - startY;

  // If vertical scroll is dominant, abort
  if (!hasMoved && Math.abs(deltaY) > Math.abs(deltaX)) {
    isDragging.value = false;
    return;
  }

  hasMoved = true;
  e.preventDefault();

  // Only allow swiping left (negative offset), with resistance
  const raw = Math.min(0, deltaX);
  offset.value = raw > -80 ? raw * 0.6 : -80 + (raw + 80) * 0.2;

  if (Math.abs(deltaX) > 40 && offset.value < -30) {
    triggerHaptic();
  }
}

function onTouchEnd() {
  isDragging.value = false;
  if (offset.value < -60) {
    offset.value = -80;
  } else {
    offset.value = 0;
  }
}
</script>
