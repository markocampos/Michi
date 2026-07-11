<template>
  <div>
    <!-- Mobile: bottom bar -->
    <nav class="fixed bottom-0 w-full max-w-5xl glass border-t border-gray-100/50 px-2 pb-safe z-50 lg:hidden">
      <div class="flex justify-around items-center h-16">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300"
          :class="isActive(tab.name) ? 'text-forest transform scale-110' : 'text-muted hover:text-charcoal'"
        >
          <span class="text-2xl transition-transform duration-300" :class="isActive(tab.name) ? 'drop-shadow-sm' : ''">{{ tab.icon }}</span>
          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Desktop: right sidebar -->
    <nav class="hidden lg:flex fixed right-0 top-0 h-screen w-20 glass border-l border-gray-100/50 flex-col items-center py-8 z-50">
      <div class="flex flex-col items-center gap-6 flex-1">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300 rounded-xl"
          :class="isActive(tab.name) ? 'text-forest bg-forest/10' : 'text-muted hover:text-charcoal hover:bg-gray-100/50'"
        >
          <span class="text-2xl">{{ tab.icon }}</span>
          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  { name: 'home', path: '/', icon: '🏚', label: 'Home' },
  { name: 'practices', path: '/practices', icon: '☯', label: 'Practice' },
  { name: 'journal', path: '/journal', icon: '📖', label: 'Journal' },
  { name: 'growth', path: '/growth', icon: '🌱', label: 'Growth' },
];

function isActive(name) {
  if (name === 'home') return route.path === '/';
  return route.path.startsWith(`/${name}`);
}
</script>
