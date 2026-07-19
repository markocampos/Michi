<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:trees" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Shinrin-yoku</h1>
      <p class="text-sm text-muted mt-1">森林浴 - Forest bathing</p>
    </div>

    <DailyPrompt practiceId="shinrin" />

    <div v-if="!walkActive && !showNotes && !showSummary">
      <button
        @click="startWalk"
        class="w-full py-6 bg-forest rounded-2xl text-white text-lg font-medium hover:bg-forest-dark transition-colors shadow-lg mb-4 flex items-center justify-center gap-2"
      >
        <Icon icon="lucide:tree-pine" class="w-5 h-5" />
        Start Forest Walk
      </button>
      <p class="text-center text-sm text-muted">Engage your senses. Be present in nature.</p>
    </div>

    <div v-if="walkActive" class="text-center">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-xs text-forest mb-2">Walk in progress</p>
        <p class="text-4xl font-light text-charcoal mb-2">{{ formattedTime }}</p>
        <p class="text-sm text-muted mb-4">minutes in nature</p>

        <div class="grid grid-cols-2 gap-3 text-left">
          <div v-for="sense in senses" :key="sense.id" class="bg-white/30 rounded-xl p-3">
            <div class="flex items-center gap-2 mb-1">
              <Icon :icon="sense.icon" class="w-4 h-4 text-forest" />
              <p class="text-xs font-medium text-charcoal">{{ sense.name }}</p>
            </div>
            <p class="text-[10px] text-muted">{{ sense.prompt }}</p>
          </div>
        </div>
      </div>

      <button
        @click="endWalk"
        aria-label="End forest walk"
        class="w-16 h-16 rounded-full bg-torii text-white flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow"
      >
        <Icon icon="lucide:square" class="w-5 h-5" />
      </button>
    </div>

    <div v-if="showNotes" class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <h2 class="text-lg font-semibold text-charcoal mb-4">Sensory Notes</h2>
        <div class="space-y-3">
          <div v-for="sense in senses" :key="sense.id">
            <label class="text-sm text-muted block mb-1 flex items-center gap-2">
              <Icon :icon="sense.icon" class="w-4 h-4" />
              {{ sense.name }}
            </label>
            <label :for="`sense-${sense.id}`" class="sr-only">{{ sense.name }} notes</label>
            <input
              :id="`sense-${sense.id}`"
              v-model="notes[sense.id]"
              :placeholder="sense.prompt"
              class="w-full p-3 border border-gray-200/50 bg-white/50 rounded-xl text-sm focus:outline-none focus:border-forest transition-colors"
            />
          </div>
        </div>
        <button
          @click="saveWalk"
          class="w-full py-3 mt-4 bg-forest text-white rounded-xl font-medium hover:bg-forest-dark transition-colors"
        >
          Save Walk
        </button>
      </div>
    </div>


    <div v-if="showSummary" class="text-center">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Forest Walk Complete</p>
        <p class="text-3xl font-light text-charcoal mb-4">{{ formatDuration(lastWalk.duration) }}</p>
        
        <div class="grid grid-cols-2 gap-3 text-left">
          <div v-for="sense in senses" :key="sense.id" class="bg-white/50 rounded-xl p-3 border border-gray-100">
            <div class="flex items-center gap-2 mb-1">
              <Icon :icon="sense.icon" class="w-4 h-4 text-forest" />
              <p class="text-xs font-medium text-charcoal">{{ sense.name }}</p>
            </div>
            <p class="text-sm text-charcoal">{{ lastWalk.sensoryNotes[sense.id] || '(no notes)' }}</p>
          </div>
        </div>
      </div>
      
      <button
        @click="showSummary = false"
        class="mt-2 px-6 py-2 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Done
      </button>
    </div>


  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import { useTimer } from '../composables/useTimer.js';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';
import { startForestAmbient, stopForestAmbient } from '../utils/audio.js';

const { isRunning, elapsed, formattedTime, start, stop, reset } = useTimer();
const data = useStorage('michi_shinrin', { walks: [] });
const { showToast } = useToast();

const walkActive = ref(false);
const showNotes = ref(false);
const showSummary = ref(false);
const lastWalk = ref(null);
const notes = reactive({ sight: '', sound: '', smell: '', touch: '' });

const senses = [
  { id: 'sight', name: 'Sight', icon: 'lucide:eye', prompt: 'What do you see?' },
  { id: 'sound', name: 'Sound', icon: 'lucide:ear', prompt: 'What do you hear?' },
  { id: 'smell', name: 'Smell', icon: 'lucide:cloud', prompt: 'What do you smell?' },
  { id: 'touch', name: 'Touch', icon: 'lucide:hand', prompt: 'What do you feel?' },
];

function startWalk() {
  walkActive.value = true;
  startForestAmbient();
  start();
}

function endWalk() {
  stop();
  stopForestAmbient();
  walkActive.value = false;
  showNotes.value = true;
}

function saveWalk() {
  const walkData = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    duration: elapsed.value,
    sensoryNotes: { ...notes },
  };

  data.value.walks.unshift(walkData);
  lastWalk.value = walkData;

  showNotes.value = false;
  showToast('Forest walk saved', 'success');
  triggerHaptic();
  reset();
  Object.keys(notes).forEach(k => notes[k] = '');
  
  showSummary.value = true;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
</script>
