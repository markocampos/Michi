<template>
  <div class="min-h-screen bg-gradient-to-br from-warm-white via-[#F5F5F0] to-[#EAEAE2] flex flex-col items-center justify-center px-6 select-none">
    <!-- Back button -->
    <button
      @click="goBack"
      class="absolute top-4 left-4 flex items-center gap-1 text-muted hover:text-charcoal transition-colors p-2"
      aria-label="Go back"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-sm">Back</span>
    </button>

    <!-- Main PIN UI -->
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors"
          :class="shakeError ? 'bg-torii/20' : 'bg-forest/10'"
        >
          <Icon
            icon="lucide:lock"
            class="w-8 h-8 transition-colors"
            :class="shakeError ? 'text-torii' : 'text-forest'"
          />
        </div>
        <h1 class="text-2xl font-bold text-charcoal">{{ pageTitle }}</h1>
        <p class="text-sm text-muted mt-1">{{ pageSubtitle }}</p>
      </div>

      <!-- PIN dots display -->
      <div
        class="flex justify-center gap-3 mb-6 transition-transform"
        :class="shakeError ? 'shake' : ''"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all"
          :class="i <= currentPin.length
            ? (shakeError ? 'border-torii bg-torii/10 text-torii' : 'border-forest bg-forest/10 text-forest')
            : 'border-gray-200 bg-white/50 text-muted'"
        >
          {{ i <= currentPin.length ? '•' : '' }}
        </div>
      </div>

      <!-- Error / success message -->
      <p v-if="error" class="text-xs text-torii mb-4 text-center min-h-[16px]">{{ error }}</p>
      <p v-else-if="successMsg" class="text-xs text-forest mb-4 text-center min-h-[16px] font-medium">{{ successMsg }}</p>
      <div v-else class="mb-4 min-h-[16px]" />

      <!-- Keypad -->
      <div class="w-full max-w-xs grid grid-cols-3 gap-3">
        <button
          v-for="n in 9"
          :key="n"
          @click="addDigit(n)"
          :disabled="isLockedOut"
          class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {{ n }}
        </button>
        <div />
        <button
          @click="addDigit(0)"
          :disabled="isLockedOut"
          class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          0
        </button>
        <button
          @click="removeDigit"
          :disabled="isLockedOut"
          class="h-14 rounded-xl glass border border-gray-100/50 text-sm text-muted hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          <Icon icon="lucide:delete" class="w-5 h-5 mx-auto" />
        </button>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { readPinHash, verifyPin, writePin } from '../utils/pin.js';

const router = useRouter();
const route = useRoute();

// mode: 'entry' | 'setup' | 'confirm' | 'change-verify' | 'change-new' | 'change-confirm'
const mode = ref('entry');
const currentPin = ref('');
const tempNewPin = ref('');
const error = ref('');
const successMsg = ref('');
const storedPin = ref('');
const shakeError = ref(false);

const isLockedOut = ref(false);
let timer = null;

const isChanging = computed(() => route.query.mode === 'change');

function updateLockoutState() {
  const lockoutUntil = parseInt(localStorage.getItem('michi_pin_lockout_until') || '0');
  const now = Date.now();

  if (lockoutUntil > now) {
    isLockedOut.value = true;
    const remainingMs = lockoutUntil - now;
    const remainingMins = Math.ceil(remainingMs / 60000);
    error.value = `Too many attempts. Try again in ${remainingMins} minute${remainingMins > 1 ? 's' : ''}.`;
  } else {
    isLockedOut.value = false;
    if (error.value && error.value.includes('Too many attempts')) {
      error.value = '';
    }
  }
}

onMounted(async () => {
  storedPin.value = await readPinHash();

  if (isChanging.value) {
    mode.value = storedPin.value ? 'change-verify' : 'setup';
  } else if (storedPin.value) {
    mode.value = 'entry';
  } else {
    mode.value = 'setup';
  }

  updateLockoutState();
  timer = setInterval(updateLockoutState, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const pageTitle = computed(() => {
  if (isLockedOut.value) return 'Locked Out';
  switch (mode.value) {
    case 'entry':         return 'Journal Lock';
    case 'setup':         return 'Create PIN';
    case 'confirm':       return 'Confirm PIN';
    case 'change-verify': return 'Verify Current PIN';
    case 'change-new':    return 'New PIN';
    case 'change-confirm': return 'Confirm New PIN';
    default:              return 'PIN';
  }
});

const pageSubtitle = computed(() => {
  if (isLockedOut.value) return 'Please wait before trying again';
  switch (mode.value) {
    case 'entry':         return 'Enter your PIN to open your journal';
    case 'setup':         return 'Create a 4-digit PIN to protect your journal';
    case 'confirm':       return 'Enter the PIN again to confirm';
    case 'change-verify': return 'Enter your current PIN first';
    case 'change-new':    return 'Enter your new 4-digit PIN';
    case 'change-confirm': return 'Enter the new PIN again to confirm';
    default:              return '';
  }
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

function addDigit(n) {
  if (currentPin.value.length >= 4 || isLockedOut.value) return;
  error.value = '';
  currentPin.value += n;

  if (currentPin.value.length === 4) {
    handlePinComplete();
  }
}

function removeDigit() {
  if (isLockedOut.value) return;
  currentPin.value = currentPin.value.slice(0, -1);
  error.value = '';
}

function triggerShake() {
  shakeError.value = true;
  setTimeout(() => { shakeError.value = false; }, 600);
}

async function handlePinComplete() {
  switch (mode.value) {
    case 'entry':
      if (await verifyPin(currentPin.value, storedPin.value)) {
        handleSuccessfulAttempt();
        localStorage.setItem('michi_pin_verified', 'true');
        const redirect = route.query.redirect || '/';
        router.replace(redirect);
      } else {
        handleFailedAttempt();
        triggerShake();
        if (!isLockedOut.value) {
          error.value = 'Wrong PIN. Try again.';
        }
        setTimeout(() => { currentPin.value = ''; if (!isLockedOut.value) error.value = ''; }, 600);
      }
      break;

    case 'setup':
      tempNewPin.value = currentPin.value;
      currentPin.value = '';
      mode.value = 'confirm';
      break;

    case 'confirm':
      if (currentPin.value === tempNewPin.value) {
        storedPin.value = await writePin(currentPin.value);
        localStorage.setItem('michi_pin_verified', 'true');
        successMsg.value = '✓ PIN set!';
        setTimeout(() => router.replace('/settings'), 700);
      } else {
        triggerShake();
        error.value = "PINs don't match. Start again.";
        currentPin.value = '';
        tempNewPin.value = '';
        setTimeout(() => { mode.value = 'setup'; error.value = ''; }, 700);
      }
      break;

    case 'change-verify':
      if (await verifyPin(currentPin.value, storedPin.value)) {
        handleSuccessfulAttempt();
        currentPin.value = '';
        mode.value = 'change-new';
      } else {
        handleFailedAttempt();
        triggerShake();
        if (!isLockedOut.value) {
          error.value = 'Incorrect PIN. Try again.';
        }
        setTimeout(() => { currentPin.value = ''; if (!isLockedOut.value) error.value = ''; }, 600);
      }
      break;

    case 'change-new':
      tempNewPin.value = currentPin.value;
      currentPin.value = '';
      mode.value = 'change-confirm';
      break;

    case 'change-confirm':
      if (currentPin.value === tempNewPin.value) {
        storedPin.value = await writePin(currentPin.value);
        localStorage.setItem('michi_pin_verified', 'true');
        successMsg.value = '✓ PIN changed!';
        currentPin.value = '';
        setTimeout(() => router.replace('/settings'), 700);
      } else {
        triggerShake();
        error.value = "PINs don't match. Try again.";
        currentPin.value = '';
        tempNewPin.value = '';
        setTimeout(() => { mode.value = 'change-new'; error.value = ''; }, 700);
      }
      break;
  }
}

function goBack() {
  if (isChanging.value) {
    router.replace('/settings');
  } else if (mode.value === 'setup') {
    router.replace('/settings');
  } else if (window.history.length > 1) {
    router.back();
  } else {
    router.replace('/');
  }
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
