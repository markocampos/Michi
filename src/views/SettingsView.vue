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
              <p class="text-xs text-muted">{{ pinEnabled ? 'Journal is protected' : 'Journal is open to all' }}</p>
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

      <!-- Disable PIN modal (Teleported to body, single-root-safe) -->
      <DangerConfirmModal
        v-if="showDisablePinModal"
        title="Disable PIN Lock?"
        description="Your journal will no longer be protected. Anyone with your phone can read your entries. Enter your current PIN to confirm."
        confirm-phrase="DISABLE"
        confirm-label="Remove PIN"
        icon="lucide:lock-open"
        :require-pin="true"
        :stored-pin="currentPinValue"
        @confirm="executePinDisable"
        @cancel="showDisablePinModal = false"
      />

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

      <!-- General Settings -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:sliders-horizontal" class="w-5 h-5 text-forest" />
          General
        </h2>
        <div class="space-y-4">
          <!-- Haptic Feedback -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-charcoal">Haptic Feedback</p>
              <p class="text-xs text-muted">Vibrate on important actions</p>
            </div>
            <button
              @click="toggleHaptics"
              class="relative w-12 h-7 rounded-full transition-colors duration-300"
              :class="hapticsEnabled ? 'bg-forest' : 'bg-gray-300'"
            >
              <span
                class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                :class="hapticsEnabled ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <!-- Font Size -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100/50">
            <div>
              <p class="font-medium text-charcoal">Journal Font Size</p>
              <p class="text-xs text-muted">Make entries easier to read</p>
            </div>
            <div class="flex bg-gray-100/50 rounded-xl p-1 border border-gray-200/50">
              <button
                @click="setFontSize('standard')"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="fontSize === 'standard' ? 'bg-white shadow-sm text-charcoal' : 'text-muted'"
              >
                Standard
              </button>
              <button
                @click="setFontSize('large')"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="fontSize === 'large' ? 'bg-white shadow-sm text-charcoal' : 'text-muted'"
              >
                Large
              </button>
            </div>
          </div>
          

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
            @click="handleExportClick('json')"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:download" class="w-5 h-5 text-forest" />
            Export Backup (JSON)
          </button>
          <button
            @click="handleExportClick('text')"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:file-text" class="w-5 h-5 text-forest" />
            Export Journal (Text)
          </button>
          <button
            @click="triggerImport"
            class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center gap-3"
          >
            <Icon icon="lucide:upload" class="w-5 h-5 text-forest" />
            Import Backup File
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
        <p class="text-xs text-muted mb-4 leading-relaxed">
          Permanently deletes all your practices, journal entries, habits, and streaks.
          <span class="font-medium text-charcoal">This cannot be undone.</span>
        </p>
        <button
          @click="showResetModal = true"
          class="w-full py-3 px-4 rounded-xl border border-torii/30 text-torii font-medium hover:bg-torii/10 transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
          Delete All Data
        </button>
      </div>

      <!-- What's New & Updates -->
      <div class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <h2 class="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Icon icon="lucide:sparkles" class="w-5 h-5 text-forest" />
          Updates
        </h2>

        <!-- Update available banner -->
        <div v-if="updateAvailable" class="mb-4 p-3 rounded-xl bg-forest/10 border border-forest/20">
          <div class="flex items-center gap-2 mb-1">
            <Icon icon="lucide:download" class="w-4 h-4 text-forest" />
            <span class="text-sm font-medium text-forest">Update available: {{ latestVersion }}</span>
          </div>
          <p class="text-xs text-muted ml-6 mb-2">You're on v{{ currentVersion }}.</p>
          <button @click="openUpdate" class="ml-6 px-3 py-1.5 bg-forest text-white text-xs font-semibold rounded-lg hover:bg-forest-dark transition-colors">
            Get Update
          </button>
        </div>

        <!-- LTS version banner -->
        <div v-else-if="isLtsVersion" class="mb-4 p-3 rounded-xl bg-torii/10 border border-torii/20">
          <div class="flex items-center gap-2 mb-1">
            <Icon icon="lucide:shield-check" class="w-4 h-4 text-torii" />
            <span class="text-sm font-medium text-torii">LTS Version Active</span>
          </div>
          <p class="text-xs text-muted ml-6">You are running a newer LTS build (v{{ currentVersion }}). The latest stable is {{ latestVersion }}.</p>
        </div>

        <div v-if="checkingUpdate" class="flex items-center gap-2 mb-4 text-xs text-muted">
          <Icon icon="lucide:loader-2" class="w-3 h-3 animate-spin" />
          Checking for updates...
        </div>

        <button
          @click="showWhatsNewModal = true"
          class="w-full py-3 px-4 glass rounded-xl border border-gray-100/50 text-charcoal font-medium hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
              <Icon icon="lucide:list" class="w-4 h-4 text-forest" />
            </div>
            <span>View Changelog</span>
          </div>
          <Icon icon="lucide:chevron-right" class="w-5 h-5 text-muted group-hover:text-charcoal transition-colors" />
        </button>
      </div>

      <!-- Report Bug -->
      <a
        @click.prevent="openBrowser('https://docs.google.com/forms/d/e/1FAIpQLSepq23K7zdpna7vnVNf33DTmARZIvwApHiDxvDU7OFXk6T0fA/viewform?usp=header')"
        href="https://docs.google.com/forms/d/e/1FAIpQLSepq23K7zdpna7vnVNf33DTmARZIvwApHiDxvDU7OFXk6T0fA/viewform?usp=header"
        class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50 flex items-center gap-3 hover:shadow-md transition-shadow self-start cursor-pointer"
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
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:tag" class="w-4 h-4" /> Version</span>
            <span class="font-mono text-charcoal font-medium">v{{ currentVersion }}</span>
          </div>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:user" class="w-4 h-4" /> Maker</span>
            <span class="text-charcoal font-medium">Mark Ocampos</span>
          </div>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:mail" class="w-4 h-4" /> Email</span>
            <a href="mailto:contact.markocampos@gmail.com" class="text-forest hover:underline font-medium">Contact</a>
          </div>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:shield-check" class="w-4 h-4" /> Privacy Policy</span>
            <router-link to="/privacy" class="text-forest hover:underline font-medium">Read</router-link>
          </div>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:github" class="w-4 h-4" /> GitHub</span>
            <a @click.prevent="openBrowser('https://github.com/markocampos')" href="https://github.com/markocampos" class="text-forest hover:underline font-medium cursor-pointer">@markocampos</a>
          </div>
          <div class="flex justify-between items-center pb-2 border-b border-gray-100/50">
            <span class="text-muted flex items-center gap-2"><Icon icon="simple-icons:discord" class="w-4 h-4" /> Discord</span>
            <a @click.prevent="openBrowser('https://discord.gg/VPmyBvEBeM')" href="https://discord.gg/VPmyBvEBeM" class="text-forest hover:underline font-medium cursor-pointer">Community</a>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-muted flex items-center gap-2"><Icon icon="lucide:heart" class="w-4 h-4" /> Support</span>
            <a @click.prevent="openBrowser('https://sociabuzz.com/markocampos/tribe')" href="https://sociabuzz.com/markocampos/tribe" class="text-forest hover:underline font-medium cursor-pointer">SociaBuzz</a>
          </div>
        </div>
      </div>
    </div>

    <!-- What's New Modal -->
    <WhatsNewModal
      v-if="showWhatsNewModal"
      :releases="releases"
      :current-version="'v' + currentVersion"
      :latest-version="latestVersion"
      :update-available="updateAvailable"
      @close="showWhatsNewModal = false"
    />

    <!-- Hardened data reset modal -->
    <DangerConfirmModal
      v-if="showResetModal"
      title="Delete All Data?"
      description="This will permanently erase all your practices, journal entries, habits, streaks, and settings. Your data cannot be recovered."
      confirm-phrase="DELETE MY DATA"
      confirm-label="Delete Everything"
      icon="lucide:trash-2"
      :require-pin="!!pinEnabled"
      :stored-pin="currentPinValue"
      @confirm="executeReset"
      @cancel="showResetModal = false"
    />

    <!-- Export PIN verification modal -->
    <DangerConfirmModal
      v-if="showExportPinModal"
      title="Verify Identity"
      description="Enter your PIN to export your journal data."
      icon="lucide:lock"
      :require-pin="true"
      :stored-pin="currentPinValue"
      :skip-phrase="true"
      @confirm="executeExport"
      @cancel="showExportPinModal = false"
    />
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
import { readPinHash } from '../utils/pin.js';
import { clearAllStorage } from '../composables/useStorage.js';
import { useNotifications } from '../composables/useNotifications.js';
import { triggerHaptic } from '../utils/haptics.js';
import { openBrowser } from '../utils/browser.js';

import { Capacitor } from '@capacitor/core';
import pkg from '../../package.json';
import DangerConfirmModal from '../components/DangerConfirmModal.vue';
import WhatsNewModal from '../components/WhatsNewModal.vue';

const isNative = Capacitor.isNativePlatform();

const router = useRouter();

const { isEnabled: notificationsEnabled, reminderTime, permission: notificationPermission, toggleNotifications, setReminderTime } = useNotifications();

const fileInput = ref(null);
const pinEnabled = ref(false);
const currentPinValue = ref('');
const showResetModal = ref(false);
const showDisablePinModal = ref(false);
const showExportPinModal = ref(false);
const showWhatsNewModal = ref(false);
const exportTypePending = ref('');
const updateAvailable = ref(false);
const isLtsVersion = ref(false);
const checkingUpdate = ref(false);
const latestVersion = ref('');
const apkDownloadUrl = ref('');
const currentVersion = pkg.version;

const hapticsEnabled = ref(localStorage.getItem('michi_haptics') !== 'false');
const fontSize = ref(localStorage.getItem('michi_font_size') || 'standard');

function toggleHaptics() {
  hapticsEnabled.value = !hapticsEnabled.value;
  localStorage.setItem('michi_haptics', hapticsEnabled.value.toString());
  if (hapticsEnabled.value) triggerHaptic();
}

function setFontSize(size) {
  fontSize.value = size;
  localStorage.setItem('michi_font_size', size);
  if (size === 'large') {
    document.documentElement.classList.add('text-lg');
  } else {
    document.documentElement.classList.remove('text-lg');
  }
}

const GITHUB_REPO = 'markocampos/michi';

function compareSemver(v1, v2) {
  const sanitize = v => (v || '').replace(/^v/, '');
  const p1 = sanitize(v1).split('.').map(Number);
  const p2 = sanitize(v2).split('.').map(Number);
  
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

async function checkForUpdates() {
  checkingUpdate.value = true;
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (res.ok) {
      const data = await res.json();
      latestVersion.value = data.tag_name;
      
      const comp = compareSemver(data.tag_name, currentVersion);
      updateAvailable.value = comp > 0;
      isLtsVersion.value = comp < 0;

      const apk = data.assets?.find(a => a.name.endsWith('.apk'));
      if (apk) apkDownloadUrl.value = apk.browser_download_url;
    }
  } catch {
    // silently fail — offline or no releases yet
  }
  checkingUpdate.value = false;
}

function openUpdate() {
  if (apkDownloadUrl.value) {
    openBrowser(apkDownloadUrl.value);
  } else {
    openBrowser('https://markocampos.github.io/Michi/');
  }
}

const releases = [
  {
    version: 'v1.1.5',
    current: true,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'Activity Calendar Redesign: Dynamic scaling views from Week (mobile) to 12-month (Desktop L)' },
      { type: 'feature', text: 'Micro-interaction Polish: Added autofocus, auto-scroll, and seamless reset-to-new for a superior mobile typing experience' },
      { type: 'feature', text: 'Native Experience: Integrated Capacitor Splash Screen, Status Bar, Native Haptics, Keyboard, and Browser overlay plugins' },
      { type: 'fix', text: 'UI Cleanup: Removed hidden pull-to-refresh code and the broken "skip to main content" link that caused blank pages' },
      { type: 'fix', text: 'Web behaviors disabled: Prevented text selection and link popups so the app feels 100% native' },
      { type: 'fix', text: 'Hardware Back Button: Android back button now safely navigates back instead of exiting the app' },
      { type: 'fix', text: 'Settings UI: Fixed oversized buttons, added Discord community, and updated support links' },
    ],
  },
  {
    version: 'v1.1.4',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'Desktop & Tablet Layout: Fully redesigned responsive grid layout that gracefully expands to 1440px wide monitors' },
      { type: 'feature', text: 'Left Sidebar: Navigation transforms into a sleek, frosted-glass left sidebar on larger screens' },
      { type: 'feature', text: 'Responsive Dashboards: Practice and Growth dashboards now use 3 and 4 column grids on large displays' },
      { type: 'feature', text: 'Daily Reflections: Added 400 deep philosophical prompts across all 8 practices' },
      { type: 'feature', text: 'Quote Copy: Added a quick copy-to-clipboard button on all daily quotes' },
      { type: 'fix', text: 'Swipe Navigation: Blazing fast page transitions (0.15s) with overlapping grid animations to prevent layout collapse' },
      { type: 'fix', text: 'Level 501 Bug: Fixed a math glitch that incorrectly granted absolute enlightenment (Level 501) to users with 0 XP' },
      { type: 'fix', text: 'Fixed bottom spacing and sidebar cutoff glitches on desktop layout' },
      { type: 'fix', text: 'Journal UI cleanup on mobile by optimizing practice filters' },
    ],
  },
  {
    version: 'v1.0.3',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'fix', text: 'Hardened data deletion: fully clears internal databases on reset' },
      { type: 'feature', text: 'Streamlined Android build with automated release signing' },
      { type: 'feature', text: 'Strict CI checks for merge markers and clean code' },
      { type: 'fix', text: 'Reduced package size by removing unused server dependencies' },
      { type: 'fix', text: 'Updated manifest to properly reflect eight concepts' },
      { type: 'feature', text: 'Security: Cryptographic hashing for PIN storage' },
      { type: 'fix', text: 'Removed auto-backup feature due to Android 11+ storage restrictions (manual export remains)' },
    ],
  },
  {
    version: 'v1.0.2',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'Complete Growth Page Overhaul with Zen XP Progression' },
      { type: 'feature', text: 'Activity Calendar Heatmap & Weekly Trend Comparison' },
      { type: 'feature', text: 'Silent Auto-Backup to phone storage (survives uninstalls!)' },
      { type: 'feature', text: 'Journal Insights (Naikan) completely redesigned' },
      { type: 'feature', text: 'PIN lock now only guards the Journal page — all other pages remain freely accessible' },
      { type: 'feature', text: 'PIN session clears automatically when leaving the Journal tab' },
      { type: 'feature', text: 'Full Change PIN flow: verify current PIN → enter new PIN → confirm new PIN' },
      { type: 'feature', text: 'Hardened data deletion — "Delete All Data" now requires PIN entry' },
      { type: 'feature', text: 'Added Native Android Capacitor notifications for reliable background delivery' },
      { type: 'feature', text: 'Added "Export Journal" to plain text (.txt) and included all practices' },
      { type: 'feature', text: 'Added "Haptic Feedback" toggle in General Settings' },
      { type: 'feature', text: 'Added "Journal Font Size" (Standard/Large) toggle in General Settings' },
      { type: 'fix', text: 'Timezone bug in the Activity Calendar resolved' },
      { type: 'fix', text: 'Bottom nav backdrop blur added so content scrolling behind it is properly frosted' },
      { type: 'fix', text: 'Content no longer hidden behind the bottom navigation bar on mobile' },
      { type: 'fix', text: 'Meditation timer circle no longer overflows on narrow phones' },
      { type: 'fix', text: 'Kaizen 7-day habit tracker no longer overflows on narrow screens' },
      { type: 'fix', text: 'Vue Transition warning in SettingsView fixed and modal animations added' },
      { type: 'fix', text: 'PinView template structure corrected' }
    ],
  },
  {
    version: 'v1.0.1',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'PIN lock — protect your journal with a 4-digit code' },
      { type: 'feature', text: 'Growth page with practice breakdown, heatmap, and progress bars' },
      { type: 'feature', text: 'Mood card on home page based on your activity' },
      { type: 'feature', text: 'Swipe navigation between main tabs' },
      { type: 'feature', text: 'Streak milestones (7, 30, 100 days) and daily reminders' },
      { type: 'fix', text: 'Page transition animations fixed' }
    ],
  },
  {
    version: 'v1.0.0',
    current: false,
    date: 'July 2026',
    items: [
      { type: 'feature', text: 'Initial release with 8 Japanese philosophy practices' },
      { type: 'feature', text: 'Journal with search and filters' },
      { type: 'feature', text: 'Daily progress tracking and streak counter' },
      { type: 'feature', text: 'Data export and import' },
    ],
  },
];

function togglePin() {
  if (pinEnabled.value) {
    // Require current PIN before disabling
    showDisablePinModal.value = true;
  } else {
    // Enable PIN — go to setup
    localStorage.removeItem('michi_pin');
    localStorage.removeItem('michi_pin_verified');
    router.push('/pin');
  }
}

function executePinDisable() {
  showDisablePinModal.value = false;
  localStorage.removeItem('michi_pin');
  localStorage.removeItem('michi_pin_verified');
  pinEnabled.value = false;
  currentPinValue.value = '';
}

function changePin() {
  // Route to pin page in change mode — it will ask for current PIN first
  router.push({ path: '/pin', query: { mode: 'change' } });
}
function updateReminderTime(e) {
  setReminderTime(e.target.value);
}

onMounted(async () => {
  // readPinHash() also migrates legacy plaintext PINs to hashes
  currentPinValue.value = await readPinHash();
  pinEnabled.value = !!currentPinValue.value;
  checkForUpdates();
});

function handleExportClick(type) {
  if (pinEnabled.value) {
    exportTypePending.value = type;
    showExportPinModal.value = true;
  } else {
    exportTypePending.value = type;
    executeExport();
  }
}

function executeExport() {
  showExportPinModal.value = false;
  if (exportTypePending.value === 'json') {
    exportData();
  } else if (exportTypePending.value === 'text') {
    exportToText();
  }
}

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

function exportToText() {
  let content = "My Michi Journal\n";
  content += "=================\n\n";

  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    
    try {
      const data = JSON.parse(raw);
      // Determine which array holds the data for this practice
      const list = data.entries || data.reflections || data.habits || data.walks || data.challenges || data.sessions;
      
      if (list && list.length > 0) {
        const titleName = key.replace('michi_', '').toUpperCase();
        content += `\n--- ${titleName} ---\n\n`;
        
        list.forEach(entry => {
          content += `Date: ${entry.date}\n`;
          if (entry.text) content += `Entry: ${entry.text}\n`;
          if (entry.insight) content += `Insight: ${entry.insight}\n`;
          if (entry.love) content += `Love: ${entry.love}\n`;
          if (entry.gratitude) content += `Gratitude: ${entry.gratitude}\n`;
          if (entry.impermanence) content += `Impermanence: ${entry.impermanence}\n`;
          if (entry.mood) content += `Mood: ${entry.mood}\n`;
          if (entry.title) content += `Title: ${entry.title}\n`;
          if (entry.duration) content += `Duration: ${entry.duration} mins\n`;
          if (entry.reason) content += `Reason: ${entry.reason}\n`;
          content += `\n`;
        });
      }
    } catch (e) {
      // skip
    }
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `michi-journal-${new Date().toISOString().split('T')[0]}.txt`;
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



async function executeReset() {
  showResetModal.value = false;
  // clearAllStorage also wipes the SQLite store table — without that,
  // deleted data would silently reappear on the next app launch.
  await clearAllStorage([
    ...Object.values(STORAGE_KEYS),
    'michi_dark_mode',
    'michi_pin',
    'michi_pin_verified',
    'michi_onboarded',
  ]);
  window.location.reload();
}
</script>
