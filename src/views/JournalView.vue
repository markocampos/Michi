<template>
  <div
    class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16"
    v-on="pullHandlers"
  >
    <!-- Pull to refresh indicator -->
    <div
      class="flex justify-center overflow-hidden transition-all duration-300"
      :style="{ height: isPulling ? `${Math.min(pullDistance, 40)}px` : isRefreshing ? '40px' : '0px' }"
    >
      <div class="flex items-center gap-2 text-forest">
        <Icon
          icon="lucide:refresh-cw"
          class="w-5 h-5"
          :class="isRefreshing ? 'animate-spin' : pullDistance >= 80 ? 'rotate-180' : ''"
          :style="{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined }"
        />
        <span class="text-xs font-medium">{{ isRefreshing ? 'Refreshing...' : pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh' }}</span>
      </div>
    </div>
    <h1 class="text-2xl font-bold text-charcoal mb-2 md:text-3xl lg:text-4xl">Journal</h1>
    <p class="text-sm text-muted mb-6">Your reflections over time</p>

    <!-- Search -->
    <div class="relative mb-4">
      <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search journal entries..."
        aria-label="Search journal entries"
        class="w-full pl-10 pr-4 py-3 glass rounded-xl border border-gray-100/50 text-charcoal placeholder-muted focus:outline-none focus:border-forest transition-colors"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        aria-label="Clear search"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors"
      >
        <Icon icon="lucide:x" class="w-4 h-4" />
      </button>
    </div>

    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="activeFilter = f.value"
        :aria-pressed="activeFilter === f.value"
        :aria-label="`Filter by ${f.label}`"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeFilter === f.value ? 'bg-forest text-white shadow-sm' : 'glass border border-gray-100/50 text-muted hover:text-charcoal'"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="allEntries.length === 0" class="text-center mt-12">
      <div class="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:book-open" class="w-10 h-10 text-forest" />
      </div>
      <p class="font-semibold text-charcoal mb-1">No journal entries yet</p>
      <p class="text-sm text-muted mb-4">Complete a practice to start your journal.</p>
      <router-link to="/practices" class="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors">
        <Icon icon="lucide:plus" class="w-4 h-4" />
        Start a practice
      </router-link>
    </div>

    <div v-if="allEntries.length > 0 && filteredEntries.length === 0" class="text-center mt-12">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:search" class="w-10 h-10 text-muted" />
      </div>
      <p class="font-semibold text-charcoal mb-1">No matching entries</p>
      <p class="text-sm text-muted">Try a different search or filter.</p>
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
import { Icon } from '@iconify/vue';
import { readJson } from '../composables/useStorage.js';
import { formatDate as formatDateUtil } from '../utils/dates.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import { usePullToRefresh } from '../composables/usePullToRefresh.js';

async function refreshData() {
  await new Promise(r => setTimeout(r, 500));
  window.location.reload();
}

const { isRefreshing, pullDistance, isPulling, handlers: pullHandlers } = usePullToRefresh(refreshData);

const activeFilter = ref('all');
const searchQuery = ref('');

const filters = [
  { value: 'all', label: 'All' },
  { value: 'wabisabi', label: 'Wabi-sabi' },
  { value: 'mononoaware', label: 'Mono no aware' },
  { value: 'ikigai', label: 'Ikigai' },
];

const typeClasses = {
  wabisabi: 'bg-earth/20 text-earth-dark',
  mononoaware: 'bg-torii/10 text-torii',
  ikigai: 'bg-forest/20 text-forest-dark',
};

const typeLabels = {
  wabisabi: 'Wabi-sabi',
  mononoaware: 'Mono no aware',
  ikigai: 'Ikigai',
};

function formatDate(dateStr) {
  return formatDateUtil(dateStr);
}

const allEntries = computed(() => {
  const entries = [];

  try {
    const wb = readJson(STORAGE_KEYS.wabisabi, { entries: [] });
    (wb.entries || []).forEach(e => entries.push({ id: e.id, type: 'wabisabi', date: e.date, text: e.text }));
  } catch {}

  try {
    const ma = readJson(STORAGE_KEYS.mononoaware, { entries: [] });
    (ma.entries || []).forEach(e => entries.push({
      id: e.id, type: 'mononoaware', date: e.date,
      text: e.gratitude || '',
      secondary: e.impermanence,
      secondaryLabel: 'Impermanence',
    }));
  } catch {}

  try {
    const ik = readJson(STORAGE_KEYS.ikigai, { reflections: [] });
    (ik.reflections || []).forEach(r => entries.push({
      id: r.id, type: 'ikigai', date: r.date, text: r.insight || r.love || '',
    }));
  } catch {}

  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const filteredEntries = computed(() => {
  let entries = allEntries.value;

  // Filter by type
  if (activeFilter.value !== 'all') {
    entries = entries.filter(e => e.type === activeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    entries = entries.filter(e =>
      e.text?.toLowerCase().includes(query) ||
      e.secondary?.toLowerCase().includes(query)
    );
  }

  return entries;
});
</script>
