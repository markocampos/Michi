<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:leaf" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Wabi-sabi</h1>
      <p class="text-sm text-muted mt-1">侘寂 - Beauty in imperfection</p>
    </div>

    <div v-if="!editing">
      <button
        @click="startNew"
        class="w-full py-4 glass rounded-2xl shadow-sm border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all mb-6"
      >
        + New Entry
      </button>
    </div>

    <div v-else class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <p class="text-sm text-muted italic mb-4">"Once saved, this entry cannot be edited — embrace the imperfection."</p>
        <p class="text-sm text-forest mb-3">{{ currentPrompt }}</p>
        <label for="wabisabi-entry" class="sr-only">Write about an imperfection you embrace today</label>
        <textarea
          id="wabisabi-entry"
          v-model="newText"
          placeholder="Write about an imperfection you embrace today..."
          class="w-full h-32 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
        />
        <div class="flex gap-3 mt-4">
          <button
            @click="cancel"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="save"
            :disabled="!newText.trim()"
            class="flex-1 py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors"
          >
            Save Forever
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { wabisabiPrompts } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';

const data = useStorage('michi_wabisabi', { entries: [] });
const editing = ref(false);
const newText = ref('');
const currentPrompt = ref('');

function startNew() {
  currentPrompt.value = wabisabiPrompts[Math.floor(Math.random() * wabisabiPrompts.length)];
  editing.value = true;
}

function cancel() {
  editing.value = false;
  newText.value = '';
}

function save() {
  if (!newText.value.trim()) return;
  data.value.entries.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    text: newText.value.trim(),
  });
  editing.value = false;
  newText.value = '';
}
</script>
