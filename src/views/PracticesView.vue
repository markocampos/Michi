<template>
  <div class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16">
    <h1 class="text-2xl font-bold text-charcoal mb-2 lg:text-4xl">Practices</h1>
    <p class="text-sm text-muted mb-6">Choose your path for today</p>

    <!-- Search -->
    <div class="relative mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search practices..."
        aria-label="Search practices"
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

    <!-- Category filters -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="activeCategory = cat.value"
        :aria-pressed="activeCategory === cat.value"
        class="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeCategory === cat.value ? 'bg-forest text-white shadow-sm' : 'glass border border-gray-100/50 text-muted hover:text-charcoal'"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6 stagger">
      <PracticeCard
        v-for="practice in filteredPractices"
        :key="practice.id"
        :practice="practice"
        :done-today="isDoneToday(practice.id)"
        class="animate-fade-in-up"
      />
    </div>

    <div v-if="filteredPractices.length === 0" class="text-center mt-12">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:search" class="w-10 h-10 text-muted" />
      </div>
      <p class="font-semibold text-charcoal mb-1">No practices found</p>
      <p class="text-sm text-muted">Try a different search or category.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import PracticeCard from '../components/PracticeCard.vue';
import { allPractices } from '../data/practices.js';
import { readJson } from '../composables/useStorage.js';
import { getToday } from '../utils/dates.js';
import { getStorageKey } from '../utils/storage-keys.js';

const today = getToday();
const searchQuery = ref('');
const activeCategory = ref('all');

const categories = [
  { value: 'all', label: 'All' },
  { value: 'reflection', label: 'Reflection' },
  { value: 'activity', label: 'Activity' },
  { value: 'tracking', label: 'Tracking' },
];

const practiceCategories = {
  ikigai: 'reflection',
  wabisabi: 'reflection',
  ma: 'activity',
  kaizen: 'tracking',
  shinrin: 'activity',
  gaman: 'tracking',
  hansei: 'reflection',
  mononoaware: 'reflection',
  oubaitori: 'reflection',
};

const filteredPractices = computed(() => {
  return allPractices.filter(p => {
    const matchesSearch = !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.jp.includes(searchQuery.value) ||
      p.desc.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = activeCategory.value === 'all' ||
      practiceCategories[p.id] === activeCategory.value;
    return matchesSearch && matchesCategory;
  });
});

function isDoneToday(id) {
  try {
    const data = readJson(getStorageKey(id), null);
    if (!data) return false;
    if (data.entries) return data.entries.some(e => e.date === today);
    if (data.walks) return data.walks.some(w => w.date === today);
    if (data.sessions) return data.sessions.some(s => s.date === today);
    if (data.reflections) return data.reflections.some(r => r.date === today);
    if (data.habits) return data.habits.some(h => h.completedDates && h.completedDates.includes(today));
    if (data.challenges) return data.challenges.some(c => c.completedDates && c.completedDates.includes(today));
    return false;
  } catch { return false; }
}
</script>
