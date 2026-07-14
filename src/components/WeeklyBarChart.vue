<template>
  <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
    <h3 class="font-semibold text-charcoal mb-4">Weekly Activity</h3>
    <div v-if="hasData" class="flex items-end justify-between gap-2 h-32">
      <div
        v-for="(bar, i) in bars"
        :key="bar.date"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <span class="text-[10px] text-muted font-medium">{{ bar.count }}</span>
        <div
          class="w-full rounded-t-lg transition-all duration-500 ease-out"
          :class="bar.count > 0 ? 'bg-forest' : 'bg-gray-100'"
          :style="{ height: `${bar.height}%`, animationDelay: `${i * 60}ms` }"
        />
        <span class="text-[10px] text-muted">{{ bar.label }}</span>
      </div>
    </div>
    <div v-else class="text-center py-6">
      <Icon icon="lucide:bar-chart-3" class="w-8 h-8 text-muted mx-auto mb-2" />
      <p class="text-sm text-muted">No activity this week yet.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { getDailyPracticeCounts } from '../utils/charts.js';

const props = defineProps({
  data: { type: Object, required: true },
});

const bars = computed(() => {
  const counts = getDailyPracticeCounts(props.data, 7);
  const maxCount = Math.max(...counts.map(c => c.count), 1);
  return counts.map(c => ({
    ...c,
    height: Math.max((c.count / maxCount) * 100, c.count > 0 ? 8 : 0),
  }));
});

const hasData = computed(() => bars.value.some(b => b.count > 0));
</script>
