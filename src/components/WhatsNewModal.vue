<template>
  <BottomSheet :model-value="show" @close="$emit('close')">
    <div class="flex items-center justify-between mb-4 mt-2">
      <h2 id="whats-new-title" class="text-xl font-bold text-charcoal flex items-center gap-2">
        <Icon icon="lucide:sparkles" class="w-6 h-6 text-forest" />
        What's New
      </h2>
      <button @click="$emit('close')" class="text-muted hover:text-charcoal transition-colors p-1 rounded-lg">
        <Icon icon="lucide:x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Update available banner -->
    <div v-if="updateAvailable" class="mb-4 p-4 rounded-xl bg-forest/10 border border-forest/20 flex flex-col items-start gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <Icon icon="lucide:download" class="w-4 h-4 text-forest" />
          <span class="text-sm font-bold text-forest">Update available: {{ latestVersion }}</span>
        </div>
        <p class="text-xs text-forest/80">You are on {{ currentVersion }}. Get the latest features!</p>
      </div>
      <button @click="openUpdate" class="px-4 py-2 bg-forest text-white text-xs font-semibold rounded-lg hover:bg-forest-dark transition-colors">
        Update Now
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="release in releases" :key="release.version" class="border-t border-gray-100/50 pt-4 first:border-0 first:pt-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-base font-bold text-charcoal">{{ release.version }}</span>
          <span v-if="release.current" class="text-[10px] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-semibold uppercase tracking-wide">Current</span>
          <span v-if="release.date" class="text-xs text-muted font-medium">{{ release.date }}</span>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, i) in release.items" :key="i" class="text-sm text-charcoal/80 flex items-start gap-2">
            <span class="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" :class="item.type === 'feature' ? 'bg-forest' : item.type === 'fix' ? 'bg-torii' : 'bg-earth'" />
            <span class="leading-relaxed">{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import BottomSheet from './BottomSheet.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  releases: { type: Array, required: true },
  currentVersion: { type: String, required: true },
  latestVersion: { type: String, default: '' },
  updateAvailable: { type: Boolean, default: false }
});

defineEmits(['close']);

async function openUpdate() {
  try {
    const res = await fetch('https://api.github.com/repos/markocampos/Michi/releases/latest');
    const data = await res.json();
    const apkAsset = data.assets?.find(asset => asset.name.endsWith('.apk'));
    if (apkAsset) {
      window.open(apkAsset.browser_download_url, '_blank');
    } else {
      window.open('https://markocampos.github.io/Michi/', '_blank');
    }
  } catch (e) {
    window.open('https://markocampos.github.io/Michi/', '_blank');
  }
}
</script>
