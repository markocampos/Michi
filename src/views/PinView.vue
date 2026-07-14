<template>
  <div class="min-h-screen bg-gradient-to-br from-warm-white via-[#F5F5F0] to-[#EAEAE2] flex flex-col items-center justify-center px-6">
    <!-- Logo -->
    <div class="mb-8 text-center">
      <div class="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:lock" class="w-8 h-8 text-forest" />
      </div>
      <h1 class="text-2xl font-bold text-charcoal">Michi</h1>
      <p class="text-sm text-muted mt-1">道 — Your path to mindfulness</p>
    </div>

    <!-- Setup mode -->
    <div v-if="mode === 'setup'" class="w-full max-w-xs text-center">
      <p class="text-sm text-muted mb-6">Create a 4-digit PIN to protect your journal.</p>

      <div class="flex justify-center gap-3 mb-6">
        <div
          v-for="i in 4"
          :key="i"
          class="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all"
          :class="i <= pin.length ? 'border-forest bg-forest/10 text-forest' : 'border-gray-200 bg-white/50 text-muted'"
        >
          {{ i <= pin.length ? '•' : '' }}
        </div>
      </div>

      <p v-if="error" class="text-xs text-torii mb-4">{{ error }}</p>

      <!-- Keypad -->
      <div class="grid grid-cols-3 gap-3">
        <button v-for="n in 9" :key="n" @click="addDigit(n)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          {{ n }}
        </button>
        <div />
        <button @click="addDigit(0)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          0
        </button>
        <button @click="removeDigit" class="h-14 rounded-xl glass border border-gray-100/50 text-sm text-muted hover:bg-gray-50 transition-colors active:scale-95">
          <Icon icon="lucide:delete" class="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>

    <!-- Setup confirm mode -->
    <div v-if="mode === 'confirm'" class="w-full max-w-xs text-center">
      <p class="text-sm text-muted mb-6">Confirm your PIN.</p>

      <div class="flex justify-center gap-3 mb-6">
        <div
          v-for="i in 4"
          :key="i"
          class="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all"
          :class="i <= confirmPin.length ? 'border-forest bg-forest/10 text-forest' : 'border-gray-200 bg-white/50 text-muted'"
        >
          {{ i <= confirmPin.length ? '•' : '' }}
        </div>
      </div>

      <p v-if="error" class="text-xs text-torii mb-4">{{ error }}</p>

      <div class="grid grid-cols-3 gap-3">
        <button v-for="n in 9" :key="n" @click="addConfirmDigit(n)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          {{ n }}
        </button>
        <div />
        <button @click="addConfirmDigit(0)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          0
        </button>
        <button @click="removeConfirmDigit" class="h-14 rounded-xl glass border border-gray-100/50 text-sm text-muted hover:bg-gray-50 transition-colors active:scale-95">
          <Icon icon="lucide:delete" class="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>

    <!-- Entry mode -->
    <div v-if="mode === 'entry'" class="w-full max-w-xs text-center">
      <p class="text-sm text-muted mb-6">Enter your PIN to continue.</p>

      <div class="flex justify-center gap-3 mb-6">
        <div
          v-for="i in 4"
          :key="i"
          class="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all"
          :class="i <= entryPin.length ? 'border-forest bg-forest/10 text-forest' : 'border-gray-200 bg-white/50 text-muted'"
        >
          {{ i <= entryPin.length ? '•' : '' }}
        </div>
      </div>

      <p v-if="error" class="text-xs text-torii mb-4">{{ error }}</p>

      <div class="grid grid-cols-3 gap-3">
        <button v-for="n in 9" :key="n" @click="addEntryDigit(n)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          {{ n }}
        </button>
        <div />
        <button @click="addEntryDigit(0)" class="h-14 rounded-xl glass border border-gray-100/50 text-lg font-medium text-charcoal hover:bg-gray-50 transition-colors active:scale-95">
          0
        </button>
        <button @click="removeEntryDigit" class="h-14 rounded-xl glass border border-gray-100/50 text-sm text-muted hover:bg-gray-50 transition-colors active:scale-95">
          <Icon icon="lucide:delete" class="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();
const mode = ref('entry'); // 'setup', 'confirm', 'entry'
const pin = ref('');
const confirmPin = ref('');
const entryPin = ref('');
const error = ref('');
const storedPin = ref('');

onMounted(() => {
  storedPin.value = localStorage.getItem('michi_pin') || '';
  mode.value = storedPin.value ? 'entry' : 'setup';
});

function addDigit(n) {
  if (pin.value.length >= 4) return;
  pin.value += n;
  error.value = '';
  if (pin.value.length === 4) {
    mode.value = 'confirm';
  }
}

function removeDigit() {
  pin.value = pin.value.slice(0, -1);
  error.value = '';
}

function addConfirmDigit(n) {
  if (confirmPin.value.length >= 4) return;
  confirmPin.value += n;
  error.value = '';
  if (confirmPin.value.length === 4) {
    if (confirmPin.value === pin.value) {
      localStorage.setItem('michi_pin', pin.value);
      localStorage.setItem('michi_pin_verified', 'true');
      router.replace('/');
    } else {
      error.value = 'PINs do not match. Try again.';
      confirmPin.value = '';
      setTimeout(() => {
        pin.value = '';
        mode.value = 'setup';
      }, 1000);
    }
  }
}

function removeConfirmDigit() {
  confirmPin.value = confirmPin.value.slice(0, -1);
  error.value = '';
}

function addEntryDigit(n) {
  if (entryPin.value.length >= 4) return;
  entryPin.value += n;
  error.value = '';
  if (entryPin.value.length === 4) {
    if (entryPin.value === storedPin.value) {
      localStorage.setItem('michi_pin_verified', 'true');
      router.replace('/');
    } else {
      error.value = 'Wrong PIN. Try again.';
      entryPin.value = '';
    }
  }
}

function removeEntryDigit() {
  entryPin.value = entryPin.value.slice(0, -1);
  error.value = '';
}
</script>
