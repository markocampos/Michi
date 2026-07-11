<template>
  <div class="px-5 pt-12 pb-8 lg:px-12 lg:pt-16">
    <h1 class="text-2xl font-bold text-charcoal mb-2 lg:text-4xl">Growth</h1>
    <p class="text-sm text-muted mb-8">Your journey of continuous improvement</p>

    <div class="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4 lg:gap-6">
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center hover:-translate-y-0.5 transition-transform">
        <p class="text-2xl font-bold text-forest">{{ totalMeditationMin }}</p>
        <p class="text-xs text-muted">min meditated</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center hover:-translate-y-0.5 transition-transform">
        <p class="text-2xl font-bold text-forest">{{ totalWalks }}</p>
        <p class="text-xs text-muted">walks taken</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center hover:-translate-y-0.5 transition-transform">
        <p class="text-2xl font-bold text-forest">{{ totalEntries }}</p>
        <p class="text-xs text-muted">entries written</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center hover:-translate-y-0.5 transition-transform">
        <p class="text-2xl font-bold text-forest">{{ currentStreak }}</p>
        <p class="text-xs text-muted">day streak</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 lg:gap-8">
      <div>
        <div v-if="kaizenData.habits.length > 0" class="mb-8">
          <h2 class="font-semibold text-charcoal mb-4">Kaizen Streaks</h2>
          <div class="space-y-3">
            <div v-for="habit in kaizenData.habits" :key="habit.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-charcoal">{{ habit.name }}</h3>
                <span class="text-sm font-bold text-forest">{{ getStreak(habit) }} 🔥</span>
              </div>
              <div class="flex gap-1">
                <div
                  v-for="day in last30Days"
                  :key="day"
                  class="flex-1 h-3 rounded-sm transition-colors"
                  :class="habit.completedDates.includes(day) ? 'bg-forest' : 'bg-gray-100'"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="gamanData.challenges.length > 0" class="mb-8">
          <h2 class="font-semibold text-charcoal mb-4">Gaman Challenges</h2>
          <div class="space-y-3">
            <div v-for="c in gamanData.challenges" :key="c.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-charcoal">{{ c.name }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full" :class="c.status === 'completed' ? 'bg-forest/20 text-forest' : 'bg-earth/20 text-earth-dark'">
                  {{ c.status === 'completed' ? 'Completed' : 'Active' }}
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div
                  class="bg-forest h-2 rounded-full transition-all"
                  :style="{ width: `${(c.completedDates.length / c.goalDays) * 100}%` }"
                />
              </div>
              <p class="text-xs text-muted">{{ c.completedDates.length }}/{{ c.goalDays }} days</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div v-if="ikigaiData.reflections.length > 0" class="mb-8">
          <h2 class="font-semibold text-charcoal mb-4">Ikigai Map</h2>
          <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
            <div class="space-y-4">
              <div v-for="(dim, i) in ikigaiDimensions" :key="i">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-charcoal">{{ dim.label }}</span>
                  <span class="text-xs text-muted">{{ dim.jp }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all"
                    :style="{ width: `${dim.value}%`, backgroundColor: dim.color }"
                  />
                </div>
              </div>
            </div>
            <p class="text-xs text-muted mt-4 text-center">Based on your Ikigai reflections</p>
          </div>
        </div>

        <div v-if="totalMeditationMin === 0 && totalWalks === 0 && totalEntries === 0" class="text-center text-muted mt-4">
          <p class="text-4xl mb-3">🌱</p>
          <p>Complete some practices to see your growth here.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { readJson } from '../composables/useStorage.js';

const maData = readJson('michi_ma', { sessions: [] });
const shinrinData = readJson('michi_shinrin', { walks: [] });
const wabisabiData = readJson('michi_wabisabi', { entries: [] });
const mononoawareData = readJson('michi_mononoaware', { entries: [] });
const ikigaiData = readJson('michi_ikigai', { reflections: [] });
const kaizenData = readJson('michi_kaizen', { habits: [] });
const gamanData = readJson('michi_gaman', { challenges: [] });

const totalMeditationMin = computed(() => {
  const totalSeconds = maData.sessions.reduce((s, x) => s + (x.duration || 0), 0);
  return totalSeconds > 0 ? Math.max(1, Math.round(totalSeconds / 60)) : 0;
});
const totalWalks = computed(() => shinrinData.walks.length);
const totalEntries = computed(() => wabisabiData.entries.length + mononoawareData.entries.length + ikigaiData.reflections.length);

const currentStreak = computed(() => {
  let count = 0;
  let date = new Date();
  for (let i = 0; i < 400; i++) {
    const d = date.toISOString().split('T')[0];
    let found = false;
    if (kaizenData.habits.some(h => h.completedDates && h.completedDates.includes(d))) found = true;
    if (gamanData.challenges.some(c => c.completedDates && c.completedDates.includes(d))) found = true;
    if (wabisabiData.entries.some(e => e.date === d)) found = true;
    if (mononoawareData.entries.some(e => e.date === d)) found = true;
    if (maData.sessions.some(s => s.date === d)) found = true;
    if (shinrinData.walks.some(w => w.date === d)) found = true;
    if (ikigaiData.reflections.some(r => r.date === d)) found = true;

    if (found) { count++; }
    else break;
    date.setDate(date.getDate() - 1);
  }
  return count;
});

const last30Days = computed(() => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
});

function getStreak(habit) {
  let streak = 0;
  let date = new Date();
  while (habit.completedDates && habit.completedDates.includes(date.toISOString().split('T')[0])) {
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function calcScore(text) {
  if (!text) return 10;
  const words = text.trim().split(/\s+/).length;
  return Math.min(30 + (words / 15) * 70, 100);
}

const ikigaiDimensions = computed(() => {
  const latest = ikigaiData.reflections[0];
  if (!latest) return [];
  return [
    { label: 'Love', jp: '好きなこと', value: calcScore(latest.love), color: '#B34233' },
    { label: 'Skill', jp: '得意なこと', value: calcScore(latest.goodAt), color: '#5B7B5E' },
    { label: 'Need', jp: '世界に必要なこと', value: calcScore(latest.worldNeeds), color: '#C4A882' },
    { label: 'Livelihood', jp: 'お金にできること', value: calcScore(latest.paidFor), color: '#8B7355' },
  ];
});
</script>
