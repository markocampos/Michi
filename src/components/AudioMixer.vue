<template>
  <BottomSheet :model-value="show" @close="$emit('close')">
    <div class="p-6 pb-2 border-b border-gray-100/50 flex-shrink-0 flex items-center justify-between">
      <h2 class="text-xl font-bold text-charcoal flex items-center gap-2">
        <Icon icon="lucide:sliders-horizontal" class="w-6 h-6 text-forest" />
        Soundscapes
      </h2>
      <button @click="$emit('close')" aria-label="Close mixer" class="text-muted hover:text-charcoal transition-colors p-1 rounded-lg">
        <Icon icon="lucide:x" class="w-5 h-5" />
      </button>
    </div>

    <div class="p-6 space-y-6">
      <!-- Voice Guide -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-charcoal flex items-center gap-2">
            <Icon icon="lucide:user" class="w-4 h-4 text-forest" /> Voice Guide
          </label>
          <span class="text-xs text-muted">{{ Math.round(volumes.voice * 100) }}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.05" 
          v-model.number="volumes.voice" 
          @input="updateVolume('voice')"
          class="w-full accent-forest"
        />
        
        <!-- Voice selector -->
        <div class="mt-3">
          <label class="text-xs text-muted block mb-1">Voice</label>
          <select 
            v-model="activeVoicePack" 
            @change="updateVoicePack"
            class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-forest"
          >
            <option value="neutral">Neutral — British English (default)</option>
            <option value="deep">Deep — Canadian, very calm</option>
            <option value="serene">Serene — Australian English</option>
            <option value="warm">Warm — US English</option>
          </select>
        </div>
      </div>

      <!-- Singing Bowl -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-charcoal flex items-center gap-2">
            <Icon icon="lucide:bell" class="w-4 h-4 text-forest" /> Singing Bowl
          </label>
          <span class="text-xs text-muted">{{ Math.round(volumes.bowl * 100) }}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.05" 
          v-model.number="volumes.bowl" 
          @input="updateVolume('bowl')"
          class="w-full accent-forest"
        />
      </div>

      <!-- Wind -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-charcoal flex items-center gap-2">
            <Icon icon="lucide:wind" class="w-4 h-4 text-forest" /> Ambient Wind
          </label>
          <span class="text-xs text-muted">{{ Math.round(volumes.wind * 100) }}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.05" 
          v-model.number="volumes.wind" 
          @input="updateVolume('wind')"
          class="w-full accent-forest"
        />
      </div>

      <!-- Rain -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-charcoal flex items-center gap-2">
            <Icon icon="lucide:cloud-rain" class="w-4 h-4 text-forest" /> Soft Rain
          </label>
          <span class="text-xs text-muted">{{ Math.round(volumes.rain * 100) }}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.05" 
          v-model.number="volumes.rain" 
          @input="updateVolume('rain')"
          class="w-full accent-forest"
        />
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import BottomSheet from './BottomSheet.vue';
import { audioVolumes, setVolume } from '../utils/audio.js';

const props = defineProps({
  show: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'voice-changed']);

const volumes = ref({
  voice: 1.0,
  bowl: 1.0,
  wind: 1.0,
  rain: 1.0
});

const activeVoicePack = ref('default');

onMounted(() => {
  volumes.value.voice = audioVolumes.voice;
  volumes.value.bowl = audioVolumes.bowl;
  volumes.value.wind = audioVolumes.wind;
  volumes.value.rain = audioVolumes.rain;
  
  const savedPack = localStorage.getItem('michi_voice_pack') || 'neutral';
  activeVoicePack.value = savedPack;
  emit('voice-changed', savedPack);
});

function updateVolume(type) {
  setVolume(type, volumes.value[type]);
}

function updateVoicePack() {
  localStorage.setItem('michi_voice_pack', activeVoicePack.value);
  emit('voice-changed', activeVoicePack.value);
}
</script>
