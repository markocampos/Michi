<template>
  <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
    <div class="absolute -right-4 -top-4 text-9xl text-gray-100/30 opacity-50 select-none">"</div>
    
    <div class="absolute top-1 right-1 z-20 flex items-center">
      <button 
        @click="copyQuote" 
        class="p-4 rounded-xl text-gray-400 hover:text-forest active:bg-forest/10 transition-colors touch-manipulation"
        aria-label="Copy quote"
      >
        <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" class="w-5 h-5" :class="copied ? 'text-forest' : ''" />
      </button>
      <button 
        @click="shareQuote" 
        class="p-4 rounded-xl text-gray-400 hover:text-forest active:bg-forest/10 transition-colors touch-manipulation"
        aria-label="Share quote"
      >
        <Icon icon="lucide:share" class="w-5 h-5" />
      </button>
    </div>

    <p class="text-base md:text-lg font-medium text-charcoal leading-relaxed mb-4 relative z-10 pr-20" :title="quote.text">"{{ quote.text }}"</p>
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <span class="text-sm text-muted">- {{ quote.author }}</span>
      <span class="text-sm text-forest font-medium text-right">{{ quote.jp }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { triggerHaptic } from '../utils/haptics.js';
import { useToast } from '../composables/useToast.js';

const props = defineProps({
  quote: { type: Object, required: true }
});

const { showToast } = useToast();
const copied = ref(false);

async function copyQuote() {
  try {
    const textToCopy = `"${props.quote.text}" - ${props.quote.author} (${props.quote.jp})`;
    await Clipboard.write({ string: textToCopy });
    triggerHaptic();
    copied.value = true;
    showToast('Quote copied to clipboard', 'success');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

async function shareQuote() {
  try {
    triggerHaptic();
    const textToShare = `"${props.quote.text}" - ${props.quote.author} (${props.quote.jp})`;
    await Share.share({
      title: 'A thought from Michi',
      text: textToShare,
      dialogTitle: 'Share quote'
    });
  } catch (err) {
    console.error('Failed to share text: ', err);
  }
}
</script>
