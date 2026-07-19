<template>
  <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Background atmospheric glow -->
    <div class="absolute inset-0 bg-gradient-to-t from-forest/5 to-transparent pointer-events-none" />

    <div class="mb-2 z-10 relative">
      <svg width="120" height="120" viewBox="0 0 120 120" class="drop-shadow-sm">
        <!-- Stage 12: Golden Sun -->
        <g v-if="stage >= 12" class="animate-fade-in">
          <circle cx="60" cy="40" r="35" fill="#FFD700" opacity="0.2" class="animate-pulse" />
          <circle cx="60" cy="40" r="25" fill="#FFB700" opacity="0.4" />
          <circle cx="60" cy="40" r="15" fill="#FFA000" opacity="0.8" />
        </g>

        <!-- Stage 11: Mount Fuji -->
        <g v-if="stage >= 11" class="animate-fade-in">
          <path d="M10 95 L60 45 L110 95 Z" fill="#78909C" />
          <path d="M42 63 L60 45 L78 63 L70 68 L60 58 L50 68 Z" fill="#FFFFFF" />
        </g>

        <!-- Stage 10: Torii Gate -->
        <g v-if="stage >= 10" class="animate-fade-in">
          <!-- Red Torii -->
          <rect x="25" y="35" width="70" height="6" fill="#D32F2F" rx="2" />
          <rect x="30" y="45" width="60" height="4" fill="#D32F2F" rx="1" />
          <rect x="35" y="35" width="6" height="55" fill="#B71C1C" />
          <rect x="79" y="35" width="6" height="55" fill="#B71C1C" />
        </g>

        <!-- Stage 7: Sand ripples (base ground) -->
        <g v-if="stage >= 7" class="animate-fade-in">
          <path d="M10 115 Q30 110 60 115 T110 115" fill="none" stroke="#E0E0E0" stroke-width="2" />
          <path d="M15 118 Q35 113 65 118 T105 118" fill="none" stroke="#E0E0E0" stroke-width="2" />
          <path d="M5 112 Q25 107 55 112 T115 112" fill="none" stroke="#E0E0E0" stroke-width="1.5" />
        </g>

        <!-- Pot (Always visible) -->
        <g class="animate-fade-in">
          <path d="M40 100 L80 100 L75 110 L45 110 Z" fill="#4a4a4a" />
          <rect x="35" y="95" width="50" height="5" fill="#333333" rx="2" />
        </g>

        <!-- Tree stages (1 to 5+) -->
        <!-- Stage 1: Seed (Streak 0-2) -->
        <g v-if="stage === 1" class="animate-fade-in">
          <circle cx="60" cy="92" r="3" fill="#8B5A2B" />
          <path d="M60 92 Q62 88 65 89" fill="none" stroke="#6B8E23" stroke-width="1.5" stroke-linecap="round" />
        </g>

        <!-- Stage 2: Sprout (Streak 3-6) -->
        <g v-if="stage === 2" class="animate-fade-in">
          <path d="M60 95 Q60 80 62 75" fill="none" stroke="#556B2F" stroke-width="2" stroke-linecap="round" />
          <!-- Leaves -->
          <path d="M62 82 Q70 80 68 75 Q62 76 62 82 Z" fill="#8FBC8F" />
          <path d="M61 78 Q50 75 52 70 Q58 72 61 78 Z" fill="#6B8E23" />
        </g>

        <!-- Stage 3: Sapling (Streak 7-14) -->
        <g v-if="stage === 3" class="animate-fade-in">
          <!-- Trunk -->
          <path d="M60 95 Q58 75 62 60" fill="none" stroke="#5C4033" stroke-width="3" stroke-linecap="round" />
          <path d="M61 75 Q75 65 72 55" fill="none" stroke="#5C4033" stroke-width="2" stroke-linecap="round" />
          <!-- Foliage -->
          <circle cx="62" cy="58" r="10" fill="#6B8E23" opacity="0.9" />
          <circle cx="72" cy="53" r="8" fill="#8FBC8F" opacity="0.9" />
          <circle cx="56" cy="65" r="7" fill="#556B2F" opacity="0.9" />
        </g>

        <!-- Stage 4: Bonsai Tree (Streak 15-29) -->
        <g v-if="stage === 4" class="animate-fade-in">
          <!-- Trunk -->
          <path d="M60 95 Q55 70 65 45" fill="none" stroke="#4A3020" stroke-width="5" stroke-linecap="round" />
          <path d="M58 80 Q40 70 35 60" fill="none" stroke="#4A3020" stroke-width="3" stroke-linecap="round" />
          <path d="M62 65 Q80 55 85 45" fill="none" stroke="#4A3020" stroke-width="3" stroke-linecap="round" />
          <!-- Foliage Clusters -->
          <circle cx="65" cy="42" r="14" fill="#556B2F" />
          <circle cx="72" cy="46" r="12" fill="#6B8E23" />
          <circle cx="58" cy="48" r="10" fill="#8FBC8F" />
          <circle cx="35" cy="58" r="11" fill="#6B8E23" />
          <circle cx="42" cy="62" r="9" fill="#556B2F" />
          <circle cx="85" cy="43" r="10" fill="#8FBC8F" />
          <circle cx="80" cy="48" r="8" fill="#556B2F" />
        </g>

        <!-- Stage 5+: Blooming Zen Bonsai (Streak 30+) -->
        <g v-if="stage >= 5" class="animate-fade-in">
          <!-- Thick Trunk -->
          <path d="M60 95 Q50 65 65 35" fill="none" stroke="#3A2010" stroke-width="6" stroke-linecap="round" />
          <path d="M57 80 Q35 65 25 55" fill="none" stroke="#3A2010" stroke-width="4" stroke-linecap="round" />
          <path d="M62 60 Q85 50 95 40" fill="none" stroke="#3A2010" stroke-width="4" stroke-linecap="round" />
          
          <!-- Foliage Base -->
          <circle cx="65" cy="32" r="16" fill="#4A5D23" />
          <circle cx="75" cy="36" r="14" fill="#556B2F" />
          <circle cx="55" cy="38" r="12" fill="#6B8E23" />
          <circle cx="25" cy="52" r="13" fill="#556B2F" />
          <circle cx="33" cy="58" r="11" fill="#4A5D23" />
          <circle cx="95" cy="38" r="12" fill="#6B8E23" />
          <circle cx="88" cy="44" r="10" fill="#4A5D23" />

          <!-- Cherry Blossoms (Pink dots) -->
          <circle cx="60" cy="28" r="2.5" fill="#FFB7C5" />
          <circle cx="68" cy="25" r="2" fill="#FFC0CB" />
          <circle cx="78" cy="30" r="2.5" fill="#FFB7C5" />
          <circle cx="52" cy="34" r="2" fill="#FFC0CB" />
          <circle cx="70" cy="40" r="1.5" fill="#FFB7C5" />
          <circle cx="22" cy="48" r="2" fill="#FFB7C5" />
          <circle cx="28" cy="45" r="2.5" fill="#FFC0CB" />
          <circle cx="18" cy="55" r="1.5" fill="#FFB7C5" />
          <circle cx="98" cy="34" r="2" fill="#FFB7C5" />
          <circle cx="92" cy="32" r="2.5" fill="#FFC0CB" />
          
          <!-- Falling petal -->
          <path d="M72 50 Q75 55 70 60" fill="none" stroke="#FFB7C5" stroke-width="1.5" class="animate-pulse" />
          <circle cx="70" cy="62" r="1.5" fill="#FFB7C5" class="animate-pulse" />
        </g>

        <!-- Stage 6: Moss -->
        <g v-if="stage >= 6" class="animate-fade-in">
          <path d="M38 95 Q60 88 82 95 Z" fill="#6B8E23" opacity="0.9" />
          <circle cx="45" cy="94" r="3" fill="#556B2F" />
          <circle cx="75" cy="94" r="4" fill="#4A5D23" />
        </g>

        <!-- Stage 8: Zen Rocks -->
        <g v-if="stage >= 8" class="animate-fade-in">
          <!-- Left Rocks -->
          <path d="M15 110 Q22 100 32 110 Z" fill="#757575" />
          <path d="M22 112 Q28 106 35 112 Z" fill="#9E9E9E" />
          <!-- Right Rock -->
          <path d="M85 108 Q92 98 102 108 Z" fill="#616161" />
        </g>

        <!-- Stage 9: Stone Lantern (Toro) -->
        <g v-if="stage >= 9" class="animate-fade-in">
          <rect x="87" y="88" width="8" height="20" fill="#757575" />
          <polygon points="80,88 102,88 95,83 87,83" fill="#616161" />
          <rect x="89" y="77" width="4" height="6" fill="#9E9E9E" />
          <polygon points="78,77 104,77 91,68 91,68" fill="#757575" />
          <circle cx="91" cy="73" r="2" fill="#FFB700" opacity="0.8" class="animate-pulse" />
        </g>

      </svg>
    </div>
    
    <div class="text-center z-10">
      <h3 class="font-bold text-charcoal text-lg">{{ stageName }}</h3>
      <p class="text-xs text-muted mt-1">{{ stageDescription }}</p>
      
      <div class="mt-3 flex items-center justify-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50">
        <span class="text-sm font-bold" :class="streak > 0 ? 'text-forest' : 'text-muted'">{{ streak }}</span>
        <Icon icon="lucide:flame" class="w-4 h-4" :class="streak > 0 ? 'text-torii' : 'text-gray-300'" />
        <span class="text-xs font-medium text-gray-500">Day Streak</span>
      </div>

      <div v-if="milestone" class="mt-2 px-3 py-1 bg-forest/20 rounded-full inline-block">
        <p class="text-xs font-medium text-forest">{{ milestone }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  streak: {
    type: Number,
    required: true
  },
  milestone: {
    type: String,
    default: ''
  }
});

const stage = computed(() => {
  const s = props.streak;
  if (s >= 100) return 12;
  if (s >= 90) return 11;
  if (s >= 80) return 10;
  if (s >= 70) return 9;
  if (s >= 60) return 8;
  if (s >= 50) return 7;
  if (s >= 40) return 6;
  if (s >= 30) return 5;
  if (s >= 15) return 4;
  if (s >= 7) return 3;
  if (s >= 3) return 2;
  return 1;
});

const stageName = computed(() => {
  switch (stage.value) {
    case 12: return 'Absolute Enlightenment';
    case 11: return 'Peak of Mindfulness';
    case 10: return 'Gateway to Stillness';
    case 9: return 'Lantern of Wisdom';
    case 8: return 'Garden of Stones';
    case 7: return 'Serene Zen Garden';
    case 6: return 'Ancient Moss Bonsai';
    case 5: return 'Blooming Bonsai';
    case 4: return 'Established Pine';
    case 3: return 'Growing Sapling';
    case 2: return 'Young Sprout';
    default: return 'Planted Seed';
  }
});

const stageDescription = computed(() => {
  switch (stage.value) {
    case 12: return 'A century of peace. Pure radiance.';
    case 11: return 'Your mind is as still as the mountain.';
    case 10: return 'You have crossed the threshold.';
    case 9: return 'Your habits light the way.';
    case 8: return 'Foundations of unshakeable calm.';
    case 7: return 'Ripples of peace in daily life.';
    case 6: return 'Time has nurtured your roots.';
    case 5: return 'Absolute consistency. A beautiful mind.';
    case 4: return 'Your roots are deep. Keep growing.';
    case 3: return 'Habits are taking shape.';
    case 2: return 'Life emerges through practice.';
    default: return 'Water it daily to watch it grow.';
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
