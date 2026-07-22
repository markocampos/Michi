<template>
  <div>
    <div class="text-center mb-8">
      <Icon icon="lucide:leaf" class="w-10 h-10 text-forest mx-auto mb-3" />
      <h1 class="text-2xl font-bold text-charcoal">Wabi-sabi</h1>
      <p class="text-sm text-muted mt-1">侘寂 - Beauty in imperfection</p>
    </div>

    <DailyPrompt practiceId="wabisabi" />

    <div v-if="!showSummary" class="mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50">
        <p class="text-sm text-muted italic mb-4">"Once saved, this entry cannot be edited — embrace the imperfection."</p>
        <p class="text-sm text-forest mb-3">{{ currentPrompt }}</p>
        <label for="wabisabi-entry" class="sr-only">Write about an imperfection you embrace today</label>
        <textarea
          ref="inputRef"
          id="wabisabi-entry"
          v-model="newText"
          placeholder="Write about an imperfection you embrace today..."
          class="w-full h-32 p-4 border border-gray-200/50 bg-white/50 rounded-xl text-charcoal resize-none focus:outline-none focus:border-forest transition-colors"
        />
        <!-- Image Preview -->
        <div v-if="newPhoto" class="relative mt-3">
          <img :src="newPhoto" class="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-100" />
          <button @click="clearPhoto" aria-label="Remove attached photo" class="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm">
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex gap-3 mt-4">
          <input type="file" accept="image/*" ref="fileInput" @change="handleFileChange" class="hidden" />
          <button
            @click="fileInput?.click()"
            class="p-3 bg-white/50 border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors text-charcoal flex-shrink-0 shadow-sm"
            title="Attach a photo"
            aria-label="Attach a photo"
          >
            <Icon icon="lucide:camera" class="w-5 h-5" />
          </button>
          <button
            @click="save"
            :disabled="!newText.trim() && !newPhoto"
            class="flex-1 py-3 rounded-xl bg-forest text-white font-medium disabled:opacity-40 hover:bg-forest-dark transition-colors shadow-sm"
          >
            Save Forever
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center mb-6">
      <div class="glass rounded-2xl p-6 shadow-sm border border-gray-100/50 mb-6">
        <p class="text-sm text-forest font-medium mb-4">Embracing Imperfection</p>
        <div class="text-left mb-4">
          <p class="text-xs text-muted mb-2">{{ lastPrompt }}</p>
          <img v-if="lastEntryPhoto" :src="lastEntryPhoto" class="w-full h-48 object-cover rounded-xl mb-3 shadow-sm border border-gray-100" />
          <p v-if="lastEntryText" class="text-charcoal whitespace-pre-wrap font-serif italic border-l-2 border-forest/30 pl-3 py-1">{{ lastEntryText }}</p>
        </div>
      </div>
      <p class="text-sm text-muted italic">"Your entry has been saved exactly as written. Its beauty lies in its imperfection."</p>
      
      <button
        @click="showSummary = false"
        class="mt-6 px-6 py-2 rounded-xl border border-gray-200 text-muted font-medium hover:bg-gray-50 transition-colors"
      >
        Write Another
      </button>
    </div>


  </div>
</template>

<script setup>
import DailyPrompt from '../components/DailyPrompt.vue';
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { wabisabiPrompts } from '../data/prompts.js';
import { useStorage } from '../composables/useStorage.js';
import { useToast } from '../composables/useToast.js';
import { triggerHaptic } from '../utils/haptics.js';

const data = useStorage('michi_wabisabi', { entries: [] });
const { showToast } = useToast();
const newText = ref('');
const currentPrompt = ref(wabisabiPrompts[Math.floor(Math.random() * wabisabiPrompts.length)]);
const inputRef = ref(null);
const showSummary = ref(false);
const lastEntryText = ref('');
const lastPrompt = ref('');

const newPhoto = ref(null);
const fileInput = ref(null);
const lastEntryPhoto = ref(null);

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    newPhoto.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearPhoto() {
  newPhoto.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus();
    setTimeout(() => {
      inputRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
});

function save() {
  if (!newText.value.trim() && !newPhoto.value) return;
  const text = newText.value.trim();
  const prompt = currentPrompt.value;
  const photo = newPhoto.value;

  data.value.entries.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    text: text,
    photo: photo
  });

  lastEntryText.value = text;
  lastPrompt.value = prompt;
  lastEntryPhoto.value = photo;

  newText.value = '';
  clearPhoto();
  currentPrompt.value = wabisabiPrompts[Math.floor(Math.random() * wabisabiPrompts.length)];
  showToast('Entry saved forever', 'success');
  triggerHaptic();
  
  showSummary.value = true;
}
</script>
