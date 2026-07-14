<template>
  <div class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16">
    <h1 class="text-2xl font-bold text-charcoal mb-2 md:text-3xl lg:text-4xl">Settings</h1>
    <p class="text-sm text-muted mb-8">Customize your experience</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Security -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:lock" class="w-5 h-5 text-forest" />
          Security
        </h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-charcoal">PIN Lock</p>
              <p class="text-xs text-muted">{{ pinEnabled ? 'Enabled' : 'Disabled' }}</p>
            </div>
            <button
              @click="togglePin"
              class="relative w-12 h-7 rounded-full transition-colors duration-300"
              :class="pinEnabled ? 'bg-forest' : 'bg-gray-300'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                :class="pinEnabled ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
          <button
            v-if="pinEnabled"
            @click="changePin"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:key-round" class="w-5 h-5 text-forest" />
            Change PIN
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:bell" class="w-5 h-5 text-forest" />
          Notifications
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-charcoal">Daily Reminder</p>
              <p class="text-xs text-muted">Get reminded to practice each day</p>
            </div>
            <button
              @click="toggleNotifications"
              :aria-label="notificationsEnabled ? 'Disable daily reminder' : 'Enable daily reminder'"
              :aria-pressed="notificationsEnabled"
              class="relative w-12 h-7 rounded-full transition-colors duration-300"
              :class="notificationsEnabled ? 'bg-forest' : 'bg-gray-300'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center"
                :class="notificationsEnabled ? 'translate-x-5' : 'translate-x-0'"
              >
                <Icon icon="lucide:bell" class="w-3.5 h-3.5" :class="notificationsEnabled ? 'text-forest' : 'text-muted'" />
              </span>
            </button>
          </div>

          <div v-if="notificationsEnabled">
            <label for="reminder-time" class="text-sm text-muted block mb-2">Remind me at</label>
            <input
              id="reminder-time"
              :value="reminderTime"
              @change="updateReminderTime"
              type="time"
              class="w-full p-3 glass rounded-xl border border-gray-100/50 text-charcoal focus:outline-none focus:border-forest transition-colors"
            />
          </div>

          <p v-if="notificationsEnabled && notificationPermission === 'denied'" class="text-xs text-torii">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        </div>
      </div>

      <!-- Data -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:database" class="w-5 h-5 text-forest" />
          Data
        </h2>
        <div class="space-y-3">
          <button
            @click="exportData"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:download" class="w-5 h-5 text-forest" />
            Export Data
          </button>
          <button
            @click="triggerImport"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:upload" class="w-5 h-5 text-forest" />
            Import Data
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="importData"
          />
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-torii/20">
        <h2 class="font-semibold text-torii mb-4 flex items-center gap-2">
          <Icon icon="lucide:alert-triangle" class="w-5 h-5" />
          Danger Zone
        </h2>
        <button
          @click="confirmReset"
          class="w-full py-3 px-4 rounded-xl border border-torii/30 text-torii font-medium hover:bg-torii/10 transition-colors"
        >
          Reset All Data
        </button>
      </div>

      <!-- Updates & Changelog -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:sparkles" class="w-5 h-5 text-forest" />
          What's New
        </h2>

        <!-- Update available banner -->
        <div v-if="updateAvailable" class="mb-4 p-3 rounded-xl bg-forest/10 border border-forest/20">
          <div class="flex items-center gap-2 mb-1">
            <Icon icon="lucide:download" class="w-4 h-4 text-forest" />
            <span class="text-sm font-medium text-forest">Update available: {{ latestVersion }}</span>
          </div>
          <p class="text-xs text-muted ml-6">You're on {{ currentVersion }}. Refresh to get the latest.</p>
        </div>

        <div v-if="checkingUpdate" class="flex items-center gap-2 mb-4 text-xs text-muted">
          <Icon icon="lucide:loader-2" class="w-3 h-3 animate-spin" />
          Checking for updates...
        </div>

        <div class="space-y-4">
          <div v-for="release in releases" :key="release.version" class="border-t border-gray-100/50 pt-3 first:border-0 first:pt-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-charcoal">{{ release.version }}</span>
              <span v-if="release.current" class="text-[10px] px-1.5 py-0.5 rounded-full bg-forest/10 text-forest font-medium">Current</span>
              <span v-if="release.date" class="text-[10px] text-muted">{{ release.date }}</span>
            </div>
            <ul class="space-y-1">
              <li v-for="(item, i) in release.items" :key="i" class="text-xs text-muted flex items-start gap-1.5">
                <span class="mt-1 w-1 h-1 rounded-full flex-shrink-0" :class="item.type === 'feature' ? 'bg-forest' : item.type === 'fix' ? 'bg-torii' : 'bg-earth'" />
                {{ item.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Report Bug -->
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSepq23K7zdpna7vnVNf33DTmARZIvwApHiDxvDU7OFXk6T0fA/viewform?usp=header"
        target="_blank"
        rel="noopener"
        class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 flex items-center gap-3 hover:shadow-md transition-shadow"
      >
        <div class="w-10 h-10 rounded-xl bg-torii/10 flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:bug" class="w-5 h-5 text-torii" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-charcoal">Report a Bug</p>
          <p class="text-xs text-muted">Found something wrong? Let us know.</p>
        </div>
        <Icon icon="lucide:external-link" class="w-4 h-4 text-muted" />
      </a>

      <!-- About -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:info" class="w-5 h-5 text-forest" />
          About
        </h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted">Version</span>
            <span class="text-charcoal">{{ currentVersion }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Practices</span>
            <span class="text-charcoal">8 concepts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import { useNotifications } from '../composables/useNotifications.js';
import { APP_VERSION } from '../version.js';

const { isEnabled: notificationsEnabled, reminderTime, permission: notificationPermission, toggleNotifications, setReminderTime } = useNotifications();

const fileInput = ref(null);
const pinEnabled = ref(false);
const updateAvailable = ref(false);
const checkingUpdate = ref(false);
const latestVersion = ref('');
const currentVersion = APP_VERSION;

const GITHUB_REPO = 'markocampos/michi';

async function checkForUpdates() {
  checkingUpdate.value = true;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (res.ok) {
      const data = await res.json();
      latestVersion.value = data.tag_name;
      updateAvailable.value = data.tag_name !== currentVersion;
    }
  } catch {
    // silently fail — offline or no releases yet
  }
  checkingUpdate.value = false;
}

const releases = [
  {
    version: 'v1.0.1',
    current: true,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'PIN lock — protect your journal with a 4-digit code' },
      { type: 'feature', text: 'Growth page with practice breakdown, heatmap, and progress bars' },
      { type: 'feature', text: 'Mood card on home page based on your activity' },
      { type: 'feature', text: 'Pull-to-refresh on Home, Growth, and Journal' },
      { type: 'feature', text: 'Swipe navigation between main tabs' },
      { type: 'feature', text: 'Onboarding flow for new users' },
      { type: 'feature', text: 'Practice search and category filters' },
      { type: 'feature', text: 'Streak milestones (7, 30, 100 days)' },
      { type: 'feature', text: 'Notification reminders and streak alerts' },
      { type: 'feature', text: 'Bug report link in Settings' },
      { type: 'fix', text: 'Page transition animations fixed' },
      { type: 'fix', text: 'Accessibility improvements — ARIA labels, focus rings, skip nav' },
    ],
  },
  {
    version: 'v1.0.0',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'Initial release with 8 Japanese philosophy practices' },
      { type: 'feature', text: 'Ikigai, Wabi-sabi, Ma, Kaizen, Shinrin-yoku, Gaman, Hansei, Mono no aware' },
      { type: 'feature', text: 'Journal with search and filters' },
      { type: 'feature', text: 'Daily progress tracking and streak counter' },
      { type: 'feature', text: 'Data export and import' },
    ],
  },
];

function togglePin() {
  if (pinEnabled.value) {
    // Disable PIN
    if (confirm('Disable PIN lock? Your journal will no longer be protected.')) {
      localStorage.removeItem('michi_pin');
      localStorage.removeItem('michi_pin_verified');
      pinEnabled.value = false;
    }
  } else {
    // Enable PIN — redirect to PIN setup
    localStorage.removeItem('michi_pin');
    localStorage.removeItem('michi_pin_verified');
    window.location.href = '/pin';
  }
}

function changePin() {
  localStorage.removeItem('michi_pin');
  localStorage.removeItem('michi_pin_verified');
  window.location.href = '/pin';
}
function updateReminderTime(e) {
  setReminderTime(e.target.value);
}

onMounted(() => {
  pinEnabled.value = !!localStorage.getItem('michi_pin');
  checkForUpdates();
});

function exportData() {
  const data = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = localStorage.getItem(key);
    if (raw) data[key] = JSON.parse(raw);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `michi-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerImport() {
  fileInput.value?.click();
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      window.location.reload();
    } catch {
      alert('Invalid backup file');
    }
  };
  reader.readAsText(file);
}

function confirmReset() {
  if (confirm('Are you sure? This will delete all your practice data permanently.')) {
    for (const key of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(key);
    }
    localStorage.removeItem('michi_dark_mode');
    window.location.reload();
  }
}
</script>
