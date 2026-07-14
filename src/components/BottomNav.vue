<template>
  <div>
    <!-- Mobile: bottom bar -->
    <nav aria-label="Main navigation" class="fixed bottom-0 left-0 right-0 w-full max-w-5xl mx-auto glass border-t border-gray-100/50 px-2 pb-safe z-50 lg:hidden">
      <div class="flex justify-around items-center h-16 relative">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          :aria-label="tab.label"
          :aria-current="isActive(tab.name) ? 'page' : undefined"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300 relative z-10"
          :class="isActive(tab.name) ? 'text-forest' : 'text-muted hover:text-charcoal'"
        >
          <Icon :icon="tab.icon" class="w-6 h-6 transition-transform duration-300" :class="isActive(tab.name) ? 'scale-110 drop-shadow-sm' : ''" />
          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
        </router-link>
        <!-- Animated indicator -->
        <div
          class="absolute bottom-1 h-1 w-8 bg-forest rounded-full transition-all duration-300 ease-out"
          :style="{ left: indicatorLeft }"
        />
      </div>
    </nav>

    <!-- Desktop: right sidebar (sticky within grid column) -->
    <nav aria-label="Main navigation" class="hidden lg:flex sticky top-0 h-screen w-20 glass border-l border-gray-100/50 flex-col items-center py-8 z-40">
      <div class="flex flex-col items-center gap-6 flex-1">
        <router-link
          v-for="tab in allTabs"
          :key="tab.name"
          :to="tab.path"
          :aria-label="tab.label"
          :aria-current="isActive(tab.name) ? 'page' : undefined"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300 rounded-xl relative"
          :class="isActive(tab.name) ? 'text-forest bg-forest/10' : 'text-muted hover:text-charcoal hover:bg-gray-100/50'"
        >
          <Icon :icon="tab.icon" class="w-6 h-6" />
          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
          <!-- Active indicator bar -->
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();

const tabs = [
  { name: 'home', path: '/', icon: 'lucide:home', label: 'Home' },
  { name: 'practices', path: '/practices', icon: 'lucide:circle-dot', label: 'Practice' },
  { name: 'journal', path: '/journal', icon: 'lucide:book-open', label: 'Journal' },
  { name: 'growth', path: '/growth', icon: 'lucide:sprout', label: 'Growth' },
];

// Desktop sidebar includes Settings
const allTabs = [
  ...tabs,
  { name: 'settings', path: '/settings', icon: 'lucide:settings', label: 'Settings' },
];

function isActive(name) {
  if (name === 'home') return route.path === '/';
  return route.path.startsWith(`/${name}`);
}

// Calculate indicator position for mobile nav
const indicatorLeft = computed(() => {
  const activeIndex = tabs.findIndex(t => isActive(t.name));
  if (activeIndex === -1) return '0px';
  // Each tab takes ~25% width, center the indicator
  const tabWidth = 100 / tabs.length;
  const center = tabWidth * activeIndex + tabWidth / 2;
  return `calc(${center}% - 16px)`;
});
</script>
