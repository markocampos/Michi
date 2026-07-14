<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:trees" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Shinrin-yoku</h1>
      <p class="text-sm text-muted mt-1">森林浴 - Forest bathing</p>
    </div>

    <div v-if="!walkActive && !showNotes">
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

    <div v-if="data.walks.length > 0" class="mt-8">
      <h3 class="font-semibold text-charcoal mb-3">Past Walks</h3>
      <div v-for="walk in data.walks" :key="walk.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50 mb-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs text-muted">{{ walk.date }}</span>
          <span class="text-xs text-forest">{{ Math.max(1, Math.round(walk.duration / 60)) }} min</span>
        </div>
        <div v-if="walk.sensoryNotes" class="grid grid-cols-2 gap-2">
          <p v-for="(val, key) in walk.sensoryNotes" :key="key" class="text-xs text-charcoal">
            <span class="text-muted">{{ key }}:</span> {{ val || '-' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import { useTimer } from '../composables/useTimer.js';
import { useStorage } from '../composables/useStorage.js';

const { isRunning, elapsed, formattedTime, start, stop, reset } = useTimer();
const data = useStorage('michi_shinrin', { walks: [] });

const walkActive = ref(false);
const showNotes = ref(false);
const notes = reactive({ sight: '', sound: '', smell: '', touch: '' });

const senses = [
  { id: 'sight', name: 'Sight', icon: 'lucide:eye', prompt: 'What do you see?' },
  { id: 'sound', name: 'Sound', icon: 'lucide:ear', prompt: 'What do you hear?' },
  { id: 'smell', name: 'Smell', icon: 'lucide:nose', prompt: 'What do you smell?' },
  { id: 'touch', name: 'Touch', icon: 'lucide:hand', prompt: 'What do you feel?' },
];

function startWalk() {
  walkActive.value = true;
  start();
}

function endWalk() {
  stop();
  walkActive.value = false;
  showNotes.value = true;
}

function saveWalk() {
  data.value.walks.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    duration: elapsed.value,
    sensoryNotes: { ...notes },
  });
  showNotes.value = false;
  reset();
  Object.keys(notes).forEach(k => notes[k] = '');
}
</script>
