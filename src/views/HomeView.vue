<template>
  <div class="px-5 pt-12 pb-8 lg:px-12 lg:pt-16">
    <div class="mb-8 lg:mb-12">
      <p class="text-sm text-muted mb-1">{{ greeting.jp }}</p>
      <h1 class="text-2xl font-bold text-charcoal lg:text-4xl">{{ greeting.en }}</h1>
      <p class="text-sm text-forest mt-1">道 - Your path to mindfulness</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div>
        <div class="flex justify-center mb-8">
          <ProgressRing :progress="dailyProgress" :size="140">
            <div class="text-center">
              <span class="text-2xl font-bold text-charcoal">{{ completedCount }}</span>
              <span class="text-sm text-muted block">/ 7</span>
            </div>
          </ProgressRing>
        </div>
        <p class="text-center text-sm text-muted -mt-5 mb-8">practices today</p>

        <QuoteCard :quote="currentQuote" class="mb-8" />

        <div v-if="streak > 0" class="bg-forest/10 rounded-2xl p-4 text-center">
          <p class="text-2xl font-bold text-forest">{{ streak }} 🔥</p>
          <p class="text-sm text-forest-dark">day streak</p>
        </div>
      </div>

      <div>
        <div v-if="incompletePractices.length > 0" class="mb-6">
          <h2 class="text-lg font-semibold text-charcoal mb-4">Continue your journey</h2>
          <div class="space-y-3">
            <router-link
              v-for="practice in incompletePractices"
              :key="practice.id"
              :to="`/practice/${practice.id}`"
              class="flex items-center gap-4 glass rounded-xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <span class="text-2xl group-hover:scale-110 transition-transform">{{ practice.icon }}</span>
              <div class="flex-1">
                <h3 class="font-medium text-charcoal">{{ practice.name }}</h3>
                <p class="text-xs text-muted">{{ practice.jp }}</p>
              </div>
              <svg class="w-5 h-5 text-muted group-hover:text-forest transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>

        <div v-if="completedCount === 7" class="glass rounded-2xl p-5 text-center shadow-sm border border-gray-100/50 mb-6">
          <p class="text-3xl mb-2">🎉</p>
          <p class="font-semibold text-charcoal">All practices complete!</p>
          <p class="text-sm text-muted mt-1">You've walked your full path today.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressRing from '../components/ProgressRing.vue';
import QuoteCard from '../components/QuoteCard.vue';
import { useQuote } from '../composables/useQuote.js';
import { useStorage, safeReadArray, readJson } from '../composables/useStorage.js';
import { allPractices } from '../data/practices.js';

const { currentQuote, getGreeting } = useQuote();
const greeting = getGreeting();

const kaizenData = useStorage('michi_kaizen', { habits: [] });
const gamanData = useStorage('michi_gaman', { challenges: [] });

const today = new Date().toISOString().split('T')[0];

const completedCount = computed(() => {
  let count = 0;
  if (kaizenData.value.habits.some(h => h.completedDates && h.completedDates.includes(today))) count++;
  if (gamanData.value.challenges.some(c => c.completedDates && c.completedDates.includes(today))) count++;
  if (safeReadArray('michi_wabisabi', 'entries').some(e => e.date === today)) count++;
  if (safeReadArray('michi_mononoaware', 'entries').some(e => e.date === today)) count++;
  if (safeReadArray('michi_shinrin', 'walks').some(w => w.date === today)) count++;
  if (safeReadArray('michi_ma', 'sessions').some(s => s.date === today)) count++;
  if (safeReadArray('michi_ikigai', 'reflections').some(r => r.date === today)) count++;
  return count;
});

const dailyProgress = computed(() => completedCount.value / 7);

const incompletePractices = computed(() => {
  return allPractices.filter(p => {
    if (p.id === 'kaizen') return !kaizenData.value.habits.some(h => h.completedDates && h.completedDates.includes(today));
    if (p.id === 'gaman') return !gamanData.value.challenges.some(c => c.completedDates && c.completedDates.includes(today));
    const data = readJson(`michi_${p.id}`, null);
    if (!data) return true;
    if (data.entries) return !data.entries.some(e => e.date === today);
    if (data.walks) return !data.walks.some(w => w.date === today);
    if (data.sessions) return !data.sessions.some(s => s.date === today);
    if (data.reflections) return !data.reflections.some(r => r.date === today);
    return true;
  }).slice(0, 3);
});

const streak = computed(() => {
  let count = 0;
  let date = new Date();
  for (let i = 0; i < 400; i++) {
    const d = date.toISOString().split('T')[0];
    let dayComplete = false;
    if (kaizenData.value.habits.some(h => h.completedDates && h.completedDates.includes(d))) dayComplete = true;
    if (gamanData.value.challenges.some(c => c.completedDates && c.completedDates.includes(d))) dayComplete = true;
    if (safeReadArray('michi_wabisabi', 'entries').some(e => e.date === d)) dayComplete = true;
    if (safeReadArray('michi_mononoaware', 'entries').some(e => e.date === d)) dayComplete = true;
    if (safeReadArray('michi_shinrin', 'walks').some(w => w.date === d)) dayComplete = true;
    if (safeReadArray('michi_ma', 'sessions').some(s => s.date === d)) dayComplete = true;
    if (safeReadArray('michi_ikigai', 'reflections').some(r => r.date === d)) dayComplete = true;

    if (!dayComplete) break;
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
});
</script>
