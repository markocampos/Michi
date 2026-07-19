<template>
  <div
    class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16"
  >
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

    <div v-for="group in groupedEntries" :key="group.monthYear" class="mb-10">
      <div class="flex items-center gap-3 mb-5">
        <h2 class="text-lg font-bold text-charcoal">{{ group.monthYear }}</h2>
        <div class="h-px bg-gray-200 flex-1"></div>
      </div>
      
      <div class="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <div v-for="entry in group.entries" :key="entry.id" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3 border-b border-gray-100/50 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md" :class="typeClasses[entry.type]">
                {{ typeLabels[entry.type] }}
              </span>
              <button
                @click="exportEntry(entry)"
                class="text-muted hover:text-forest transition-colors p-1"
                aria-label="Export Card"
                title="Export as Image"
              >
                <Icon icon="lucide:image" class="w-4 h-4" />
              </button>
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
    </div>

    <!-- Load More -->
    <div v-if="filteredEntries.length > paginatedEntries.length" class="text-center mt-8 pb-8">
      <button
        @click="loadMore"
        class="px-8 py-3 bg-gray-100 text-charcoal rounded-full text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm"
      >
        Load More
      </button>
    </div>

    <!-- Insights Modal -->
    <JournalInsightsModal
      v-if="showInsightsModal"
      :entries="allEntries"
      @close="showInsightsModal = false"
    />

    <!-- Hidden Export Template -->
    <div
      v-if="exportingEntry"
      ref="exportTemplate"
      class="absolute top-0 left-0 w-[1080px] min-h-[1080px] flex flex-col items-center justify-center p-20 pointer-events-none"
      style="z-index: -9999; background: linear-gradient(135deg, #FAFAF8 0%, #E8E8E2 100%);"
    >
      <div class="mb-12 text-center shrink-0">
        <Icon icon="lucide:wind" class="w-16 h-16 text-forest mx-auto mb-4" />
        <h2 class="text-4xl font-bold text-charcoal tracking-widest uppercase">{{ typeLabels[exportingEntry.type] }}</h2>
        <p class="text-xl text-forest mt-2 font-medium">{{ formatDate(exportingEntry.date) }}</p>
      </div>
      
      <div class="bg-white/80 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl border border-white/50 w-full max-w-[800px] shrink-0">
        <Icon icon="lucide:quote" class="w-12 h-12 text-forest/30 mb-6" />
        <p class="text-4xl leading-tight text-charcoal font-medium whitespace-pre-wrap break-words" :class="['ikigai', 'hansei'].includes(exportingEntry.type) ? '' : 'italic'">
          <template v-if="!['ikigai', 'hansei'].includes(exportingEntry.type)">"{{ exportingEntry.text }}"</template>
          <template v-else>{{ exportingEntry.text }}</template>
        </p>
        
        <div v-if="exportingEntry.secondary" class="mt-12 pt-12 border-t-2 border-forest/10">
          <span class="text-lg uppercase font-bold text-forest tracking-widest block mb-4">{{ exportingEntry.secondaryLabel }}</span>
          <p class="text-2xl leading-relaxed text-charcoal/80 whitespace-pre-wrap break-words">{{ exportingEntry.secondary }}</p>
        </div>
      </div>
      <div class="mt-auto pt-16 flex items-center justify-center opacity-90 shrink-0">
        <img src="/logo-foreground.svg" class="h-40" style="height: 160px; width: auto; object-fit: contain;" alt="Michi Logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { readJson } from '../composables/useStorage.js';
import { formatDate as formatDateUtil } from '../utils/dates.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import JournalInsightsModal from '../components/JournalInsightsModal.vue';
import { toPng } from 'html-to-image';

const activeFilter = ref('all');
const searchQuery = ref('');
const showInsightsModal = ref(false);
const displayLimit = ref(20);
const exportingEntry = ref(null);
const exportTemplate = ref(null);

import { useToast } from '../composables/useToast.js';
const { showToast } = useToast();

async function exportEntry(entry) {
  exportingEntry.value = entry;
  showToast('Generating beautiful card...', 'info');
  
  await nextTick();
  setTimeout(async () => {
    try {
      if (!exportTemplate.value) return;
      const dataUrl = await toPng(exportTemplate.value, { 
        cacheBust: true,
        width: 1080,
        pixelRatio: 1
      });
      
      const link = document.createElement('a');
      link.download = `michi-${entry.type}-${entry.date}.png`;
      link.href = dataUrl;
      link.click();
      
      showToast('Card saved to your device!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export card.', 'error');
    } finally {
      exportingEntry.value = null;
    }
  }, 800);
}

const filters = [
  { value: 'all', label: 'All' },
  { value: 'wabisabi', label: 'Wabi-sabi' },
  { value: 'mononoaware', label: 'Mono no aware' },
  { value: 'ikigai', label: 'Ikigai' }
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

function formatMonthYear(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function loadMore() {
  displayLimit.value += 20;
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

const paginatedEntries = computed(() => {
  return filteredEntries.value.slice(0, displayLimit.value);
});

const groupedEntries = computed(() => {
  const result = [];
  paginatedEntries.value.forEach(entry => {
    const monthYear = formatMonthYear(entry.date);
    let group = result.find(g => g.monthYear === monthYear);
    if (!group) {
      group = { monthYear, entries: [] };
      result.push(group);
    }
    group.entries.push(entry);
  });
  return result;
});
</script>
