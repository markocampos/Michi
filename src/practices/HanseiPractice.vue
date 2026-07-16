<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:scan-eye" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Hansei</h1>
      <p class="text-sm text-muted mt-1">反省 - Self-reflection</p>
    </div>

    <div v-if="!editing">
      <button
        @click="startNew"
        class="w-full py-4 glass rounded-2xl shadow-sm border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all mb-6 flex items-center justify-center gap-2"
      >
        <Icon icon="lucide:plus" class="w-5 h-5" />
        New Reflection
      </button>
    </div>

    <div v-else class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-2 mb-4">
          <Icon icon="lucide:clipboard-list" class="w-5 h-5 text-forest" />
          <p class="text-sm font-medium text-forest">End-of-day reflection</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:thumbs-up" class="w-4 h-4 text-forest" />
              What went well today?
            </label>
            <label for="went-well-input" class="sr-only">What went well today</label>
            <textarea
              id="went-well-input"
              v-model="wentWell"
              placeholder="List your accomplishments, wins, or positive moments..."
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:alert-circle" class="w-4 h-4 text-earth" />
              What could be improved?
            </label>
            <label for="to-improve-input" class="sr-only">What could be improved</label>
            <textarea
              id="to-improve-input"
              v-model="toImprove"
              placeholder="What challenges did you face? What would you do differently?"
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:lightbulb" class="w-4 h-4 text-torii" />
              What did I learn?
            </label>
            <label for="learned-input" class="sr-only">What did I learn</label>
            <textarea
              id="learned-input"
              v-model="learned"
              placeholder="Any insights, realizations, or knowledge gained..."
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button
            @click="cancel"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="save"
            :disabled="!wentWell.trim() && !toImprove.trim() && !learned.trim()"
            class="flex-1 py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useStorage } from '../composables/useStorage.js';

const data = useStorage('michi_hansei', { reflections: [] });
const editing = ref(false);
const wentWell = ref('');
const toImprove = ref('');
const learned = ref('');

function startNew() {
  editing.value = true;
}

function cancel() {
  editing.value = false;
  wentWell.value = '';
  toImprove.value = '';
  learned.value = '';
}

function save() {
  if (!wentWell.value.trim() && !toImprove.value.trim() && !learned.value.trim()) return;
  data.value.reflections.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    wentWell: wentWell.value.trim(),
    toImprove: toImprove.value.trim(),
    learned: learned.value.trim(),
  });
  editing.value = false;
  wentWell.value = '';
  toImprove.value = '';
  learned.value = '';
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

const thisWeekCount = computed(() => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return data.value.reflections.filter(r => {
    const d = new Date(r.date + 'T00:00:00');
    return d >= weekAgo;
  }).length;
});

const currentStreak = computed(() => {
  let count = 0;
  let date = new Date();
  const dates = data.value.reflections.map(r => r.date);
  for (let i = 0; i < 365; i++) {
    const d = date.toISOString().split('T')[0];
    if (dates.includes(d)) {
      count++;
    } else if (i > 0) {
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  return count;
});
</script>
