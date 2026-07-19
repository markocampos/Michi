<template>
  <div class="fixed inset-0 z-[150] pointer-events-none overflow-hidden" v-if="active">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="absolute confetti-particle"
      :style="{
        left: particle.x + '%',
        top: particle.startY + '%',
        width: particle.size + 'px',
        height: particle.size * (particle.shape === 'rect' ? 0.6 : 1) + 'px',
        backgroundColor: particle.color,
        borderRadius: particle.shape === 'circle' ? '50%' : '0',
        clipPath: particle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
        animationDuration: particle.duration + 'ms',
        animationDelay: particle.delay + 'ms',
        '--rx': particle.rotateX + 'deg',
        '--ry': particle.rotateY + 'deg',
        '--rz': particle.rotateZ + 'deg',
        '--drift': particle.drift + 'px',
      }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { triggerHaptic } from '../utils/haptics.js';

const props = defineProps({
  active: { type: Boolean, default: false },
});

// Added a pop of gold/yellow for a more celebratory feel
const colors = ['#5B7B5E', '#C4A882', '#B34233', '#E8B4B8', '#7BAE7F', '#D4956A', '#A8C4D8', '#F2C84B'];
const shapes = ['circle', 'rect', 'triangle'];
const particles = ref([]);

onMounted(() => {
  if (props.active) {
    triggerHaptic();
    generateParticles();
  }
});

function generateParticles() {
  const arr = [];
  // More particles for a lush effect
  for (let i = 0; i < 120; i++) {
    arr.push({
      id: i,
      x: Math.random() * 100,
      startY: -10 - Math.random() * 20,
      size: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      duration: 3500 + Math.random() * 3000,
      delay: Math.random() * 2000,
      // 3D rotations for tumbling effect
      rotateX: (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 1080),
      rotateY: (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 1080),
      rotateZ: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
      // Wider drift
      drift: (Math.random() - 0.5) * 400,
    });
  }
  particles.value = arr;
}
</script>

<style>
@keyframes confetti-fall {
  0% {
    transform: translateY(0) translateX(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(var(--rz));
    opacity: 0;
  }
}

.confetti-particle {
  /* ease-in makes them accelerate as they fall like real gravity */
  animation: confetti-fall ease-in forwards;
  will-change: transform, opacity;
  /* Add subtle 3D perspective to the container of the spin */
  transform-style: preserve-3d;
}
</style>
