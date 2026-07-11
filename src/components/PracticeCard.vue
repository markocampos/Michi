<template>
  <router-link
    :to="`/practice/${practice.id}`"
    class="block group glass rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <div class="text-4xl mb-3 transform transition-transform group-hover:scale-110">{{ practice.icon }}</div>
    <h3 class="font-semibold text-charcoal mb-1">{{ practice.name }}</h3>
    <p class="text-sm text-muted">{{ practice.jp }}</p>
    <div v-if="doneToday" class="mt-3 flex items-center gap-1 text-forest text-xs font-medium">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Done today
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  practice: { type: Object, required: true },
  doneToday: { type: Boolean, default: false }
});
</script>
