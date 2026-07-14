<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:target" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Ikigai</h1>
      <p class="text-sm text-muted mt-1">生きがい - Your reason for being</p>
    </div>

    <div v-if="!showSummary">
      <div class="mb-6">
        <div class="flex gap-2 mb-4">
          <div
            v-for="(p, i) in prompts"
            :key="i"
            class="h-1 flex-1 rounded-full transition-colors"
            :class="i <= currentStep ? 'bg-forest' : 'bg-gray-200'"
          />
        </div>
        <p class="text-xs text-muted text-center">Step {{ currentStep + 1 }} of {{ prompts.length }}</p>
      </div>

      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-xs text-forest font-medium mb-2">{{ prompts[currentStep].jp }}</p>
        <h2 class="text-xl font-semibold text-charcoal mb-2">{{ prompts[currentStep].title }}</h2>
        <p class="text-sm text-muted mb-4">{{ prompts[currentStep].subtitle }}</p>
        <label :for="`ikigai-step-${currentStep}`" class="sr-only">{{ prompts[currentStep].title }}</label>
        <textarea
          :id="`ikigai-step-${currentStep}`"
          v-model="answers[currentStep]"
          :placeholder="prompts[currentStep].placeholder"
          class="w-full h-32 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
        />
      </div>

      <div class="flex gap-3">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          aria-label="Go to previous step"
          class="flex-1 py-3 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          @click="nextStep"
          :aria-label="currentStep === prompts.length - 1 ? 'Complete reflection' : 'Go to next step'"
          class="flex-1 py-3 rounded-xl bg-forest text-white font-medium hover:bg-forest-dark transition-colors"
        >
          {{ currentStep === prompts.length - 1 ? 'Complete' : 'Next' }}
        </button>
      </div>
    </div>

    <div v-else class="text-center">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Your Ikigai Reflection</p>
        <div v-for="(answer, i) in answers" :key="i" class="mb-4 text-left">
          <p class="text-xs text-muted mb-1">{{ prompts[i].jp }} - {{ prompts[i].title }}</p>
          <p class="text-charcoal">{{ answer || '(not answered)' }}</p>
        </div>
      </div>
      <p class="text-sm text-muted italic">"Your ikigai is the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."</p>
    </div>

    <div v-if="data.reflections.length > 0" class="mt-8">
      <h3 class="font-semibold text-charcoal mb-3">Past Reflections</h3>
      <div v-for="r in data.reflections" :key="r.id" class="glass rounded-xl p-4 shadow-sm border border-gray-100/50 mb-3">
        <p class="text-xs text-muted mb-2">{{ r.date }}</p>
        <p v-if="r.insight" class="text-sm text-charcoal">{{ r.insight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import { ikigaiPrompts } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';

const prompts = ikigaiPrompts;
const currentStep = ref(0);
const answers = reactive(['', '', '', '']);
const showSummary = ref(false);
const data = useStorage('michi_ikigai', { reflections: [] });

function nextStep() {
  if (currentStep.value < prompts.length - 1) {
    currentStep.value++;
  } else {
    saveReflection();
    showSummary.value = true;
  }
}

function saveReflection() {
  data.value.reflections.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    love: answers[0],
    goodAt: answers[1],
    worldNeeds: answers[2],
    paidFor: answers[3],
    insight: answers.filter(a => a).join(' | '),
  });
}
</script>
