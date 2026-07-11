import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import { initStore } from './composables/useStorage.js';
import { Capacitor } from '@capacitor/core';

async function bootstrap() {
  if (!Capacitor.isNativePlatform()) {
    await import('jeep-sqlite/dist/jeep-sqlite/jeep-sqlite.esm.js');
    const jeepSqlite = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSqlite);
    await customElements.whenDefined('jeep-sqlite');
  }

  await initStore();
  createApp(App).use(router).mount('#app');
}

bootstrap();
