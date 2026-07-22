<template>
  <BottomSheet :model-value="show" @close="$emit('cancel')">
    <!-- Header -->
    <div class="pt-2 pb-4">
      <div class="w-12 h-12 rounded-2xl bg-torii/10 flex items-center justify-center mb-4">
        <Icon :icon="icon" class="w-6 h-6 text-torii" />
      </div>
      <h2 class="text-lg font-bold text-charcoal mb-1">{{ title }}</h2>
      <p class="text-sm text-muted leading-relaxed">{{ description }}</p>
    </div>

    <!-- PIN step (if required) -->
    <div v-if="requirePin && step === 'pin'" class="pb-2">
      <p class="text-xs font-medium text-charcoal mb-3">Enter your PIN to continue</p>
      <div class="flex justify-center gap-2 mb-4 transition-transform" :class="shakeError ? 'shake' : ''">
        <div
          v-for="i in 4"
          :key="i"
          class="w-11 h-11 rounded-xl border-2 flex items-center justify-center text-base font-bold transition-all"
          :class="i <= pinInput.length ? (shakeError ? 'border-torii bg-torii/10 text-torii' : 'border-forest bg-forest/10 text-forest') : 'border-gray-200 bg-gray-50'"
        >
          {{ i <= pinInput.length ? '•' : '' }}
        </div>
      </div>
      <p v-if="pinError" class="text-xs text-torii text-center mb-3 min-h-[16px]">{{ pinError }}</p>
      <div v-else class="mb-3 min-h-[16px]" />
      
      <div class="grid grid-cols-3 gap-3 mb-6">
        <button @click="addPinDigit(1)" :disabled="isLockedOut" aria-label="Digit 1" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">1</button>
        <button @click="addPinDigit(2)" :disabled="isLockedOut" aria-label="Digit 2" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">2</button>
        <button @click="addPinDigit(3)" :disabled="isLockedOut" aria-label="Digit 3" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">3</button>
        <button @click="addPinDigit(4)" :disabled="isLockedOut" aria-label="Digit 4" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">4</button>
        <button @click="addPinDigit(5)" :disabled="isLockedOut" aria-label="Digit 5" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">5</button>
        <button @click="addPinDigit(6)" :disabled="isLockedOut" aria-label="Digit 6" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">6</button>
        <button @click="addPinDigit(7)" :disabled="isLockedOut" aria-label="Digit 7" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">7</button>
        <button @click="addPinDigit(8)" :disabled="isLockedOut" aria-label="Digit 8" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">8</button>
        <button @click="addPinDigit(9)" :disabled="isLockedOut" aria-label="Digit 9" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">9</button>
        <div class="h-12"></div>
        <button @click="addPinDigit(0)" :disabled="isLockedOut" aria-label="Digit 0" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-base font-medium text-charcoal active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">0</button>
        <button @click="removeDigit" :disabled="isLockedOut" aria-label="Delete last digit" class="h-12 rounded-xl bg-gray-50 border border-gray-200 text-muted active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100">
          <Icon icon="lucide:delete" class="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>

    <!-- Phrase confirmation step -->
    <div v-if="step === 'phrase'" class="pb-2">
      <div class="bg-torii/5 rounded-xl px-3 py-2 mb-3 border border-torii/15">
        <p class="text-xs text-torii font-medium">⚠️ This action cannot be undone.</p>
      </div>
      <p class="text-xs text-muted mb-2">
        Type <span class="font-mono font-bold text-charcoal">{{ confirmPhrase }}</span> to confirm
      </p>
      <input
        v-model="phraseInput"
        :placeholder="confirmPhrase"
        type="text"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        class="w-full px-4 py-3 border-2 rounded-xl text-sm font-mono text-charcoal focus:outline-none transition-colors mb-4"
        :class="phraseMatches ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 bg-gray-50 focus:border-gray-300'"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <button
        @click="$emit('cancel')"
        class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium text-sm hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        v-if="step === 'phrase'"
        @click="confirmAction"
        :disabled="!phraseMatches"
        class="flex-1 py-3 rounded-xl bg-torii text-white font-medium text-sm disabled:opacity-30 transition-opacity"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </BottomSheet>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { verifyPin } from '../utils/pin.js';
import BottomSheet from './BottomSheet.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  confirmPhrase: { type: String, default: 'DELETE' },
  confirmLabel: { type: String, default: 'Confirm' },
  icon: { type: String, default: 'lucide:alert-triangle' },
  requirePin: { type: Boolean, default: false },
  storedPin: { type: String, default: '' },
  skipPhrase: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel']);

const step = ref(props.requirePin ? 'pin' : (props.skipPhrase ? '' : 'phrase'));
const pinInput = ref('');
const pinError = ref('');
const phraseInput = ref('');
const shakeError = ref(false);

const isLockedOut = ref(false);
let timer = null;

function triggerShake() {
  shakeError.value = true;
  setTimeout(() => { shakeError.value = false; }, 600);
}

const phraseMatches = computed(() => {
  if (props.skipPhrase) return true;
  return phraseInput.value.trim().toUpperCase() === props.confirmPhrase.toUpperCase();
});

function updateLockoutState() {
  const lockoutUntil = parseInt(localStorage.getItem('michi_pin_lockout_until') || '0');
  const now = Date.now();

  if (lockoutUntil > now) {
    isLockedOut.value = true;
    const remainingMs = lockoutUntil - now;
    const remainingMins = Math.ceil(remainingMs / 60000);
    pinError.value = `Too many attempts. Try again in ${remainingMins} minute${remainingMins > 1 ? 's' : ''}.`;
  } else {
    isLockedOut.value = false;
    if (pinError.value && pinError.value.includes('Too many attempts')) {
      pinError.value = '';
    }
  }
}

watch(() => props.show, (show) => {
  if (show) {
    step.value = props.requirePin ? 'pin' : (props.skipPhrase ? '' : 'phrase');
    pinInput.value = '';
    pinError.value = '';
    phraseInput.value = '';
    shakeError.value = false;
    
    if (props.requirePin) {
      updateLockoutState();
      timer = setInterval(updateLockoutState, 1000);
    }
    if (!props.requirePin && props.skipPhrase) {
      emit('confirm');
    }
  } else {
    if (timer) clearInterval(timer);
    timer = null;
  }
}, { immediate: true });

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleFailedAttempt() {
  let attempts = parseInt(localStorage.getItem('michi_pin_attempts') || '0');
  attempts++;
  localStorage.setItem('michi_pin_attempts', attempts.toString());

  const now = Date.now();
  if (attempts >= 20) {
    localStorage.setItem('michi_pin_lockout_until', (now + 20 * 60 * 1000).toString());
    updateLockoutState();
  } else if (attempts >= 5 && attempts % 5 === 0 && attempts < 20) {
    localStorage.setItem('michi_pin_lockout_until', (now + 5 * 60 * 1000).toString());
    updateLockoutState();
  }
}

function handleSuccessfulAttempt() {
  localStorage.removeItem('michi_pin_attempts');
  localStorage.removeItem('michi_pin_lockout_until');
}

async function addPinDigit(n) {
  if (pinInput.value.length >= 4 || isLockedOut.value) return;
  pinInput.value += n;
  pinError.value = '';

  if (pinInput.value.length === 4) {
    if (await verifyPin(pinInput.value, props.storedPin)) {
      handleSuccessfulAttempt();
      if (props.skipPhrase) {
        emit('confirm');
      } else {
        step.value = 'phrase';
      }
      pinInput.value = '';
    } else {
      handleFailedAttempt();
      triggerShake();
      if (!isLockedOut.value) {
        pinError.value = 'Wrong PIN. Try again.';
      }
      setTimeout(() => { pinInput.value = ''; if (!isLockedOut.value) pinError.value = ''; }, 600);
    }
  }
}

function removeDigit() {
  if (isLockedOut.value) return;
  pinInput.value = pinInput.value.slice(0, -1);
  pinError.value = '';
}

function confirmAction() {
  if (!phraseMatches.value) return;
  emit('confirm');
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}
.shake {
  animation: shake 0.5s ease-in-out;
}
</style>
