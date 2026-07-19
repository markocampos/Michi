import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import { initStore } from './composables/useStorage.js';
import { Capacitor } from '@capacitor/core';

// Show loading screen while store initializes
const loadingEl = document.createElement('div');
loadingEl.id = 'app-loading';
loadingEl.innerHTML = `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;position:fixed;inset:0;background:#FAFAF8;z-index:99999;">
    <h1 style="font-family:Outfit,sans-serif;font-weight:700;font-size:36px;color:#2C3E2D;letter-spacing:-0.02em;margin:0;animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">Michi</h1>
    <p style="font-family:Outfit,sans-serif;font-size:11px;color:#5B7B5E;margin-top:8px;text-transform:uppercase;letter-spacing:0.15em;animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;">Loading...</p>
  </div>
  <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
`;
document.body.appendChild(loadingEl);

async function bootstrap() {
  await initStore();
  // Remove loading screen
  const loading = document.getElementById('app-loading');
  if (loading) loading.remove();
  createApp(App).use(router).mount('#app');

  if (localStorage.getItem('michi_dark_mode') === 'true') {
    document.documentElement.classList.add('dark');
  }

  if (Capacitor.isNativePlatform()) {
    import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      SplashScreen.hide();
    });
    import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
      const isDark = document.documentElement.classList.contains('dark');
      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(()=>{});
      StatusBar.setBackgroundColor({ color: isDark ? '#000000' : '#FAFAF8' }).catch(()=>{});
    });
  }
}

bootstrap();
