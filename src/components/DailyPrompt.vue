<template>
  <div v-if="prompt" class="bg-[#F2EFE9] border border-earth/20 rounded-2xl p-5 mb-8 shadow-sm relative overflow-hidden group">
    <div class="absolute -right-4 -top-4 text-8xl text-earth/10 select-none">?</div>
    <div class="flex items-center gap-2 mb-2 relative z-10">
      <Icon icon="lucide:sparkles" class="w-4 h-4 text-earth-dark" />
      <span class="text-xs font-semibold text-earth-dark uppercase tracking-wider">Today's Reflection</span>
    </div>
    <p class="text-charcoal font-medium leading-relaxed relative z-10 pr-4 italic">"{{ prompt }}"</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { practicePrompts } from '../data/prompts.js';

const props = defineProps({
  practiceId: { type: String, required: true }
});

const prompt = computed(() => {
  const prompts = practicePrompts[props.practiceId];
  if (!prompts || prompts.length === 0) return '';
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return prompts[day % prompts.length];
});
</script>
