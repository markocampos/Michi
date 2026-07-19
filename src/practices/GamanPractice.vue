<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:mountain" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Gaman</h1>
      <p class="text-sm text-muted mt-1">我慢 - Endurance and patience</p>
    </div>

    <DailyPrompt practiceId="gaman" />

    <div v-if="activeChallenges.length === 0" class="mb-6">
      <h2 class="font-semibold text-charcoal mb-4">Available Challenges</h2>
      <div class="space-y-3">
        <div
          v-for="c in availableChallenges"
          :key="c.id"
          class="glass rounded-xl p-4 shadow-sm border border-gray-100/50"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-charcoal">{{ c.name }}</h3>
            <span class="text-xs text-forest">{{ c.days }} days</span>
          </div>
          <p class="text-sm text-muted mb-3">{{ c.description }}</p>
          <button
            @click="joinChallenge(c)"
            :aria-label="`Commit to ${c.name} for ${c.days} days`"
            class="w-full py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            Commit to {{ c.days }} Days
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeChallenges.length > 0">
      <h2 class="font-semibold text-charcoal mb-4">Active Challenges</h2>
      <div class="space-y-4">
        <div
          v-for="c in activeChallenges"
          :key="c.id"
          class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-medium text-charcoal">{{ c.name }}</h3>
              <p class="text-xs text-muted">{{ c.jp }}</p>
            </div>
            <span class="text-xs font-medium text-forest">
              {{ c.completedDates.length }}/{{ c.goalDays }} days
            </span>
          </div>

          <div class="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              class="bg-forest h-3 rounded-full transition-all duration-500"
              :style="{ width: `${(c.completedDates.length / c.goalDays) * 100}%` }"
            />
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="toggleDay(c)"
              :aria-label="isCompletedToday(c) ? 'Mark today as incomplete' : 'Mark today as complete'"
              :aria-pressed="isCompletedToday(c)"
              class="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              :class="isCompletedToday(c) ? 'bg-forest text-white shadow-md' : 'bg-gray-100 text-charcoal hover:bg-gray-200'"
            >
              <Icon v-if="isCompletedToday(c)" icon="lucide:check" class="w-4 h-4" />
              {{ isCompletedToday(c) ? 'Done Today' : 'Mark Today Complete' }}
            </button>
          </div>

          <p v-if="getEncouragement(c)" class="text-sm text-forest mt-3 text-center italic">
            {{ getEncouragement(c) }}
          </p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="showAvailable = !showAvailable"
          class="text-sm text-forest font-medium hover:text-forest-dark transition-colors"
        >
          {{ showAvailable ? 'Hide' : '+ Add another challenge' }}
        </button>
      </div>
      <div v-if="showAvailable && availableChallenges.length > 0" class="space-y-3 mt-4">
        <div
          v-for="c in availableChallenges"
          :key="c.id"
          class="glass rounded-xl p-4 shadow-sm border border-gray-100/50"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-charcoal">{{ c.name }}</h3>
            <span class="text-xs text-forest">{{ c.days }} days</span>
          </div>
          <button
            @click="joinChallenge(c)"
            class="w-full py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            Commit
          </button>
        </div>
      </div>
    </div>

    <div v-if="completedChallenges.length > 0" class="mt-8">
      <h2 class="font-semibold text-charcoal mb-3">Completed</h2>
      <div v-for="c in completedChallenges" :key="c.id" class="bg-forest/10 rounded-xl p-4 mb-3">
        <p class="font-medium text-forest">{{ c.name }} - {{ c.goalDays }} days</p>
        <p class="text-xs text-forest-dark mt-1">Gaman. You endured.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { gamanChallenges } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';

const data = useStorage('michi_gaman', { challenges: [] });
const { showToast } = useToast();
const today = new Date().toISOString().split('T')[0];
const showAvailable = ref(false);

const activeChallenges = computed(() =>
  data.value.challenges.filter(c => c.status === 'active')
);

const completedChallenges = computed(() =>
  data.value.challenges.filter(c => c.status === 'completed')
);

const availableChallenges = computed(() =>
  gamanChallenges.filter(c => !data.value.challenges.some(ch => ch.challengeId === c.id))
);

function joinChallenge(c) {
  data.value.challenges.push({
    id: Date.now(),
    challengeId: c.id,
    name: c.name,
    jp: c.jp,
    goalDays: c.days,
    startDate: today,
    completedDates: [],
    status: 'active',
  });
  showAvailable.value = false;
  showToast(`Committed to ${c.name}`, 'success');
  triggerHaptic();
}

function toggleDay(c) {
  const i = c.completedDates.indexOf(today);
  if (i === -1) {
    c.completedDates.push(today);
    showToast('Gaman practiced', 'success');
    triggerHaptic();
    if (c.completedDates.length >= c.goalDays) {
      c.status = 'completed';
    }
  } else {
    c.completedDates.splice(i, 1);
  }
}

function isCompletedToday(c) {
  return c.completedDates.includes(today);
}

function getEncouragement(c) {
  const pct = c.completedDates.length / c.goalDays;
  if (pct >= 0.75) return "Almost there. The mountain is nearly summited.";
  if (pct >= 0.5) return "Halfway. Your endurance grows stronger each day.";
  if (pct >= 0.25) return "One quarter complete. Consistency is your strength.";
  if (c.completedDates.length >= 3) return "The first steps are the hardest. You've begun.";
  return null;
}
</script>
