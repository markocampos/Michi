<template>
  <div class="flex flex-col items-center justify-start w-full pt-2 pb-10 sm:pt-4 sm:pb-14 gap-0">
    <div class="flex items-center justify-between w-full px-4 mb-4">
      <div class="w-10"></div>
      <div class="text-center">
        <Icon icon="lucide:wind" class="w-10 h-10 text-forest mx-auto mb-3" />
        <h1 class="text-2xl font-bold text-charcoal">Ma</h1>
        <p class="text-sm text-muted mt-1">間 - The space between</p>
      </div>
      <button
        @click="showMixer = true"
        aria-label="Open soundscapes mixer"
        class="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center hover:bg-forest/20 transition-colors"
      >
        <Icon icon="lucide:sliders-horizontal" class="w-5 h-5" />
      </button>
    </div>

    <AudioMixer
      :show="showMixer"
      @close="showMixer = false"
      @voice-changed="v => activeVoicePack = v"
    />

    <DailyPrompt practiceId="ma" />

    <div class="relative mb-8 flex items-center justify-center">
      <div
        class="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 transition-all duration-1000 flex items-center justify-center"
        :class="isRunning ? 'border-forest scale-110' : 'border-gray-200'"
        :style="{ transform: `scale(${isRunning ? Math.min(1 + progress * 0.2, 1.2) : 1})` }"
      >
        <div class="text-center">
          <p class="text-3xl font-light text-charcoal">{{ isRunning ? remaining : formattedTime }}</p>
          <p class="text-xs text-muted mt-1">{{ isRunning ? 'remaining' : 'elapsed' }}</p>
        </div>
      </div>
      <div
        v-if="isRunning"
        class="absolute inset-0 rounded-full border-4 border-forest/20 animate-ping"
        style="animation-duration: 4s;"
      />
    </div>

    <!-- Duration picker — hidden while preparing so user only sees the loader -->
    <div v-if="!isRunning && elapsed === 0 && !isPreparing" class="flex gap-3 mb-8">
      <button
        v-for="d in durations"
        :key="d.value"
        @click="setDuration(d.value)"
        class="px-4 py-2 rounded-xl text-sm transition-all"
        :class="targetDuration === d.value ? 'bg-forest text-white' : 'glass border border-gray-100/50 text-muted'"
      >
        {{ d.label }}
      </button>
    </div>

    <div class="flex flex-col items-center gap-3">
      <div class="flex gap-4 items-end">

        <!-- Start / Pause -->
        <div class="flex flex-col items-center gap-1.5">
          <button
            v-if="!isRunning"
            @click="handleStart"
            :disabled="isPreparing"
            aria-label="Start meditation timer"
            class="w-16 h-16 rounded-full text-white flex items-center justify-center transition-colors shadow-lg"
            :class="isPreparing ? 'bg-forest/50 cursor-not-allowed' : 'bg-forest hover:bg-forest-dark hover:shadow-xl'"
          >
            <Icon :icon="isPreparing ? 'lucide:loader-2' : 'lucide:play'" class="w-6 h-6" :class="{'animate-spin': isPreparing}" />
          </button>
          <button
            v-else
            @click="stop"
            aria-label="Pause meditation timer"
            class="w-16 h-16 rounded-full bg-torii text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-lg"
          >
            <Icon icon="lucide:pause" class="w-6 h-6" />
          </button>
          <span class="text-[10px] text-muted tracking-wide">
            {{ isPreparing ? 'loading…' : isRunning ? 'pause' : elapsed > 0 ? 'resume' : 'start' }}
          </span>
        </div>

        <!-- Reset — hold 2 s to confirm -->
        <div v-if="elapsed > 0 && !isRunning && !isPreparing" class="flex flex-col items-center gap-1.5">
          <button
            aria-label="Hold to reset timer"
            class="relative w-16 h-16 rounded-full bg-white border border-gray-200 text-muted flex items-center justify-center select-none touch-none overflow-hidden transition-transform"
            :class="resetHolding ? 'scale-105 border-red-300 text-red-400' : 'hover:bg-gray-50'"
            @mousedown="startResetHold"
            @mouseup="stopResetHold"
            @mouseleave="stopResetHold"
            @touchstart.prevent="startResetHold"
            @touchend.prevent="stopResetHold"
            @touchcancel="stopResetHold"
            @contextmenu.prevent
          >
            <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32" cy="32" r="27"
                fill="none"
                stroke="#c0392b"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="`${2 * Math.PI * 27}`"
                :stroke-dashoffset="`${(1 - resetHoldProgress) * 2 * Math.PI * 27}`"
                class="transition-none opacity-60"
              />
            </svg>
            <Icon icon="lucide:rotate-ccw" class="w-5 h-5 relative z-10" />
          </button>
          <span class="text-[10px] tracking-wide transition-colors" :class="resetHolding ? 'text-red-400 font-medium' : 'text-muted'">
            {{ resetHolding ? 'releasing…' : 'hold to reset' }}
          </span>
        </div>

        <!-- Save — hold 5 s to confirm -->
        <div v-if="elapsed > 0 && !isRunning && !wasSaved && !isPreparing" class="flex flex-col items-center gap-1.5">
          <button
            aria-label="Hold to save session"
            class="relative w-16 h-16 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center select-none touch-none overflow-hidden transition-transform"
            :class="saveHolding ? 'scale-105' : 'hover:bg-forest/20'"
            @mousedown="startSaveHold"
            @mouseup="stopSaveHold"
            @mouseleave="stopSaveHold"
            @touchstart.prevent="startSaveHold"
            @touchend.prevent="stopSaveHold"
            @touchcancel="stopSaveHold"
            @contextmenu.prevent
          >
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="27"
            fill="none"
            stroke="#2d6a4f"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="`${2 * Math.PI * 27}`"
            :stroke-dashoffset="`${(1 - saveHoldProgress) * 2 * Math.PI * 27}`"
            class="transition-none opacity-70"
          />
        </svg>
          <Icon icon="lucide:check" class="w-5 h-5 relative z-10" />
          </button>
          <span class="text-[10px] tracking-wide transition-colors" :class="saveHolding ? 'text-forest font-medium' : 'text-muted'">
            {{ saveHolding ? 'keep holding…' : 'hold to save' }}
          </span>
        </div>

      </div>
    </div>

    <div v-if="wasSaved" class="glass rounded-2xl p-4 shadow-sm border border-gray-100/50 mt-6 text-center">
      <p class="text-sm text-forest">Session complete. {{ elapsed < 60 ? elapsed + ' seconds' : Math.round(elapsed / 60) + ' minutes' }} of presence.</p>
    </div>
  </div>

  <!-- ── Exit Confirmation Modal ───────────────────────────────────────── -->
  <Teleport to="body">
    <!-- Overlay: fades independently so blur animates cleanly -->
    <Transition name="overlay-fade">
      <div
        v-if="showExitModal"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
        @click="cancelExit"
      />
    </Transition>

    <!-- Card: springs in from below overlay layer -->
    <Transition name="card-pop">
      <div
        v-if="showExitModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none"
      >
        <div class="pointer-events-auto bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-5 border border-gray-100">
          <div class="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center">
            <Icon icon="lucide:pause-circle" class="w-7 h-7 text-forest" />
          </div>

          <div class="text-center">
            <h2 class="text-xl font-bold text-charcoal mb-1">Leave your session?</h2>
            <p class="text-sm text-muted leading-relaxed">
              Hold <span class="font-semibold text-charcoal">Confirm Exit</span> for 3 seconds to leave, or tap anywhere outside to go back.
            </p>
          </div>

          <!-- Hold-to-exit: horizontal fill sweep -->
          <button
            aria-label="Hold to confirm exit"
            class="relative w-full h-14 rounded-2xl border-2 text-sm font-semibold flex items-center justify-center gap-2 select-none touch-none overflow-hidden transition-transform"
            :class="exitHolding
              ? 'bg-torii/10 border-torii/40 text-torii scale-[1.02]'
              : 'bg-torii/5 border-torii/20 text-torii hover:bg-torii/10'"
            @mousedown="startExitHold"
            @mouseup="stopExitHold"
            @mouseleave="stopExitHold"
            @touchstart.prevent="startExitHold"
            @touchend.prevent="stopExitHold"
            @touchcancel="stopExitHold"
            @contextmenu.prevent
          >
            <div
              class="absolute inset-0 bg-torii/20 origin-left"
              :style="{ transform: `scaleX(${exitHoldProgress})` }"
            />
            <Icon icon="lucide:log-out" class="w-4 h-4 relative z-10" />
            <span class="relative z-10">{{ exitHolding ? 'Keep holding…' : 'Hold to Confirm Exit' }}</span>
          </button>

          <!-- Cancel -->
          <button
            @click="cancelExit"
            class="w-full h-12 rounded-2xl bg-forest text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-forest/90 transition-colors shadow-md"
          >
            <Icon icon="lucide:arrow-left" class="w-4 h-4" />
            Back to Session
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { watch, ref, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useTimer } from '../composables/useTimer.js';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';
import { playBowlSound, initAudio, startMeditationAmbient, updateMeditationAmbient, stopMeditationAmbient, playVoice, preloadVoices, playIntro, stopVoice } from '../utils/audio.js';
import AudioMixer from '../components/AudioMixer.vue';

const router = useRouter();

const showMixer   = ref(false);
const isPreparing = ref(false);
const activeVoicePack = ref('neutral');

const timer = useTimer();
const { showToast } = useToast();
const { isRunning, elapsed, progress, formattedTime, remaining, start, reset, setDuration, targetDuration } = timer;
const data = useStorage('michi_ma', { sessions: [] });

// ── Scroll lock whenever exit modal is open ────────────────────────────────
const showExitModal = ref(false);
watch(showExitModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

// ── Route-leave guard ──────────────────────────────────────────────────────
let pendingRoute = null;
let wasRunningBeforeModal = false;
let allowLeave = false;

onBeforeRouteLeave((to, _from, next) => {
  if (!allowLeave && elapsed.value > 0) {
    pendingRoute = to.fullPath;
    wasRunningBeforeModal = isRunning.value;
    if (isRunning.value) timer.stop();
    showExitModal.value = true;
    next(false);
  } else {
    next();
  }
});

function cancelExit() {
  showExitModal.value = false;
  stopExitHold();
  if (wasRunningBeforeModal) start();
  pendingRoute = null;
  wasRunningBeforeModal = false;
}

function confirmExit() {
  showExitModal.value = false;
  stopExitHold();
  stopVoice();
  stopMeditationAmbient();
  allowLeave = true;
  if (pendingRoute) router.push(pendingRoute);
}

// ── Hold — Exit (3 s) ──────────────────────────────────────────────────────
const exitHoldProgress = ref(0);
const exitHolding      = ref(false);
let   exitHoldTimer    = null;

function startExitHold() {
  exitHolding.value = true;
  const t0 = Date.now();
  exitHoldTimer = setInterval(() => {
    exitHoldProgress.value = Math.min((Date.now() - t0) / 3000, 1);
    if (exitHoldProgress.value >= 1) {
      clearInterval(exitHoldTimer); exitHoldTimer = null;
      confirmExit();
    }
  }, 16);
}
function stopExitHold() {
  exitHolding.value      = false;
  exitHoldProgress.value = 0;
  if (exitHoldTimer) { clearInterval(exitHoldTimer); exitHoldTimer = null; }
}

// ── Hold — Reset (2 s) ─────────────────────────────────────────────────────
const resetHoldProgress = ref(0);
const resetHolding      = ref(false);
let   resetHoldTimer    = null;

function startResetHold() {
  resetHolding.value = true;
  const t0 = Date.now();
  resetHoldTimer = setInterval(() => {
    resetHoldProgress.value = Math.min((Date.now() - t0) / 2000, 1);
    if (resetHoldProgress.value >= 1) {
      clearInterval(resetHoldTimer); resetHoldTimer = null;
      stopSaveHold();
      reset();
      stopResetHold();
    }
  }, 16);
}
function stopResetHold() {
  resetHolding.value      = false;
  resetHoldProgress.value = 0;
  if (resetHoldTimer) { clearInterval(resetHoldTimer); resetHoldTimer = null; }
}

// ── Hold — Save (5 s) ──────────────────────────────────────────────────────
const saveHoldProgress = ref(0);
const saveHolding      = ref(false);
let   saveHoldTimer    = null;

function startSaveHold() {
  saveHolding.value = true;
  const t0 = Date.now();
  saveHoldTimer = setInterval(() => {
    saveHoldProgress.value = Math.min((Date.now() - t0) / 5000, 1);
    if (saveHoldProgress.value >= 1) {
      clearInterval(saveHoldTimer); saveHoldTimer = null;
      saveSession();
      stopSaveHold();
    }
  }, 16);
}
function stopSaveHold() {
  saveHolding.value      = false;
  saveHoldProgress.value = 0;
  if (saveHoldTimer) { clearInterval(saveHoldTimer); saveHoldTimer = null; }
}

// ── Timer config ───────────────────────────────────────────────────────────
const durations = [
  { label: '2 min',  value: 120 },
  { label: '5 min',  value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
];

onBeforeUnmount(() => {
  timer.stop();
  stopMeditationAmbient();
  stopVoice();
  stopExitHold();
  stopResetHold();
  stopSaveHold();
  document.body.style.overflow = ''; // always release scroll lock
});

const wasSaved = ref(false);
watch(isRunning, (running, wasRunning) => {
  if (!running && wasRunning) {
    stopMeditationAmbient();
    if (elapsed.value >= targetDuration.value && !wasSaved.value) saveSession();
  }
  if (running) wasSaved.value = false;
});

watch(progress, (p) => { if (isRunning.value) updateMeditationAmbient(p); });

// Ma breathing — 4-7-8 cycle (19 s)
watch(elapsed, (val) => {
  if (!isRunning.value) return;
  const c = val % 19;
  if (c === 0)  playVoice('inhale', activeVoicePack.value);
  else if (c === 4)  playVoice('hold',   activeVoicePack.value);
  else if (c === 11) playVoice('exhale', activeVoicePack.value);
});

async function handleStart() {
  if (isPreparing.value) return;
  initAudio();
  isPreparing.value = true;
  try {
    await preloadVoices(activeVoicePack.value);
    playBowlSound();
    await playIntro(activeVoicePack.value);
    await new Promise(r => setTimeout(r, 1200));
    isPreparing.value = false;
    startMeditationAmbient();
    playVoice('inhale', activeVoicePack.value);
    start();
  } catch (err) {
    console.error(err);
    isPreparing.value = false;
    showToast('Failed to start session', 'error');
  }
}

function saveSession() {
  wasSaved.value = true;
  playBowlSound();
  data.value.sessions.push({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    duration: elapsed.value,
  });
  showToast('Meditation session saved', 'success');
  triggerHaptic();
}

function stop() { timer.stop(); }
</script>

<style scoped>
/* Overlay fades cleanly so backdrop-blur animates properly */
.overlay-fade-enter-active,
.overlay-fade-leave-active  { transition: opacity 0.3s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to      { opacity: 0; }

/* Card springs up from slightly below */
.card-pop-enter-active  { transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.34, 1.4, 0.64, 1); }
.card-pop-leave-active  { transition: opacity 0.2s ease, transform 0.2s ease; }
.card-pop-enter-from,
.card-pop-leave-to      { opacity: 0; transform: translateY(24px) scale(0.96); }
</style>
