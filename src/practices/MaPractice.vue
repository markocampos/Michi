<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <div class="text-center mb-8">
      <Icon icon="lucide:wind" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Ma</h1>
      <p class="text-sm text-muted mt-1">間 - The space between</p>
    </div>

    <div class="relative mb-8 flex items-center justify-center">
      <div
        class="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 transition-all duration-1000 flex items-center justify-center"
        :class="isRunning ? 'border-forest scale-110' : 'border-gray-200'"
        :style="{ transform: `scale(${isRunning ? Math.min(1 + progress * 0.2, 1.2) : 1})` }"
      >
        <div class="text-center">
          <p class="text-3xl font-light text-charcoal">{{ isRunning ? remaining : formattedTime }}</p>
          <p class="text-xs text-muted mt-1">{{ isRunning ? 'remaining' : 'elapsed' }}</p>
        </div>
      </div>
      <div
        v-if="isRunning"
        class="absolute inset-0 rounded-full border-4 border-forest/20 animate-ping"
        style="animation-duration: 4s;"
      />
    </div>

    <div v-if="!isRunning && elapsed === 0" class="flex gap-3 mb-8">
      <button
        v-for="d in durations"
        :key="d.value"
        @click="setDuration(d.value)"
        class="px-4 py-2 rounded-xl text-sm transition-all"
        :class="targetDuration === d.value ? 'bg-forest text-white' : 'glass border border-gray-100/50 text-muted'"
      >
        {{ d.label }}
      </button>
    </div>

    <div class="flex gap-4">
      <button
        v-if="!isRunning"
        @click="start"
        aria-label="Start meditation timer"
        class="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forest-dark transition-colors shadow-lg hover:shadow-xl"
      >
        <Icon icon="lucide:play" class="w-6 h-6" />
      </button>
      <button
        v-else
        @click="stop"
        aria-label="Pause meditation timer"
        class="w-16 h-16 rounded-full bg-torii text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-lg"
      >
        <Icon icon="lucide:pause" class="w-6 h-6" />
      </button>
      <button
        v-if="elapsed > 0"
        @click="reset"
        aria-label="Reset timer"
        class="w-16 h-16 rounded-full bg-white border border-gray-200 text-muted flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <Icon icon="lucide:rotate-ccw" class="w-5 h-5" />
      </button>
    </div>

    <div v-if="elapsed > 0 && !isRunning" class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 mt-6 text-center">
      <p class="text-sm text-forest">Session complete. {{ Math.max(1, Math.round(elapsed / 60)) }} minutes of presence.</p>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useTimer } from '../composables/useTimer.js';
import { useStorage } from '../composables/useStorage.js';

const timer = useTimer();
const { isRunning, elapsed, progress, formattedTime, remaining, start, reset, setDuration, targetDuration } = timer;
const data = useStorage('michi_ma', { sessions: [] });

const durations = [
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
];

// Watch for auto-completion (timer reaches targetDuration and stops itself)
let wasSaved = false;
watch(isRunning, (running, wasRunning) => {
  if (!running && wasRunning && elapsed.value > 0 && !wasSaved) {
    saveSession();
  }
  if (running) wasSaved = false;
});

function saveSession() {
  wasSaved = true;
  data.value.sessions.push({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    duration: elapsed.value,
  });
}

function stop() {
  timer.stop();
  // The watch will handle saving
}
</script>
