<template>
  <div class="md:bg-[#FAFAF8]/95 md:backdrop-blur-md md:border-r md:border-gray-100/50 z-40 relative">
    <!-- Mobile: bottom bar -->
    <Teleport to="body">
      <nav v-if="route.name !== 'practice'" aria-label="Main navigation" class="fixed bottom-0 left-0 right-0 w-full max-w-[1440px] mx-auto nav-bg border-t border-gray-100/50 px-2 pb-safe z-50 md:hidden" style="transform: translateZ(0);">
        <div class="flex items-center h-16">
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.path"
            :aria-label="tab.label"
            :aria-current="isActive(tab.name) ? 'page' : undefined"
            class="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative z-10"
            :class="isActive(tab.name) ? 'text-forest' : 'text-muted'"
          >
            <Icon :icon="tab.icon" class="w-6 h-6" />
            <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
          </router-link>
        </div>
      </nav>
    </Teleport>

    <!-- Desktop & Tablet: left sidebar -->
    <nav aria-label="Main navigation" class="hidden md:flex sticky top-0 h-screen w-20 flex-col items-center py-8">
      <div class="flex flex-col items-center gap-6 flex-1">
        <router-link
          v-for="tab in allTabs"
          :key="tab.name"
          :to="tab.path"
          :aria-label="tab.label"
          :aria-current="isActive(tab.name) ? 'page' : undefined"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl relative"
          :class="isActive(tab.name) ? 'text-forest bg-forest/10' : 'text-muted hover:text-charcoal hover:bg-gray-100/50'"
        >
          <Icon :icon="tab.icon" class="w-6 h-6" />
          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
          <div
            v-if="isActive(tab.name)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-forest rounded-r-full"
          />
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();

const tabs = [
  { name: 'home', path: '/', icon: 'lucide:home', label: 'Home' },
  { name: 'practices', path: '/practices', icon: 'lucide:circle-dot', label: 'Practice' },
  { name: 'journal', path: '/journal', icon: 'lucide:book-open', label: 'Journal' },
  { name: 'growth', path: '/growth', icon: 'lucide:sprout', label: 'Growth' },
];

const allTabs = [
  ...tabs,
  { name: 'settings', path: '/settings', icon: 'lucide:settings', label: 'Settings' },
];

function isActive(name) {
  if (name === 'home') return route.path === '/';
  return route.path.startsWith(`/${name}`);
}
</script>

<style scoped>
.nav-bg {
  background: rgba(250, 250, 248, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
