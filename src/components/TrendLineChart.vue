<template>
  <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-charcoal">Meditation Trend</h3>
      <span class="text-xs text-muted">Last 30 days</span>
    </div>
    <div ref="chartContainer" class="relative h-32">
      <svg :width="chartWidth" height="100%" class="overflow-visible">
        <!-- Grid lines -->
        <line
          v-for="i in 4"
          :key="i"
          :x1="0"
          :y1="`${(i / 4) * 100}%`"
          :x2="width"
          :y2="`${(i / 4) * 100}%`"
          stroke="#E5E7EB"
          stroke-width="0.5"
          stroke-dasharray="4,4"
        />

        <!-- Gradient fill -->
        <defs>
          <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-forest)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--color-forest)" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Area fill -->
        <path
          v-if="points.length > 1"
          :d="areaPath"
          fill="url(#trend-gradient)"
        />

        <!-- Line -->
        <polyline
          v-if="points.length > 1"
          :points="points.map(p => `${p.x},${p.y}`).join(' ')"
          fill="none"
          stroke="var(--color-forest)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-all duration-700"
        />

        <!-- Dots for data points -->
        <circle
          v-for="(p, i) in points"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="3"
          fill="var(--color-forest)"
          class="opacity-0"
          :class="p.minutes > 0 ? 'opacity-100' : ''"
        />
      </svg>
    </div>
    <div class="flex justify-between mt-2">
      <span class="text-[10px] text-muted">{{ labels[0] }}</span>
      <span class="text-[10px] text-muted">{{ labels[Math.floor(labels.length / 2)] }}</span>
      <span class="text-[10px] text-muted">{{ labels[labels.length - 1] }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { getMeditationMinutes } from '../utils/charts.js';

const props = defineProps({
  data: { type: Object, required: true },
});

const chartContainer = ref(null);
const chartWidth = ref(300);

function updateWidth() {
  if (chartContainer.value) {
    chartWidth.value = chartContainer.value.offsetWidth;
  }
}

onMounted(() => {
  updateWidth();
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const points = computed(() => {
  const data = getMeditationMinutes(props.data, 30);
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1);
  const padding = 4;
  const w = chartWidth.value - padding * 2;
  const h = 128 - padding * 2;

  return data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * w,
    y: padding + h - (d.minutes / maxMinutes) * h,
    minutes: d.minutes,
  }));
});

const labels = computed(() => {
  const data = getMeditationMinutes(props.data, 30);
  return data.map(d => {
    const date = new Date(d.date + 'T00:00:00');
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
});

const areaPath = computed(() => {
  if (points.value.length < 2) return '';
  const padding = 4;
  const w = chartWidth.value - padding * 2;
  const h = 128 - padding * 2;
  const first = points.value[0];
  const last = points.value[points.value.length - 1];

  let path = `M ${first.x},${first.y}`;
  points.value.slice(1).forEach(p => {
    path += ` L ${p.x},${p.y}`;
  });
  path += ` L ${last.x},${padding + h}`;
  path += ` L ${first.x},${padding + h} Z`;
  return path;
});
</script>
