import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PracticesView from '../views/PracticesView.vue';
import JournalView from '../views/JournalView.vue';
import GrowthView from '../views/GrowthView.vue';

const routes = [
  { path: '/pin', name: 'pin', component: () => import('../views/PinView.vue') },
  { path: '/onboarding', name: 'onboarding', component: () => import('../views/OnboardingView.vue') },
  { path: '/', name: 'home', component: HomeView, meta: { tabIndex: 0 } },
  { path: '/practices', name: 'practices', component: PracticesView, meta: { tabIndex: 1 } },
  { path: '/practice/:id', name: 'practice', component: () => import('../views/PracticeDetail.vue') },
  { path: '/journal', name: 'journal', component: JournalView, meta: { tabIndex: 2 } },
  { path: '/growth', name: 'growth', component: GrowthView, meta: { tabIndex: 3 } },
  { path: '/settings', name: 'settings', component: () => import('../views/SettingsView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  const hasPin = localStorage.getItem('michi_pin');
  const verified = localStorage.getItem('michi_pin_verified') === 'true';

  // PIN is set but not verified → must enter PIN
  if (hasPin && !verified && to.name !== 'pin') {
    return { name: 'pin' };
  }

  // PIN is set and verified, trying to access PIN page → go home
  if (hasPin && verified && to.name === 'pin') {
    return { name: 'home' };
  }

  // No PIN set and trying to access PIN page → allowed (setup mode)
});

export default router;
