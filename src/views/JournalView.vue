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

    <!-- Search & Insights -->
    <div class="flex gap-2 mb-4">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search journal entries..."
          aria-label="Search journal entries"
          class="w-full px-4 py-3 glass rounded-xl border border-gray-100/50 text-charcoal placeholder-muted focus:outline-none focus:border-forest transition-colors"
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
      <button
        @click="showInsightsModal = true"
        class="px-4 py-3 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
      >
        <Icon icon="lucide:brain-circuit" class="w-4 h-4" />
        <span class="hidden sm:inline">Insights</span>
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

    <div class="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      <div v-for="entry in filteredEntries" :key="entry.id" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-3 border-b border-gray-100/50 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md" :class="typeClasses[entry.type]">
              {{ typeLabels[entry.type] }}
            </span>
          </div>
          <span class="text-xs font-medium text-muted bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100/50">{{ formatDate(entry.date) }}</span>
        </div>
        <div class="pl-3 border-l-2 border-forest/30 my-3">
          <p class="text-charcoal text-sm leading-relaxed text-gray-700 whitespace-pre-wrap" :class="['ikigai', 'hansei'].includes(entry.type) ? '' : 'italic'">
            <template v-if="!['ikigai', 'hansei'].includes(entry.type)">"{{ entry.text }}"</template>
            <template v-else>{{ entry.text }}</template>
          </p>
        </div>
        <div v-if="entry.secondary" class="mt-4 flex flex-col gap-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100/50">
          <span class="text-[10px] uppercase font-bold text-muted tracking-wider">{{ entry.secondaryLabel }}</span>
          <p class="text-charcoal text-sm leading-relaxed">{{ entry.secondary }}</p>
        </div>
      </div>
    </div>

    <!-- Insights Modal -->
    <JournalInsightsModal
      v-if="showInsightsModal"
      :entries="allEntries"
      @close="showInsightsModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { readJson } from '../composables/useStorage.js';
import { formatDate as formatDateUtil } from '../utils/dates.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import { usePullToRefresh } from '../composables/usePullToRefresh.js';
import JournalInsightsModal from '../components/JournalInsightsModal.vue';

async function refreshData() {
  await new Promise(r => setTimeout(r, 500));
  window.location.reload();
}

const { isRefreshing, pullDistance, isPulling, handlers: pullHandlers } = usePullToRefresh(refreshData);

const activeFilter = ref('all');
const searchQuery = ref('');
const showInsightsModal = ref(false);

const filters = [
  { value: 'all', label: 'All' },
  { value: 'wabisabi', label: 'Wabi-sabi' },
  { value: 'mononoaware', label: 'Mono no aware' },
  { value: 'ikigai', label: 'Ikigai' },
  { value: 'hansei', label: 'Hansei' },
];

const typeClasses = {
  wabisabi: 'bg-earth/20 text-earth-dark',
  mononoaware: 'bg-torii/10 text-torii',
  ikigai: 'bg-forest/20 text-forest-dark',
  hansei: 'bg-gray-500/10 text-gray-700',
};

const typeLabels = {
  wabisabi: 'Wabi-sabi',
  mononoaware: 'Mono no aware',
  ikigai: 'Ikigai',
  hansei: 'Hansei',
};

function formatDate(dateStr) {
  return formatDateUtil(dateStr);
}

const allEntries = computed(() => {
  const entries = [];

  try {
    const wb = readJson(STORAGE_KEYS.wabisabi, { entries: [] });
    (wb.entries || []).forEach(e => entries.push({ id: e.id, type: 'wabisabi', date: e.date, text: e.text, rawText: e.text }));
  } catch {}

  try {
    const ma = readJson(STORAGE_KEYS.mononoaware, { entries: [] });
    (ma.entries || []).forEach(e => entries.push({
      id: e.id, type: 'mononoaware', date: e.date,
      text: e.gratitude || '',
      secondary: e.impermanence,
      secondaryLabel: 'Impermanence',
      rawText: (e.gratitude || '') + ' ' + (e.impermanence || ''),
    }));
  } catch {}

  try {
    const ik = readJson(STORAGE_KEYS.ikigai, { reflections: [] });
    (ik.reflections || []).forEach(r => {
      let formattedText = [];
      if (r.love) formattedText.push(`• Love: ${r.love}`);
      if (r.goodAt) formattedText.push(`• Good At: ${r.goodAt}`);
      if (r.worldNeeds) formattedText.push(`• World Needs: ${r.worldNeeds}`);
      if (r.paidFor) formattedText.push(`• Paid For: ${r.paidFor}`);
      
      let text = formattedText.length > 0 
        ? formattedText.join('\n\n') 
        : (r.insight || '').split(' | ').filter(Boolean).map(item => `• ${item}`).join('\n\n');
        
      let rawText = [r.love, r.goodAt, r.worldNeeds, r.paidFor].some(Boolean)
        ? [r.love, r.goodAt, r.worldNeeds, r.paidFor].filter(Boolean).join(' ')
        : (r.insight || '').replace(/ \| /g, ' ');
        
      entries.push({ id: r.id, type: 'ikigai', date: r.date, text, rawText });
    });
  } catch {}

  try {
    const hn = readJson(STORAGE_KEYS.hansei, { reflections: [] });
    (hn.reflections || []).forEach(r => {
      let formattedText = [];
      if (r.wentWell) formattedText.push(`• Went Well: ${r.wentWell}`);
      if (r.toImprove) formattedText.push(`• To Improve: ${r.toImprove}`);
      if (r.learned) formattedText.push(`• Learned: ${r.learned}`);
      
      let text = formattedText.length > 0 ? formattedText.join('\n\n') : '';
      let rawText = [r.wentWell, r.toImprove, r.learned].filter(Boolean).join(' ');
      
      if (text) {
        entries.push({ id: r.id, type: 'hansei', date: r.date, text, rawText });
      }
    });
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
