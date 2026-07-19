<template>
  <div
    class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16"
  >
    <div class="mb-8 lg:mb-12">
      <p class="text-sm text-muted mb-1">{{ greeting.jp }}</p>
      <h1 class="text-2xl font-bold text-charcoal lg:text-4xl">{{ greeting.en }}</h1>
      <p class="text-sm text-forest mt-1">道 - Your path to mindfulness</p>
    </div>

    <!-- Update available banner -->
    <a
      v-if="updateAvailable"
      href="/settings"
      class="block rounded-2xl p-4 mb-6 bg-forest/10 border border-forest/20 hover:bg-forest/15 transition-colors"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-forest/20 flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:download" class="w-5 h-5 text-forest" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-forest">Update available: {{ latestVersion }}</p>
          <p class="text-xs text-muted">Tap to see what's new</p>
        </div>
        <Icon icon="lucide:chevron-right" class="w-4 h-4 text-forest" />
      </div>
    </a>

    <!-- Mood -->
    <div class="rounded-2xl p-4 mb-6 flex items-center gap-4" :class="userMood.bgClass">
      <span class="text-2xl">{{ userMood.emoji }}</span>
      <div class="flex-1">
        <p class="text-sm font-medium" :class="userMood.textClass">{{ userMood.title }}</p>
        <p class="text-xs opacity-70" :class="userMood.textClass">{{ userMood.message }}</p>
      </div>
      <!-- Mini week dots -->
      <div class="flex gap-1">
        <div
          v-for="(day, i) in weekActivity"
          :key="i"
          class="w-2 h-2 rounded-full transition-all"
          :class="day.active ? userMood.dotClass : 'bg-white/30'"
          :title="`${day.label}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
        />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
      <div>
        <div class="flex justify-center mb-8">
          <ProgressRing :progress="dailyProgress" :size="140">
            <div class="text-center">
              <span class="text-2xl font-bold text-charcoal">{{ completedCount }}</span>
              <span class="text-sm text-muted block">/ 8</span>
            </div>
          </ProgressRing>
        </div>
        <p class="text-center text-sm text-muted -mt-5 mb-8">practices today</p>

        <QuoteCard :quote="currentQuote" class="mb-8" />

        <div v-if="streak > 0" class="bg-forest/10 rounded-2xl p-4 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="text-2xl font-bold text-forest">{{ streak }}</span>
            <Icon icon="lucide:flame" class="w-6 h-6 text-forest" />
          </div>
          <p class="text-sm text-forest-dark">day streak</p>
          <div v-if="milestone" class="mt-2 px-3 py-1 bg-forest/20 rounded-full inline-block">
            <p class="text-xs font-medium text-forest">{{ milestone }}</p>
          </div>
        </div>
      </div>

      <div>
        <div v-if="incompletePractices.length > 0" class="mb-6">
          <h2 class="text-lg font-semibold text-charcoal mb-4">Continue your journey</h2>
          <div class="space-y-3 stagger">
            <router-link
              v-for="practice in incompletePractices"
              :key="practice.id"
              :to="`/practice/${practice.id}`"
              class="flex items-center gap-4 glass rounded-xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all group animate-fade-in-up"
            >
              <Icon :icon="practice.icon" class="w-7 h-7 text-forest group-hover:scale-110 transition-transform" />
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

        <div v-if="completedCount === 8" class="glass rounded-2xl p-5 text-center shadow-sm border border-gray-100/50 mb-6">
          <Icon icon="lucide:party-popper" class="w-10 h-10 text-forest mx-auto mb-2" />
          <p class="font-semibold text-charcoal">All practices complete!</p>
          <p class="text-sm text-muted mt-1">You've walked your full path today.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ProgressRing from '../components/ProgressRing.vue';
import QuoteCard from '../components/QuoteCard.vue';
import { useQuote } from '../composables/useQuote.js';
import { useStorage } from '../composables/useStorage.js';
import { allPractices } from '../data/practices.js';
import { calculateStreak, countTodayPractices } from '../utils/streaks.js';
import { getToday, getLastNDays, getWeekdayLabel } from '../utils/dates.js';
import { readJson } from '../composables/useStorage.js';
import { useNotifications } from '../composables/useNotifications.js';
import { APP_VERSION } from '../version.js';

const { sendStreakMilestone } = useNotifications();

// Update checker
const updateAvailable = ref(false);
const latestVersion = ref('');

function compareSemver(v1, v2) {
  const sanitize = v => (v || '').replace(/^v/, '');
  const p1 = sanitize(v1).split('.').map(Number);
  const p2 = sanitize(v2).split('.').map(Number);
  
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

async function checkForUpdate() {
  try {
    const res = await fetch('https://api.github.com/repos/markocampos/michi/releases/latest');
    const data = await res.json();
    latestVersion.value = data.tag_name;
    updateAvailable.value = compareSemver(data.tag_name, APP_VERSION) > 0;
  } catch {
    // Ignore errors — just don't show the banner
  }
}
checkForUpdate();


const { currentQuote, getGreeting } = useQuote();
const greeting = getGreeting();

const kaizenData = useStorage('michi_kaizen', { habits: [] });
const gamanData = useStorage('michi_gaman', { challenges: [] });

const today = getToday();

const completedCount = computed(() => countTodayPractices(kaizenData.value, gamanData.value));
const dailyProgress = computed(() => completedCount.value / 8);

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

const streak = computed(() => calculateStreak(kaizenData.value, gamanData.value));

// Send milestone notification when streak reaches a milestone
let lastNotifiedStreak = 0;
watch(streak, (newStreak) => {
  if ([7, 30, 100].includes(newStreak) && newStreak > lastNotifiedStreak) {
    lastNotifiedStreak = newStreak;
    sendStreakMilestone(newStreak);
  }
});

const milestone = computed(() => {
  const s = streak.value;
  if (s >= 100) return '100 day milestone!';
  if (s >= 30) return '30 day milestone!';
  if (s >= 7) return '7 day milestone!';
  return null;
});

// --- Mood (based on today's activity + streak) ---
function countPracticesForDate(date) {
  let count = 0;
  const kd = readJson('michi_kaizen', { habits: [] });
  const gd = readJson('michi_gaman', { challenges: [] });
  if (kd.habits?.some(h => h.completedDates?.includes(date))) count++;
  if (gd.challenges?.some(c => c.completedDates?.includes(date))) count++;
  if (readJson('michi_wabisabi', { entries: [] }).entries?.some(e => e.date === date)) count++;
  if (readJson('michi_mononoaware', { entries: [] }).entries?.some(e => e.date === date)) count++;
  if (readJson('michi_shinrin', { walks: [] }).walks?.some(w => w.date === date)) count++;
  if (readJson('michi_ma', { sessions: [] }).sessions?.some(s => s.date === date)) count++;
  if (readJson('michi_ikigai', { reflections: [] }).reflections?.some(r => r.date === date)) count++;
  if (readJson('michi_hansei', { reflections: [] }).reflections?.some(r => r.date === date)) count++;
  return count;
}

const userMood = computed(() => {
  const today_count = completedCount.value;
  const s = streak.value;

  if (today_count >= 6) return {
    emoji: '🌟', title: 'On Fire!', message: `${today_count} practices today. You're thriving.`,
    bgClass: 'bg-forest/10', textClass: 'text-forest-dark', dotClass: 'bg-forest',
  };
  if (today_count >= 3) return {
    emoji: '😊', title: 'Great Progress', message: `${today_count} practices done. Keep going.`,
    bgClass: 'bg-forest/10', textClass: 'text-forest-dark', dotClass: 'bg-forest',
  };
  if (today_count >= 1) return {
    emoji: '🌿', title: 'Getting Started', message: `${today_count} practice done today.`,
    bgClass: 'bg-earth/15', textClass: 'text-earth-dark', dotClass: 'bg-earth',
  };
  if (s >= 7) return {
    emoji: '🔥', title: 'Strong Streak', message: `${s} days in a row. Don't break it.`,
    bgClass: 'bg-torii/10', textClass: 'text-torii', dotClass: 'bg-torii',
  };
  if (s >= 3) return {
    emoji: '🌱', title: 'Building Habits', message: `${s} days straight. Consistency.`,
    bgClass: 'bg-earth/10', textClass: 'text-earth-dark', dotClass: 'bg-earth',
  };
  return {
    emoji: '🍃', title: 'New Day', message: 'Start your first practice.',
    bgClass: 'bg-gray-100', textClass: 'text-muted', dotClass: 'bg-gray-400',
  };
});

// --- Week activity mini chart ---
const weekActivity = computed(() => {
  const dates = getLastNDays(7);
  const counts = dates.map(d => countPracticesForDate(d));
  const max = Math.max(...counts, 1);
  return dates.map((d, i) => ({
    label: getWeekdayLabel(d),
    count: counts[i],
    active: counts[i] > 0,
    height: Math.max(Math.round((counts[i] / max) * 32), counts[i] > 0 ? 4 : 2),
  }));
});
</script>
