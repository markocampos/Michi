<template>
  <div class="px-5 pt-12 pb-8 pb-safe md:px-8 md:pt-14 lg:px-12 lg:pt-16 max-w-2xl lg:max-w-3xl select-none">
    <button @click="goBack" aria-label="Go back to practices" class="flex items-center gap-1 text-muted mb-6 hover:text-charcoal transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <Suspense>
      <template #default>
        <IkigaiPractice v-if="id === 'ikigai'" :key="id" />
        <WabiSabiPractice v-else-if="id === 'wabisabi'" :key="id" />
        <MaPractice v-else-if="id === 'ma'" :key="id" />
        <KaizenPractice v-else-if="id === 'kaizen'" :key="id" />
        <ShinrinYokuPractice v-else-if="id === 'shinrin'" :key="id" />
        <GamanPractice v-else-if="id === 'gaman'" :key="id" />
        <HanseiPractice v-else-if="id === 'hansei'" :key="id" />
        <MonoNoAwarePractice v-else-if="id === 'mononoaware'" :key="id" />
      </template>
      <template #fallback>
        <div class="flex items-center justify-center py-12">
          <div class="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
      </template>
    </Suspense>

    <div v-if="!isValidPractice" class="text-center mt-12">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:search" class="w-10 h-10 text-muted" />
      </div>
      <p class="font-semibold text-charcoal mb-1">Practice not found</p>
      <p class="text-sm text-muted mb-4">This practice doesn't exist or has been removed.</p>
      <router-link to="/practices" class="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors">
        Browse practices
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const IkigaiPractice = defineAsyncComponent(() => import('../practices/IkigaiPractice.vue'));
const WabiSabiPractice = defineAsyncComponent(() => import('../practices/WabiSabiPractice.vue'));
const MaPractice = defineAsyncComponent(() => import('../practices/MaPractice.vue'));
const KaizenPractice = defineAsyncComponent(() => import('../practices/KaizenPractice.vue'));
const ShinrinYokuPractice = defineAsyncComponent(() => import('../practices/ShinrinYokuPractice.vue'));
const GamanPractice = defineAsyncComponent(() => import('../practices/GamanPractice.vue'));
const HanseiPractice = defineAsyncComponent(() => import('../practices/HanseiPractice.vue'));
const MonoNoAwarePractice = defineAsyncComponent(() => import('../practices/MonoNoAwarePractice.vue'));

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const validIds = ['ikigai', 'wabisabi', 'ma', 'kaizen', 'shinrin', 'gaman', 'hansei', 'mononoaware'];
const isValidPractice = computed(() => validIds.includes(id.value));

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/practices');
  }
}
</script>
