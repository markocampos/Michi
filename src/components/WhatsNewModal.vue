<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
      <div
        class="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
      >
        <div class="p-6 pb-0 flex-shrink-0">
          <div class="flex items-center justify-between mb-4">
            <h2 id="whats-new-title" class="text-xl font-bold text-charcoal flex items-center gap-2">
              <Icon icon="lucide:sparkles" class="w-6 h-6 text-forest" />
              What's New
            </h2>
            <button @click="$emit('close')" class="text-muted hover:text-charcoal transition-colors">
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
        </div>

        <div class="p-6 overflow-y-auto flex-1 overscroll-contain">
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
        </div>
      </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
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

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from > div[role="dialog"],
.modal-fade-leave-to > div[role="dialog"] {
  transform: scale(0.95) translateY(10px);
}
</style>
