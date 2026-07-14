<template>
  <div
    class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16"
    v-on="pullHandlers"
  >
    <!-- Pull to refresh -->
    <div
      class="flex justify-center overflow-hidden transition-all duration-300"
      :style="{ height: isPulling ? `${Math.min(pullDistance, 40)}px` : isRefreshing ? '40px' : '0px' }"
    >
      <div class="flex items-center gap-2 text-forest">
        <Icon icon="lucide:refresh-cw" class="w-5 h-5" :class="isRefreshing ? 'animate-spin' : ''" />
        <span class="text-xs font-medium">{{ isRefreshing ? 'Refreshing...' : 'Pull to refresh' }}</span>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-charcoal mb-2 md:text-3xl lg:text-4xl">Growth</h1>
    <p class="text-sm text-muted mb-8">Your journey of continuous improvement</p>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4 md:gap-5 lg:gap-6">
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center">
        <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-2">
          <Icon icon="lucide:wind" class="w-4 h-4 text-forest" />
        </div>
        <p class="text-2xl font-bold text-forest">{{ totalMeditationMin }}</p>
        <p class="text-[10px] text-muted">total minutes meditated</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center">
        <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-2">
          <Icon icon="lucide:trees" class="w-4 h-4 text-forest" />
        </div>
        <p class="text-2xl font-bold text-forest">{{ totalWalks }}</p>
        <p class="text-[10px] text-muted">forest walks completed</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center">
        <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-2">
          <Icon icon="lucide:book-open" class="w-4 h-4 text-forest" />
        </div>
        <p class="text-2xl font-bold text-forest">{{ totalEntries }}</p>
        <p class="text-[10px] text-muted">journal entries written</p>
      </div>
      <div class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 text-center">
        <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-2">
          <Icon icon="lucide:flame" class="w-4 h-4 text-forest" />
        </div>
        <p class="text-2xl font-bold text-forest">{{ currentStreak }}</p>
        <p class="text-[10px] text-muted">day streak (consecutive)</p>
      </div>
    </div>

    <!-- Activity Heatmap -->
    <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-charcoal">Activity Heatmap</h3>
        <span class="text-[10px] text-muted">Last 28 days</span>
      </div>
      <p class="text-[10px] text-muted mb-3">Each square = 1 day. Darker green = more practices done that day.</p>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in heatmap"
          :key="day.date"
          class="aspect-square rounded-sm flex items-center justify-center text-[7px] text-muted"
          :class="day.count === 0 ? 'bg-gray-50' : day.count <= 2 ? 'bg-forest/20' : day.count <= 4 ? 'bg-forest/50' : 'bg-forest text-white'"
          :title="`${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
        />
      </div>
      <div class="flex items-center justify-end gap-1 mt-2">
        <span class="text-[9px] text-muted">Less</span>
        <div class="w-3 h-3 rounded-sm bg-gray-50" />
        <div class="w-3 h-3 rounded-sm bg-forest/20" />
        <div class="w-3 h-3 rounded-sm bg-forest/50" />
        <div class="w-3 h-3 rounded-sm bg-forest" />
        <span class="text-[9px] text-muted">More</span>
      </div>
    </div>

    <!-- Practice Breakdown -->
    <h3 class="font-semibold text-charcoal mb-4">Practice Breakdown</h3>
    <p class="text-[10px] text-muted mb-4">How much you've done in each practice area. Data comes from your completed practices.</p>

    <div class="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-2">

      <!-- Ma (Meditation) -->
      <div v-if="maData.sessions?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
            <Icon icon="lucide:wind" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Ma 間</h4>
            <p class="text-[10px] text-muted">Meditation sessions</p>
          </div>
          <span class="text-lg font-bold text-forest">{{ totalMeditationMin }} min</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-forest h-2 rounded-full transition-all" :style="{ width: Math.min((maData.sessions.length / 10) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">{{ maData.sessions.length }} session{{ maData.sessions.length !== 1 ? 's' : '' }} completed</p>
      </div>

      <!-- Shinrin-yoku (Forest Bathing) -->
      <div v-if="shinrinData.walks?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-summer/20 flex items-center justify-center">
            <Icon icon="lucide:trees" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Shinrin-yoku 森林浴</h4>
            <p class="text-[10px] text-muted">Forest bathing walks</p>
          </div>
          <span class="text-lg font-bold text-forest">{{ totalWalks }} walks</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-forest h-2 rounded-full transition-all" :style="{ width: Math.min((totalWalks / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">{{ shinrinTotalMin }} minutes in nature total</p>
      </div>

      <!-- Wabi-sabi -->
      <div v-if="wabisabiData.entries?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-earth/10 flex items-center justify-center">
            <Icon icon="lucide:leaf" class="w-5 h-5 text-earth" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Wabi-sabi 侘寂</h4>
            <p class="text-[10px] text-muted">Moments of beautiful imperfection</p>
          </div>
          <span class="text-lg font-bold text-earth-dark">{{ wabisabiData.entries.length }} entries</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-earth h-2 rounded-full transition-all" :style="{ width: Math.min((wabisabiData.entries.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Reflections on embracing imperfection</p>
      </div>

      <!-- Ikigai -->
      <div v-if="ikigaiData.reflections?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-torii/10 flex items-center justify-center">
            <Icon icon="lucide:target" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Ikigai 生きがい</h4>
            <p class="text-[10px] text-muted">Your reason for being</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ ikigaiData.reflections.length }} reflections</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-torii h-2 rounded-full transition-all" :style="{ width: Math.min((ikigaiData.reflections.length / 3) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Times you explored what you love, do well, and value</p>
      </div>

      <!-- Hansei -->
      <div v-if="hanseiData.reflections?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-torii/10 flex items-center justify-center">
            <Icon icon="lucide:scan-eye" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Hansei 反省</h4>
            <p class="text-[10px] text-muted">Self-reflection</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ hanseiData.reflections.length }} reflections</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-torii h-2 rounded-full transition-all" :style="{ width: Math.min((hanseiData.reflections.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Times you reflected on what went well and what to improve</p>
      </div>

      <!-- Mono no aware -->
      <div v-if="mononoawareData.entries?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-spring/20 flex items-center justify-center">
            <Icon icon="lucide:flower-2" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Mono no aware 物の哀れ</h4>
            <p class="text-[10px] text-muted">Awareness of impermanence</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ mononoawareData.entries.length }} entries</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-spring h-2 rounded-full transition-all" :style="{ width: Math.min((mononoawareData.entries.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Gratitude and impermanence reflections</p>
      </div>

      <!-- Kaizen -->
      <div v-if="kaizenData.habits?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
            <Icon icon="lucide:trending-up" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Kaizen 改善</h4>
            <p class="text-[10px] text-muted">Micro-habits — small daily improvements</p>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="habit in kaizenData.habits" :key="habit.id" class="flex items-center gap-2">
            <span class="text-xs text-charcoal flex-1">{{ habit.name }}</span>
            <span class="text-[10px] text-muted">{{ habit.completedDates?.length || 0 }} days done</span>
            <div class="flex items-center gap-0.5">
              <Icon icon="lucide:flame" class="w-3 h-3 text-forest" />
              <span class="text-[10px] font-bold text-forest">{{ getHabitStreak(habit) }}d streak</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gaman -->
      <div v-if="gamanData.challenges?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-earth/10 flex items-center justify-center">
            <Icon icon="lucide:mountain" class="w-5 h-5 text-earth-dark" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Gaman 我慢</h4>
            <p class="text-[10px] text-muted">Endurance challenges — long-term commitment</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="c in gamanData.challenges" :key="c.id">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-charcoal">{{ c.name }}</span>
              <span class="text-[10px] font-medium" :class="c.status === 'completed' ? 'text-forest' : 'text-earth-dark'">
                {{ c.completedDates?.length || 0 }} of {{ c.goalDays }} days
                {{ c.status === 'completed' ? '(Done!)' : '' }}
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="c.status === 'completed' ? 'bg-forest' : 'bg-earth'"
                :style="{ width: Math.min(((c.completedDates?.length || 0) / (c.goalDays || 1)) * 100, 100) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty state -->
    <div v-if="totalMeditationMin === 0 && totalWalks === 0 && totalEntries === 0" class="text-center mt-8">
      <div class="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:sprout" class="w-10 h-10 text-forest" />
      </div>
      <p class="font-semibold text-charcoal mb-1">Your growth journey awaits</p>
      <p class="text-sm text-muted mb-4">Complete some practices to see your progress here.</p>
      <router-link to="/practices" class="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors">
        <Icon icon="lucide:plus" class="w-4 h-4" />
        Start a practice
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { readJson } from '../composables/useStorage.js';
import { calculateStreak, getHabitStreak } from '../utils/streaks.js';
import { getLastNDays } from '../utils/dates.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import { usePullToRefresh } from '../composables/usePullToRefresh.js';

async function refreshData() {
  await new Promise(r => setTimeout(r, 500));
  window.location.reload();
}

const { isRefreshing, pullDistance, isPulling, handlers: pullHandlers } = usePullToRefresh(refreshData);

const maData = readJson(STORAGE_KEYS.ma, { sessions: [] });
const shinrinData = readJson(STORAGE_KEYS.shinrin, { walks: [] });
const wabisabiData = readJson(STORAGE_KEYS.wabisabi, { entries: [] });
const mononoawareData = readJson(STORAGE_KEYS.mononoaware, { entries: [] });
const ikigaiData = readJson(STORAGE_KEYS.ikigai, { reflections: [] });
const hanseiData = readJson(STORAGE_KEYS.hansei, { reflections: [] });
const kaizenData = readJson(STORAGE_KEYS.kaizen, { habits: [] });
const gamanData = readJson(STORAGE_KEYS.gaman, { challenges: [] });

// --- Stats ---
const totalMeditationMin = computed(() => {
  const sessions = maData.sessions || [];
  const totalSeconds = sessions.reduce((s, x) => s + (x.duration || 0), 0);
  return totalSeconds > 0 ? Math.max(1, Math.round(totalSeconds / 60)) : 0;
});
const totalWalks = computed(() => (shinrinData.walks || []).length);
const totalEntries = computed(() =>
  (wabisabiData.entries || []).length +
  (mononoawareData.entries || []).length +
  (ikigaiData.reflections || []).length +
  (hanseiData.reflections || []).length
);
const currentStreak = computed(() => calculateStreak(kaizenData, gamanData));

// --- Shinrin total min ---
const shinrinTotalMin = computed(() => {
  const walks = shinrinData.walks || [];
  return walks.reduce((sum, w) => sum + Math.max(1, Math.round((w.duration || 0) / 60)), 0);
});

// --- Heatmap (last 28 days) ---
const heatmap = computed(() => {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    let count = 0;
    if ((maData.sessions || []).some(s => s.date === dateStr)) count++;
    if ((shinrinData.walks || []).some(w => w.date === dateStr)) count++;
    if ((wabisabiData.entries || []).some(e => e.date === dateStr)) count++;
    if ((mononoawareData.entries || []).some(e => e.date === dateStr)) count++;
    if ((ikigaiData.reflections || []).some(r => r.date === dateStr)) count++;
    if ((hanseiData.reflections || []).some(r => r.date === dateStr)) count++;
    if ((kaizenData.habits || []).some(h => h.completedDates?.includes(dateStr))) count++;
    if ((gamanData.challenges || []).some(c => c.completedDates?.includes(dateStr))) count++;
    days.push({ date: dateStr, count });
  }
  return days;
});
</script>
