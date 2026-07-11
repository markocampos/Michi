import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PracticesView from '../views/PracticesView.vue';
import JournalView from '../views/JournalView.vue';
import GrowthView from '../views/GrowthView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/practices', name: 'practices', component: PracticesView },
  { path: '/practice/:id', name: 'practice', component: () => import('../views/PracticeDetail.vue') },
  { path: '/journal', name: 'journal', component: JournalView },
  { path: '/growth', name: 'growth', component: GrowthView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
