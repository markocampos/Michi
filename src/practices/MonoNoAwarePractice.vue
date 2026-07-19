<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:flower-2" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Mono no aware</h1>
      <p class="text-sm text-muted mt-1">物の哀れ - Awareness of impermanence</p>
      <div class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium" :style="{ backgroundColor: season.color + '30', color: season.color }">
        {{ season.jp }} {{ season.en }}
      </div>
    </div>

    <div v-if="!showSummary" class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <p class="text-sm text-forest mb-3">{{ currentPrompt }}</p>
        <label for="gratitude-input" class="sr-only">Gratitude reflection</label>
        <textarea
          ref="inputRef"
          id="gratitude-input"
          v-model="gratitude"
          placeholder="What are you grateful for..."
          class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors mb-3"
        />
        <label for="impermanence-input" class="sr-only">Impermanence reflection</label>
        <textarea
          id="impermanence-input"
          v-model="impermanence"
          placeholder="What impermanence taught you today..."
          class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
        />
        <div class="flex gap-3 mt-4">
          <button @click="save" :disabled="!gratitude.trim() && !impermanence.trim()" class="w-full py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors">Save</button>
        </div>
      </div>
    </div>

    <div v-else class="text-center mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Your Reflection on Impermanence</p>
        
        <div v-if="lastEntry.gratitude" class="text-left mb-4">
          <p class="text-xs text-muted mb-1 flex items-center gap-1"><Icon icon="lucide:heart" class="w-3 h-3 text-torii" /> Gratitude</p>
          <p class="text-charcoal whitespace-pre-wrap">{{ lastEntry.gratitude }}</p>
        </div>
        
        <div v-if="lastEntry.impermanence" class="text-left mb-4">
          <p class="text-xs text-muted mb-1 flex items-center gap-1"><Icon icon="lucide:wind" class="w-3 h-3 text-forest" /> Impermanence</p>
          <p class="text-charcoal whitespace-pre-wrap">{{ lastEntry.impermanence }}</p>
        </div>
      </div>
      
      <p class="text-sm text-muted italic">"Mono no aware is the gentle sadness of things passing, and the deep appreciation of their fleeting beauty."</p>

      <button
        @click="resetPractice"
        class="mt-6 px-6 py-2 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Write Another
      </button>
    </div>

  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { mononoawarePrompts, getSeason } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';

const data = useStorage('michi_mononoaware', { entries: [] });
const { showToast } = useToast();
const gratitude = ref('');
const impermanence = ref('');
const currentPrompt = ref(mononoawarePrompts[Math.floor(Math.random() * mononoawarePrompts.length)]);
const season = getSeason();
const inputRef = ref(null);
const showSummary = ref(false);
const lastEntry = ref(null);

function focusAndScroll() {
  if (inputRef.value) {
    inputRef.value.focus();
    setTimeout(() => {
      inputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}

onMounted(() => {
  focusAndScroll();
});

function save() {
  if (!gratitude.value.trim() && !impermanence.value.trim()) return;
  
  const entryData = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    gratitude: gratitude.value.trim(),
    impermanence: impermanence.value.trim(),
    season: getSeason(),
  };

  data.value.entries.unshift(entryData);
  lastEntry.value = entryData;
  
  gratitude.value = '';
  impermanence.value = '';
  currentPrompt.value = mononoawarePrompts[Math.floor(Math.random() * mononoawarePrompts.length)];
  showToast('Reflection saved', 'success');
  triggerHaptic();
  
  showSummary.value = true;
}

function resetPractice() {
  showSummary.value = false;
  nextTick(() => {
    focusAndScroll();
  });
}
</script>
