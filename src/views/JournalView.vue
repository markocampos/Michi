<template>
  <div class="px-5 pt-12 pb-8 lg:px-12 lg:pt-16">
    <h1 class="text-2xl font-bold text-charcoal mb-2 lg:text-4xl">Journal</h1>
    <p class="text-sm text-muted mb-6">Your reflections over time</p>

    <div class="flex gap-2 mb-6 overflow-x-auto">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="activeFilter = f.value"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeFilter === f.value ? 'bg-forest text-white shadow-sm' : 'glass border border-gray-100/50 text-muted hover:text-charcoal'"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="filteredEntries.length === 0" class="text-center text-muted mt-12">
      <p class="text-4xl mb-3">📖</p>
      <p class="font-medium">No journal entries yet.</p>
      <p class="text-sm mt-1">Complete a practice to start your journal.</p>
    </div>

    <div class="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      <div v-for="entry in filteredEntries" :key="entry.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="typeClasses[entry.type]">
            {{ typeLabels[entry.type] }}
          </span>
          <span class="text-xs text-muted">{{ formatDate(entry.date) }}</span>
        </div>
        <p class="text-charcoal text-sm leading-relaxed">{{ entry.text }}</p>
        <p v-if="entry.secondary" class="text-charcoal text-sm mt-2 leading-relaxed">
          <span class="text-muted">{{ entry.secondaryLabel }}:</span> {{ entry.secondary }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { readJson } from '../composables/useStorage.js';

const activeFilter = ref('all');

const filters = [
  { value: 'all', label: 'All' },
  { value: 'wabisabi', label: 'Wabi-sabi' },
  { value: 'mononoaware', label: 'Mono no aware' },
  { value: 'ikigai', label: 'Ikigai' },
];

const typeClasses = {
  wabisabi: 'bg-earth/20 text-earth-dark',
  mononoaware: 'bg-pink-100 text-pink-700',
  ikigai: 'bg-forest/20 text-forest-dark',
};

const typeLabels = {
  wabisabi: 'Wabi-sabi',
  mononoaware: 'Mono no aware',
  ikigai: 'Ikigai',
};

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

const allEntries = computed(() => {
  const entries = [];

  try {
    const wb = readJson('michi_wabisabi', { entries: [] });
    (wb.entries || []).forEach(e => entries.push({ id: e.id, type: 'wabisabi', date: e.date, text: e.text }));
  } catch {}

  try {
    const ma = readJson('michi_mononoaware', { entries: [] });
    (ma.entries || []).forEach(e => entries.push({
      id: e.id, type: 'mononoaware', date: e.date,
      text: e.gratitude || '',
      secondary: e.impermanence,
      secondaryLabel: 'Impermanence',
    }));
  } catch {}

  try {
    const ik = readJson('michi_ikigai', { reflections: [] });
    (ik.reflections || []).forEach(r => entries.push({
      id: r.id, type: 'ikigai', date: r.date, text: r.insight || r.love || '',
    }));
  } catch {}

  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const filteredEntries = computed(() => {
  if (activeFilter.value === 'all') return allEntries.value;
  return allEntries.value.filter(e => e.type === activeFilter.value);
});
</script>
