<template>
  <div class="px-5 pt-12 pb-8 lg:px-12 lg:pt-16">
    <button @click="goBack" class="flex items-center gap-1 text-muted mb-6 hover:text-charcoal transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <IkigaiPractice v-if="id === 'ikigai'" :key="id" />
    <WabiSabiPractice v-else-if="id === 'wabisabi'" :key="id" />
    <MaPractice v-else-if="id === 'ma'" :key="id" />
    <KaizenPractice v-else-if="id === 'kaizen'" :key="id" />
    <ShinrinYokuPractice v-else-if="id === 'shinrin'" :key="id" />
    <GamanPractice v-else-if="id === 'gaman'" :key="id" />
    <MonoNoAwarePractice v-else-if="id === 'mononoaware'" :key="id" />
    <div v-else class="text-center text-muted mt-12">
      <p class="text-4xl mb-3">🔍</p>
      <p>Practice not found</p>
      <router-link to="/practices" class="text-forest text-sm mt-2 inline-block hover:text-forest-dark transition-colors">Browse practices →</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IkigaiPractice from '../practices/IkigaiPractice.vue';
import WabiSabiPractice from '../practices/WabiSabiPractice.vue';
import MaPractice from '../practices/MaPractice.vue';
import KaizenPractice from '../practices/KaizenPractice.vue';
import ShinrinYokuPractice from '../practices/ShinrinYokuPractice.vue';
import GamanPractice from '../practices/GamanPractice.vue';
import MonoNoAwarePractice from '../practices/MonoNoAwarePractice.vue';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/practices');
  }
}
</script>
