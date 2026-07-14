<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:trending-up" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Kaizen</h1>
      <p class="text-sm text-muted mt-1">改善 - Continuous small improvement</p>
    </div>

    <div v-if="!adding" class="mb-6">
      <button
        @click="adding = true"
        class="w-full py-4 glass rounded-2xl shadow-sm border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all"
      >
        + Add Micro-Habit
      </button>
    </div>

    <div v-else class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 mb-6">
      <label for="new-habit-input" class="sr-only">New micro-habit name</label>
      <input
        id="new-habit-input"
        v-model="newHabit"
        placeholder="e.g., Drink water, Stretch, Read 1 page"
        class="w-full p-3 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal focus:outline-none focus:border-forest transition-colors mb-3"
        @keyup.enter="addHabit"
      />
      <div class="flex gap-3">
        <button @click="adding = false" class="flex-1 py-2 rounded-xl border border-gray-200 text-muted hover:bg-gray-50 transition-colors">Cancel</button>
        <button @click="addHabit" :disabled="!newHabit.trim()" class="flex-1 py-2 rounded-xl bg-forest text-white disabled:opacity-40 hover:bg-forest-dark transition-colors">Add</button>
      </div>
    </div>

    <div class="space-y-3">
      <div v-for="habit in data.habits" :key="habit.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-medium text-charcoal">{{ habit.name }}</h3>
            <p class="text-xs text-muted">{{ getHabitStreak(habit) }} day streak</p>
          </div>
          <button
            @click="removeHabit(habit.id)"
            :aria-label="`Remove habit: ${habit.name}`"
            class="text-xs text-torii/60 hover:text-torii transition-colors"
          >
            Remove
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleHabit(habit)"
            :aria-label="isCompletedToday(habit) ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`"
            :aria-pressed="isCompletedToday(habit)"
            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
            :class="isCompletedToday(habit) ? 'bg-forest text-white shadow-md' : 'bg-gray-100 text-muted hover:bg-gray-200'"
          >
            <Icon :icon="isCompletedToday(habit) ? 'lucide:check' : 'lucide:circle'" class="w-5 h-5" />
          </button>
          <div class="flex-1 flex gap-1">
            <div
              v-for="day in last7Days"
              :key="day.date"
              class="flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] transition-colors"
              :class="habit.completedDates.includes(day.date) ? 'bg-forest/20 text-forest' : 'bg-gray-50 text-gray-300'"
            >
              {{ day.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="data.habits.length === 0" class="text-center text-muted mt-8">
      Add your first micro-habit. 1% better every day.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useStorage } from '../composables/useStorage.js';
import { getToday, getLastNDays, getWeekdayLabel } from '../utils/dates.js';
import { getHabitStreak } from '../utils/streaks.js';

const data = useStorage('michi_kaizen', { habits: [] });
const adding = ref(false);
const newHabit = ref('');

const today = getToday();

const last7Days = computed(() => {
  return getLastNDays(7).map(date => ({
    date,
    label: getWeekdayLabel(date),
  }));
});

function addHabit() {
  if (!newHabit.value.trim()) return;
  data.value.habits.push({
    id: Date.now(),
    name: newHabit.value.trim(),
    startDate: today,
    completedDates: [],
  });
  newHabit.value = '';
  adding.value = false;
}

function removeHabit(id) {
  const i = data.value.habits.findIndex(h => h.id === id);
  if (i !== -1) data.value.habits.splice(i, 1);
}

function toggleHabit(habit) {
  const i = habit.completedDates.indexOf(today);
  if (i === -1) {
    habit.completedDates.push(today);
  } else {
    habit.completedDates.splice(i, 1);
  }
}

function isCompletedToday(habit) {
  return habit.completedDates.includes(today);
}
</script>
