import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import { initStore } from './composables/useStorage.js';

// Show loading screen while store initializes
const loadingEl = document.createElement('div');
loadingEl.id = 'app-loading';
loadingEl.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAFAF8;">
    <div style="text-align:center;">
      <div style="width:32px;height:32px;border:3px solid #5B7B5E;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div>
      <p style="color:#6B6B6B;font-family:Outfit,sans-serif;font-size:14px;">Loading Michi...</p>
    </div>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
`;
document.body.appendChild(loadingEl);

async function bootstrap() {
  await initStore();
  // Remove loading screen
  const loading = document.getElementById('app-loading');
  if (loading) loading.remove();
  createApp(App).use(router).mount('#app');
}

bootstrap();
