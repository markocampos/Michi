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

    <div v-if="!editing">
      <button
        @click="startNew"
        class="w-full py-4 glass rounded-2xl shadow-sm border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all mb-6"
      >
        + New Reflection
      </button>
    </div>

    <div v-else class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <p class="text-sm text-forest mb-3">{{ currentPrompt }}</p>
        <label for="gratitude-input" class="sr-only">Gratitude reflection</label>
        <textarea
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
          <button @click="cancel" class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="save" :disabled="!gratitude.trim() && !impermanence.trim()" class="flex-1 py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors">Save</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { mononoawarePrompts, getSeason } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';

const data = useStorage('michi_mononoaware', { entries: [] });
const editing = ref(false);
const gratitude = ref('');
const impermanence = ref('');
const currentPrompt = ref('');
const season = getSeason();

function startNew() {
  currentPrompt.value = mononoawarePrompts[Math.floor(Math.random() * mononoawarePrompts.length)];
  editing.value = true;
}

function cancel() {
  editing.value = false;
  gratitude.value = '';
  impermanence.value = '';
}

function save() {
  if (!gratitude.value.trim() && !impermanence.value.trim()) return;
  data.value.entries.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    gratitude: gratitude.value.trim(),
    impermanence: impermanence.value.trim(),
    season: getSeason(),
  });
  editing.value = false;
  gratitude.value = '';
  impermanence.value = '';
}
</script>
