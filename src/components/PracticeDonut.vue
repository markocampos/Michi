<template>
  <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
    <h3 class="font-semibold text-charcoal mb-4">Practice Distribution</h3>
    <div v-if="segments.length > 0" class="flex items-center gap-6">
      <!-- Donut chart -->
      <div class="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
          <circle
            v-for="(seg, i) in segments"
            :key="i"
            cx="18"
            cy="18"
            r="14"
            fill="none"
            :stroke="seg.color"
            stroke-width="4"
            :stroke-dasharray="`${seg.percent} ${100 - seg.percent}`"
            :stroke-dashoffset="`-${seg.offset}`"
            stroke-linecap="round"
            class="transition-all duration-700"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold text-charcoal">{{ totalCount }}</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="space-y-2 flex-1">
        <div v-for="seg in segments" :key="seg.name" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: seg.color }" />
          <span class="text-xs text-charcoal flex-1">{{ seg.name }}</span>
          <span class="text-xs text-muted">{{ seg.count }}</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4">
      <p class="text-sm text-muted">Complete some practices to see your distribution.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getPracticeDistribution } from '../utils/charts.js';

const props = defineProps({
  data: { type: Object, required: true },
});

const totalCount = computed(() =>
  (props.data.ma?.sessions?.length || 0) +
  (props.data.shinrin?.walks?.length || 0) +
  (props.data.wabisabi?.entries?.length || 0) +
  (props.data.ikigai?.reflections?.length || 0) +
  (props.data.hansei?.reflections?.length || 0) +
  (props.data.mononoaware?.entries?.length || 0)
);

const segments = computed(() => {
  const dist = getPracticeDistribution(props.data);
  const total = dist.reduce((sum, d) => sum + d.count, 0) || 1;
  let offset = 0;

  return dist.map(d => {
    const percent = (d.count / total) * 100;
    const seg = { ...d, percent, offset };
    offset += percent;
    return seg;
  });
});
</script>
