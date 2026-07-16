<template>
  <div class="min-h-screen bg-warm-white text-charcoal pb-8">
    <div class="px-5 pt-12 pb-6 md:px-8 md:pt-14 lg:px-12 lg:pt-16 sticky top-0 bg-warm-white/90 backdrop-blur-md z-10 border-b border-gray-100/50 flex items-center gap-4">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-6 h-6 text-charcoal" />
      </button>
      <h1 class="text-xl font-bold text-charcoal">Privacy Policy</h1>
    </div>
    
    <div class="px-5 pt-8 pb-20 md:px-8 lg:px-12 max-w-3xl mx-auto space-y-8 text-sm leading-relaxed text-charcoal/80">
      <p class="font-medium text-xs tracking-widest uppercase text-muted">Last Updated: July 16, 2026</p>
      
      <p>Thank you for choosing Michi. Your privacy and mental well-being are our highest priorities. This Privacy Policy explains how your information is handled when you use the App.</p>
      
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
          <Icon icon="lucide:shield-check" class="w-5 h-5 text-forest" />
          1. No Data Collection
        </h2>
        <p>Michi is designed to be a deeply personal and private space. <strong class="text-charcoal font-semibold">We do not collect, transmit, store, or sell any of your personal data to external servers.</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>There are no user accounts.</li>
          <li>There are no analytics trackers.</li>
          <li>There are no third-party advertising SDKs.</li>
        </ul>
        <p>Everything you write in the App stays strictly on your device.</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
          <Icon icon="lucide:database" class="w-5 h-5 text-forest" />
          2. Local Storage
        </h2>
        <p>All your data—including your journal entries, meditation logs, habit streaks, and settings—is stored <strong class="text-charcoal font-semibold">100% locally</strong> on your device using local databases. If you uninstall the app without making a backup, your data will be permanently deleted by the operating system.</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
          <Icon icon="lucide:smartphone" class="w-5 h-5 text-forest" />
          3. Device Permissions
        </h2>
        <p>Michi requests specific device permissions strictly to enable core functionality:</p>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong class="text-charcoal font-semibold">Storage Permissions (Read/Write):</strong> Required exclusively for the "Auto-Backup" feature, which saves an encrypted-style backup file of your journal data directly to your device's public <code class="bg-gray-100 px-1 rounded text-xs font-mono">Documents</code> folder so that it survives app uninstalls. We never read files outside of what the App creates.</li>
          <li><strong class="text-charcoal font-semibold">Notifications:</strong> Required to send you daily reminders to complete your practices. These are scheduled locally on your device and do not rely on a server.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
          <Icon icon="lucide:lock" class="w-5 h-5 text-forest" />
          4. Security (PIN Lock)
        </h2>
        <p>Michi offers an optional 4-digit PIN lock to protect your journal entries from physical intruders who might have access to your unlocked phone. This PIN is hashed and verified locally; it cannot be recovered by the developer if forgotten.</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
          <Icon icon="lucide:mail" class="w-5 h-5 text-forest" />
          5. Contact
        </h2>
        <p>If you have any questions, concerns, or suggestions regarding this Privacy Policy or your data, please contact the developer:</p>
        <div class="glass p-5 rounded-2xl border border-gray-100/50 mt-4 shadow-sm bg-white/50">
          <p><strong class="text-charcoal font-semibold">Mark Ocampos</strong></p>
          <p class="mt-1 flex items-center gap-2"><Icon icon="lucide:mail" class="w-4 h-4 text-muted" /> <a href="mailto:contact.markocampos@gmail.com" class="text-forest hover:underline">contact.markocampos@gmail.com</a></p>
          <p class="mt-1 flex items-center gap-2"><Icon icon="lucide:github" class="w-4 h-4 text-muted" /> <a href="https://github.com/markocampos" target="_blank" rel="noopener" class="text-forest hover:underline">@markocampos</a></p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>
