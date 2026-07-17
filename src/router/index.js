import { createRouter, createWebHashHistory } from 'vue-router';
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
  { path: '/privacy', name: 'privacy', component: () => import('../views/PrivacyView.vue') },
];

const router = createRouter({
  // Hash history is more reliable inside the Capacitor WebView
  // (no server-side route resolution on reload / deep link)
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  const hasPin = localStorage.getItem('michi_pin');

  // Only guard the journal page
  if (to.name === 'journal' && hasPin) {
    const verified = localStorage.getItem('michi_pin_verified') === 'true';
    if (!verified) {
      return { name: 'pin', query: { redirect: '/journal' } };
    }
  }

  // Onboarding guard (skip for pin and onboarding routes themselves)
  if (to.name !== 'onboarding' && to.name !== 'pin') {
    const onboarded = localStorage.getItem('michi_onboarded');
    if (!onboarded) {
      return { name: 'onboarding' };
    }
  }
});

export default router;
