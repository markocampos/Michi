<template>
  <router-link
    :to="`/practice/${practice.id}`"
    :aria-label="`${practice.name} practice - ${practice.desc}`"
    class="block group glass rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
  >
    <Icon :icon="practice.icon" class="absolute -right-2 -bottom-2 w-20 h-20 text-forest/[0.07] group-hover:text-forest/[0.12] transition-colors pointer-events-none" />
    <div class="relative z-10 min-w-0">
      <h3 class="font-semibold text-charcoal mb-1 text-sm md:text-base">{{ practice.name }}</h3>
      <p class="text-xs md:text-sm text-muted mb-1">{{ practice.jp }}</p>
      <p class="text-xs text-muted/70 line-clamp-2">{{ practice.desc }}</p>
      <div v-if="doneToday" class="mt-3 flex items-center gap-1 text-forest text-xs font-medium">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Done today
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { Icon } from '@iconify/vue';

defineProps({
  practice: { type: Object, required: true },
  doneToday: { type: Boolean, default: false }
});
</script>
