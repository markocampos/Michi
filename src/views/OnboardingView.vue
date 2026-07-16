<template>
  <div class="min-h-screen bg-gradient-to-br from-warm-white via-[#F5F5F0] to-[#EAEAE2] flex flex-col">
    <!-- Skip button -->
    <div class="flex justify-end p-5 pt-12">
      <button
        v-if="currentStep < 3"
        @click="finish"
        class="text-sm text-muted hover:text-charcoal transition-colors px-3 py-1"
      >
        Skip
      </button>
    </div>

    <!-- Steps -->
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <!-- Step 0: Welcome -->
      <div v-if="currentStep === 0" class="text-center animate-fade-in-up">
        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-forest/10 flex items-center justify-center">
          <Icon icon="lucide:sparkles" class="w-16 h-16 text-forest" />
        </div>
        <h1 class="text-3xl font-bold text-charcoal mb-2">Welcome to Michi</h1>
        <p class="text-lg text-forest font-medium mb-1">道</p>
        <p class="text-sm text-muted max-w-xs mx-auto">Transform your life through eight timeless Japanese philosophy practices.</p>
      </div>

      <!-- Step 1: Concepts -->
      <div v-if="currentStep === 1" class="w-full max-w-sm">
        <h2 class="text-xl font-bold text-charcoal mb-4 text-center">The Eight Paths</h2>
        <div class="space-y-2 overflow-y-auto max-h-[55vh] pr-1 scrollbar-none">
          <div
            v-for="(practice, i) in practices"
            :key="practice.id"
            class="glass rounded-xl p-3 flex items-center gap-4 opacity-0 animate-fade-in-up"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <div class="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0">
              <Icon :icon="practice.icon" class="w-4 h-4 text-forest" />
            </div>
            <div class="min-w-0">
              <p class="font-medium text-charcoal text-sm">{{ practice.name }}</p>
              <p class="text-xs text-muted truncate">{{ practice.jp }} — {{ practice.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Reminder -->
      <div v-if="currentStep === 2" class="text-center w-full max-w-sm">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-forest/10 flex items-center justify-center">
          <Icon icon="lucide:bell" class="w-10 h-10 text-forest" />
        </div>
        <h2 class="text-xl font-bold text-charcoal mb-2">Daily Reminder</h2>
        <p class="text-sm text-muted mb-6">Set a time to practice each day. You can change this later in Settings.</p>

        <div class="glass rounded-2xl p-6 mb-6">
          <label for="reminder-time" class="text-sm text-muted block mb-3">Remind me at</label>
          <input
            id="reminder-time"
            v-model="reminderTime"
            type="time"
            class="w-full text-center text-2xl font-light text-charcoal bg-transparent border-none focus:outline-none"
          />
        </div>

        <button
          @click="saveReminder"
          class="text-sm text-muted hover:text-charcoal transition-colors"
        >
          Skip for now
        </button>
      </div>

      <!-- Step 3: All Set -->
      <div v-if="currentStep === 3" class="text-center animate-fade-in-up">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-forest/20 flex items-center justify-center">
          <Icon icon="lucide:check" class="w-12 h-12 text-forest" />
        </div>
        <h2 class="text-2xl font-bold text-charcoal mb-2">Your path begins now</h2>
        <p class="text-sm text-muted mb-8 max-w-xs mx-auto">Start with one practice today. Small steps lead to great change.</p>
        <button
          @click="finish"
          class="px-8 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest-dark transition-colors shadow-lg"
        >
          Begin
        </button>
      </div>
    </div>

    <!-- Dot indicators -->
    <div class="flex justify-center gap-2 pb-12">
      <button
        v-for="i in 4"
        :key="i"
        @click="currentStep = i - 1"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="currentStep === i - 1 ? 'bg-forest w-6' : 'bg-gray-300'"
        :aria-label="`Go to step ${i}`"
      />
    </div>

    <!-- Navigation -->
    <div class="px-6 pb-8 flex gap-3" v-if="currentStep < 3">
      <button
        v-if="currentStep > 0"
        @click="currentStep--"
        class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
      <button
        @click="currentStep++"
        class="flex-1 py-3 rounded-xl bg-forest text-white font-medium hover:bg-forest-dark transition-colors"
      >
        {{ currentStep === 0 ? 'Get Started' : currentStep === 2 ? 'Set Reminder' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { allPractices } from '../data/practices.js';

const router = useRouter();
const currentStep = ref(0);
const reminderTime = ref('09:00');
const practices = allPractices;

function saveReminder() {
  localStorage.setItem('michi_reminder_time', reminderTime.value);
  currentStep.value++;
}

function finish() {
  localStorage.setItem('michi_onboarded', 'true');
  router.replace('/');
}
</script>
