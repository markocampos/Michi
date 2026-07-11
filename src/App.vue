<template>
  <div class="min-h-screen bg-gray-100/50 flex justify-center transition-colors duration-500">
    <div class="w-full max-w-5xl bg-gradient-to-br from-warm-white via-[#F5F5F0] to-[#EAEAE2] min-h-screen relative shadow-2xl pb-20 lg:pb-0 lg:grid lg:grid-cols-[1fr_80px]">
      <main class="min-h-screen">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <BottomNav />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<script setup>
import BottomNav from './components/BottomNav.vue';
</script>
