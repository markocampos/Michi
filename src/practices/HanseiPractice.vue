<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:scan-eye" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Hansei</h1>
      <p class="text-sm text-muted mt-1">反省 - Self-reflection</p>
    </div>

    <DailyPrompt practiceId="hansei" />

    <div v-if="!showSummary" class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-2 mb-4">
          <Icon icon="lucide:clipboard-list" class="w-5 h-5 text-forest" />
          <p class="text-sm font-medium text-forest">End-of-day reflection</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:thumbs-up" class="w-4 h-4 text-forest" />
              What went well today?
            </label>
            <label for="went-well-input" class="sr-only">What went well today</label>
            <textarea
              ref="inputRef"
              id="went-well-input"
              v-model="wentWell"
              placeholder="List your accomplishments, wins, or positive moments..."
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:alert-circle" class="w-4 h-4 text-earth" />
              What could be improved?
            </label>
            <label for="to-improve-input" class="sr-only">What could be improved</label>
            <textarea
              id="to-improve-input"
              v-model="toImprove"
              placeholder="What challenges did you face? What would you do differently?"
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <div>
            <label class="text-sm text-charcoal font-medium block mb-2 flex items-center gap-2">
              <Icon icon="lucide:lightbulb" class="w-4 h-4 text-torii" />
              What did I learn?
            </label>
            <label for="learned-input" class="sr-only">What did I learn</label>
            <textarea
              id="learned-input"
              v-model="learned"
              placeholder="Any insights, realizations, or knowledge gained..."
              class="w-full h-24 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button
            @click="save"
            :disabled="!wentWell.trim() && !toImprove.trim() && !learned.trim()"
            class="w-full py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Your Reflection</p>
        
        <div v-if="lastReflection.wentWell" class="text-left mb-4">
          <p class="text-xs text-muted mb-1 flex items-center gap-1"><Icon icon="lucide:thumbs-up" class="w-3 h-3 text-forest" /> What went well</p>
          <p class="text-charcoal whitespace-pre-wrap">{{ lastReflection.wentWell }}</p>
        </div>
        
        <div v-if="lastReflection.toImprove" class="text-left mb-4">
          <p class="text-xs text-muted mb-1 flex items-center gap-1"><Icon icon="lucide:alert-circle" class="w-3 h-3 text-earth" /> What could be improved</p>
          <p class="text-charcoal whitespace-pre-wrap">{{ lastReflection.toImprove }}</p>
        </div>
        
        <div v-if="lastReflection.learned" class="text-left mb-4">
          <p class="text-xs text-muted mb-1 flex items-center gap-1"><Icon icon="lucide:lightbulb" class="w-3 h-3 text-torii" /> What I learned</p>
          <p class="text-charcoal whitespace-pre-wrap">{{ lastReflection.learned }}</p>
        </div>
      </div>
      
      <p class="text-sm text-muted italic">"Hansei is not about self-criticism, but about recognizing areas for growth with honesty and committing to improvement."</p>

      <button
        @click="resetPractice"
        class="mt-6 px-6 py-2 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Write Another
      </button>
    </div>

  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref, computed, onMounted, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';

const data = useStorage('michi_hansei', { reflections: [] });
const { showToast } = useToast();
const wentWell = ref('');
const toImprove = ref('');
const learned = ref('');
const inputRef = ref(null);
const showSummary = ref(false);
const lastReflection = ref(null);

function focusAndScroll() {
  if (inputRef.value) {
    inputRef.value.focus();
    setTimeout(() => {
      inputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}

onMounted(() => {
  focusAndScroll();
});

function save() {
  if (!wentWell.value.trim() && !toImprove.value.trim() && !learned.value.trim()) return;
  
  const reflectionData = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    wentWell: wentWell.value.trim(),
    toImprove: toImprove.value.trim(),
    learned: learned.value.trim(),
  };

  data.value.reflections.unshift(reflectionData);
  lastReflection.value = reflectionData;
  
  wentWell.value = '';
  toImprove.value = '';
  learned.value = '';
  showToast('Reflection saved', 'success');
  triggerHaptic();
  
  showSummary.value = true;
}

function resetPractice() {
  showSummary.value = false;
  nextTick(() => {
    focusAndScroll();
  });
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

const thisWeekCount = computed(() => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return data.value.reflections.filter(r => {
    const d = new Date(r.date + 'T00:00:00');
    return d >= weekAgo;
  }).length;
});

const currentStreak = computed(() => {
  let count = 0;
  let date = new Date();
  const dates = data.value.reflections.map(r => r.date);
  for (let i = 0; i < 365; i++) {
    const d = date.toISOString().split('T')[0];
    if (dates.includes(d)) {
      count++;
    } else if (i > 0) {
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  return count;
});
</script>
