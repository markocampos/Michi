<template>
  <div class="px-5 pt-12 pb-8 lg:px-12 lg:pt-16">
    <h1 class="text-2xl font-bold text-charcoal mb-2 lg:text-4xl">Practices</h1>
    <p class="text-sm text-muted mb-8">Choose your path for today</p>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
      <PracticeCard
        v-for="practice in allPractices"
        :key="practice.id"
        :practice="practice"
        :done-today="isDoneToday(practice.id)"
      />
    </div>
  </div>
</template>

<script setup>
import PracticeCard from '../components/PracticeCard.vue';
import { allPractices } from '../data/practices.js';
import { readJson } from '../composables/useStorage.js';

const today = new Date().toISOString().split('T')[0];

function isDoneToday(id) {
  try {
    const data = readJson(`michi_${id}`, null);
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
