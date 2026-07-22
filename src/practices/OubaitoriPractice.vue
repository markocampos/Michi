<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:flower" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Oubaitori</h1>
      <p class="text-sm text-muted mt-1">桜梅桃李 - Embrace your unique timeline</p>
    </div>

    <DailyPrompt practiceId="oubaitori" />

    <div v-if="!showSummary" class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <div class="mb-4">
          <label for="comparison" class="block text-sm font-medium text-forest mb-2">
            Who or what are you comparing yourself to right now?
          </label>
          <textarea
            ref="inputRef"
            id="comparison"
            v-model="comparisonText"
            placeholder="I have been comparing myself to..."
            class="w-full h-20 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
          />
        </div>

        <div class="mb-4">
          <label for="reframe" class="block text-sm font-medium text-forest mb-2">
            How are you blooming in your own unique way?
          </label>
          <textarea
            id="reframe"
            v-model="reframeText"
            placeholder="I am on my own path, and..."
            class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
          />
        </div>

        <button
          @click="save"
          :disabled="!comparisonText.trim() && !reframeText.trim()"
          class="w-full py-3 mt-2 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors shadow-sm"
        >
          Save Reflection
        </button>
      </div>
    </div>

    <div v-else class="text-center mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Your Unique Bloom</p>
        <div class="text-left mb-4 space-y-4">
          <div v-if="lastComparison">
            <p class="text-xs text-muted mb-1 uppercase font-bold tracking-wider">Comparison</p>
            <p class="text-charcoal whitespace-pre-wrap">{{ lastComparison }}</p>
          </div>
          <div v-if="lastReframe">
            <p class="text-xs text-muted mb-1 uppercase font-bold tracking-wider">Reframe</p>
            <p class="text-charcoal whitespace-pre-wrap font-serif italic border-l-2 border-forest/30 pl-3 py-1">{{ lastReframe }}</p>
          </div>
        </div>
      </div>
      
      <button
        @click="reset"
        class="mt-6 px-6 py-2 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Reflect Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';
import DailyPrompt from '../components/DailyPrompt.vue';

const data = useStorage('michi_oubaitori', { entries: [] });
const { showToast } = useToast();

const comparisonText = ref('');
const reframeText = ref('');
const showSummary = ref(false);
const inputRef = ref(null);

const lastComparison = ref('');
const lastReframe = ref('');

function save() {
  if (!comparisonText.value.trim() && !reframeText.value.trim()) return;

  const date = new Date().toISOString().split('T')[0];
  
  data.value.entries.unshift({
    id: Date.now(),
    date,
    comparison: comparisonText.value.trim(),
    reframe: reframeText.value.trim()
  });

  lastComparison.value = comparisonText.value.trim();
  lastReframe.value = reframeText.value.trim();

  comparisonText.value = '';
  reframeText.value = '';
  
  showToast('Reflection saved', 'success');
  triggerHaptic();
  
  showSummary.value = true;
}

function reset() {
  showSummary.value = false;
  lastComparison.value = '';
  lastReframe.value = '';
  setTimeout(() => {
    inputRef.value?.focus();
  }, 100);
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus();
    setTimeout(() => {
      inputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
});
</script>
