<template>
  <div class="glass rounded-3xl p-6 shadow-sm border border-gray-100/50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="font-bold text-charcoal text-lg">Growth Insights</h3>
        <p class="text-xs text-muted mt-0.5">Meditation vs Wellbeing Correlation</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-full bg-forest"></div>
          <span class="text-[10px] font-bold tracking-wider uppercase text-muted">Meditation</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-full bg-spring"></div>
          <span class="text-[10px] font-bold tracking-wider uppercase text-muted">Wellbeing</span>
        </div>
      </div>
    </div>
    <div ref="chartContainer" class="relative h-48">
      <svg :width="chartWidth" height="100%" class="overflow-visible">
        <!-- Grid lines -->
        <line
          v-for="i in 5"
          :key="i"
          :x1="0"
          :y1="`${((i - 1) / 4) * 100}%`"
          :x2="chartWidth"
          :y2="`${((i - 1) / 4) * 100}%`"
          stroke="#E5E7EB"
          stroke-width="1"
          stroke-dasharray="4,4"
        />

        <defs>
          <linearGradient id="med-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-forest)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--color-forest)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="well-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-spring)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--color-spring)" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Area fills -->
        <path v-if="medPath" :d="medAreaPath" fill="url(#med-gradient)" class="transition-all duration-1000 ease-in-out" />
        <path v-if="wellPath" :d="wellAreaPath" fill="url(#well-gradient)" class="transition-all duration-1000 ease-in-out" />

        <!-- Lines -->
        <path
          v-if="medPath"
          :d="medPath"
          fill="none"
          stroke="var(--color-forest)"
          stroke-width="3"
          stroke-linecap="round"
          class="transition-all duration-1000 ease-in-out"
        />
        <path
          v-if="wellPath"
          :d="wellPath"
          fill="none"
          stroke="var(--color-spring)"
          stroke-width="3"
          stroke-linecap="round"
          class="transition-all duration-1000 ease-in-out"
        />

        <!-- Dots -->
        <circle
          v-for="(p, i) in medPoints"
          :key="'m'+i"
          :cx="p.x"
          :cy="p.y"
          r="4"
          fill="white"
          stroke="var(--color-forest)"
          stroke-width="2"
          class="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <title>{{ p.date }}: {{ p.val }} min</title>
        </circle>
        
        <circle
          v-for="(p, i) in wellPoints"
          :key="'w'+i"
          :cx="p.x"
          :cy="p.y"
          r="4"
          fill="white"
          stroke="var(--color-spring)"
          stroke-width="2"
          class="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <title>{{ p.date }}: {{ p.val }} score</title>
        </circle>
      </svg>
    </div>
    <div class="flex justify-between mt-4 px-1">
      <span class="text-xs font-medium text-muted">{{ labels[0] }}</span>
      <span class="text-xs font-medium text-muted">{{ labels[Math.floor(labels.length / 2)] }}</span>
      <span class="text-xs font-medium text-muted">{{ labels[labels.length - 1] }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { getMeditationMinutes, getWellbeingScore } from '../utils/charts.js';

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
  // Trigger a re-render slightly after mount for animation effect
  setTimeout(updateWidth, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const medData = computed(() => getMeditationMinutes(props.data, 14));
const wellData = computed(() => getWellbeingScore(props.data, 14));

const labels = computed(() => {
  return medData.value.map(d => {
    const date = new Date(d.date + 'T00:00:00');
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
  });
});

function calculatePoints(dataArray, maxVal) {
  if (!chartWidth.value) return [];
  const paddingY = 10;
  const paddingX = 4;
  const w = chartWidth.value - paddingX * 2;
  const h = 192 - paddingY * 2; // 48 * 4 = 192px height

  return dataArray.map((d, i) => ({
    x: paddingX + (i / (dataArray.length - 1)) * w,
    y: paddingY + h - (d / maxVal) * h,
    val: d,
    date: dataArray[i].date // passed through if needed
  }));
}

const medPoints = computed(() => {
  const maxMins = Math.max(...medData.value.map(d => d.minutes), 30);
  return calculatePoints(medData.value.map(d => d.minutes), maxMins).map((p, i) => ({...p, date: labels.value[i]}));
});

const wellPoints = computed(() => {
  const maxScore = 100;
  return calculatePoints(wellData.value.map(d => d.score), maxScore).map((p, i) => ({...p, date: labels.value[i]}));
});

function catmullRomToBezier(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;
    
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const medPath = computed(() => catmullRomToBezier(medPoints.value));
const wellPath = computed(() => catmullRomToBezier(wellPoints.value));

const medAreaPath = computed(() => {
  if (!medPath.value) return '';
  const first = medPoints.value[0];
  const last = medPoints.value[medPoints.value.length - 1];
  return `${medPath.value} L ${last.x},192 L ${first.x},192 Z`;
});

const wellAreaPath = computed(() => {
  if (!wellPath.value) return '';
  const first = wellPoints.value[0];
  const last = wellPoints.value[wellPoints.value.length - 1];
  return `${wellPath.value} L ${last.x},192 L ${first.x},192 Z`;
});
</script>
