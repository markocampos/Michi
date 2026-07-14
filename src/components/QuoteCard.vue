<template>
  <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
    <div class="absolute -right-4 -top-4 text-9xl text-gray-100/30 opacity-50 select-none">"</div>
    <p class="text-base md:text-lg font-medium text-charcoal leading-relaxed mb-4 relative z-10 line-clamp-4" :title="quote.text">"{{ quote.text }}"</p>
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <span class="text-sm text-muted">- {{ quote.author }}</span>
      <span class="text-sm text-forest font-medium text-right">{{ quote.jp }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quote: { type: Object, required: true }
});
</script>
