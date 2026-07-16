<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
      <div
        class="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="xp-info-title"
      >
        <div class="p-6 pb-4 border-b border-gray-100/50 flex-shrink-0 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
              <Icon icon="lucide:sparkles" class="w-5 h-5 text-forest" />
            </div>
            <div>
              <h2 id="xp-info-title" class="text-xl font-bold text-charcoal">Zen Journey</h2>
              <p class="text-xs text-muted font-medium tracking-widest uppercase">Experience (XP)</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-muted hover:text-charcoal transition-colors">
            <Icon icon="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <p class="text-sm text-charcoal/80 leading-relaxed">
            Your Zen Journey represents your lifelong dedication to growth. As you complete practices, you earn Experience (XP) and progress through stages—from a newly planted Seed to a vast Zen Garden.
          </p>
          
          <div class="space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted">How to earn XP</h3>
            
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon icon="lucide:infinity" class="w-4 h-4 text-forest" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-charcoal">Permanent XP</h4>
                <p class="text-xs text-muted mt-0.5 leading-relaxed">Earned forever for every minute meditated, every forest walk, and every journal entry you write.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-earth/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon icon="lucide:flame" class="w-4 h-4 text-earth-dark" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-charcoal">Streak Bonus (Temporary)</h4>
                <p class="text-xs text-muted mt-0.5 leading-relaxed">Your active streak grants a massive +20 XP per day. If you break your streak, your total XP will drop slightly as you lose this active bonus.</p>
              </div>
            </div>
          </div>
          
          <button
            @click="$emit('close')"
            class="w-full py-3 rounded-xl bg-forest text-white font-medium hover:bg-forest-dark transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

defineEmits(['close']);

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>
