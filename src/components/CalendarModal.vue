<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background: rgba(45, 45, 45, 0.4); backdrop-filter: blur(4px);">
        <div class="bg-warm-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100/50 overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-5 md:p-6 flex items-center justify-between border-b border-gray-100/50 bg-white">
            <div>
              <h2 class="text-xl font-bold text-charcoal flex items-center gap-2">
                <Icon icon="lucide:calendar-days" class="w-6 h-6 text-forest" />
                Annual Activity
              </h2>
              <p class="text-xs text-muted mt-1">Your practice rhythm over the last year</p>
            </div>
            <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-muted hover:text-charcoal hover:bg-gray-100 transition-colors" aria-label="Close">
              <Icon icon="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          
          <div class="p-5 md:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-white to-warm-white">
            <AnnualActivity />

            <!-- Scroll hint -->
            <div class="flex items-center justify-center gap-2 mt-5 text-muted/50 select-none pointer-events-none">
              <Icon icon="lucide:arrow-left" class="w-3.5 h-3.5 animate-bounce-x" />
              <span class="text-[10px] font-bold uppercase tracking-widest">Scroll to explore</span>
              <Icon icon="lucide:arrow-right" class="w-3.5 h-3.5 animate-bounce-x-reverse" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import AnnualActivity from './AnnualActivity.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>
