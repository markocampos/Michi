<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
      <div
        class="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insights-title"
      >
        <div class="p-6 pb-4 border-b border-gray-100/50 flex-shrink-0 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
              <Icon icon="lucide:leaf" class="w-5 h-5 text-forest" />
            </div>
            <div>
              <h2 id="insights-title" class="text-xl font-bold text-charcoal">Inner Reflection</h2>
              <p class="text-xs text-muted font-medium tracking-widest uppercase">Naikan • 内省</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-muted hover:text-charcoal transition-colors">
            <Icon icon="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 overscroll-contain space-y-6">
          <div class="text-center py-4">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 border-4" :class="primaryMood.bgClass">
              <Icon :icon="primaryMood.icon" class="w-10 h-10" :class="primaryMood.color" />
            </div>
            <h3 class="text-xl font-bold text-charcoal mb-1">{{ primaryMood.title }}</h3>
            <p class="text-sm font-medium tracking-widest uppercase text-muted mb-3">{{ primaryMood.kanji }}</p>
            <p class="text-sm text-charcoal/80 leading-relaxed max-w-[280px] mx-auto italic">"{{ primaryMood.message }}"</p>
          </div>

          <div v-if="foundKeywords.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold uppercase tracking-wider text-muted">Echoes of the Mind</h4>
              <span class="text-[10px] text-muted">Words you carry</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="kw in foundKeywords"
                :key="kw.word"
                class="px-4 py-2 rounded-xl text-xs font-medium border transition-colors"
                :class="
                  kw.type === 'positive' ? 'bg-forest/5 border-forest/20 text-forest-dark' :
                  kw.type === 'negative' ? 'bg-torii/5 border-torii/20 text-torii' :
                  'bg-gray-100/80 border-gray-200 text-charcoal/80'
                "
              >
                {{ kw.word }} <span class="opacity-50 ml-1">{{ kw.count }}</span>
              </span>
            </div>
          </div>

          <div class="relative bg-gray-50/80 rounded-2xl p-5 border border-gray-100/50 overflow-hidden">
            <Icon icon="lucide:quote" class="absolute -top-2 -left-2 w-16 h-16 text-gray-200/50 -rotate-12" />
            <h4 class="relative text-xs font-bold uppercase tracking-wider text-muted mb-3">Guidance</h4>
            <p class="relative text-sm text-charcoal leading-relaxed">
              In your recent writings, you have woven <span class="font-bold text-forest-dark">{{ positiveCount }} words of light</span>, <span class="font-bold text-gray-500">{{ neutralCount }} gray words of stillness</span>, and <span class="font-bold text-torii">{{ negativeCount }} words of weight</span>.
              <br><br>
              {{ summaryMessage }}
            </p>
          </div>
        </div>
      </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { positiveWords, negativeWords, neutralWords, quotes } from '../utils/sentiment-words.js';

const quoteIndex = ref(Math.floor(Math.random() * 4));

const props = defineProps({
  entries: { type: Array, required: true }
});

defineEmits(['close']);

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const analysis = computed(() => {
  let pos = 0;
  let neg = 0;
  let neu = 0;
  const wordCounts = {};

  // Analyze all text in entries
  props.entries.forEach(entry => {
    const textToAnalyze = entry.rawText || ((entry.text || '') + ' ' + (entry.secondary || ''));
    const text = textToAnalyze.toLowerCase();
    
    positiveWords.forEach(word => {
      // Regex for exact word match
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = text.match(regex);
      if (matches) {
        pos += matches.length;
        wordCounts[word] = { count: (wordCounts[word]?.count || 0) + matches.length, type: 'positive' };
      }
    });

    neutralWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = text.match(regex);
      if (matches) {
        neu += matches.length;
        wordCounts[word] = { count: (wordCounts[word]?.count || 0) + matches.length, type: 'neutral' };
      }
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = text.match(regex);
      if (matches) {
        neg += matches.length;
        wordCounts[word] = { count: (wordCounts[word]?.count || 0) + matches.length, type: 'negative' };
      }
    });
  });

  const keywords = Object.keys(wordCounts)
    .map(word => ({ word, ...wordCounts[word] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 themes

  return { pos, neg, neu, keywords };
});

const positiveCount = computed(() => analysis.value.pos);
const negativeCount = computed(() => analysis.value.neg);
const neutralCount = computed(() => analysis.value.neu);
const foundKeywords = computed(() => analysis.value.keywords);

const primaryMood = computed(() => {
  const i = quoteIndex.value;
  if (positiveCount.value === 0 && negativeCount.value === 0 && neutralCount.value === 0) {
    return {
      title: "Still Water",
      kanji: "静水",
      message: quotes.quiet[i],
      icon: "lucide:droplet",
      color: "text-muted",
      bgClass: "bg-gray-50 border-gray-100"
    };
  }

  if (positiveCount.value >= negativeCount.value * 1.5) {
    return {
      title: "Blossoming Spirit",
      kanji: "開花",
      message: quotes.blossom[i],
      icon: "lucide:flower-2",
      color: "text-forest",
      bgClass: "bg-forest/10 border-forest/20"
    };
  } else if (negativeCount.value >= positiveCount.value * 1.5) {
    return {
      title: "Weathering the Storm",
      kanji: "忍耐",
      message: quotes.storm[i],
      icon: "lucide:cloud-rain",
      color: "text-torii",
      bgClass: "bg-torii/10 border-torii/20"
    };
  } else {
    return {
      title: "Tranquil Balance",
      kanji: "平穏",
      message: quotes.balance[i],
      icon: "lucide:scale",
      color: "text-earth-dark",
      bgClass: "bg-earth/20 border-earth/30"
    };
  }
});

const summaryMessage = computed(() => {
  if (positiveCount.value === 0 && negativeCount.value === 0 && neutralCount.value === 0) {
    return "Your journal rests quietly. When you are ready, pour your unfiltered thoughts onto the page. There is no right or wrong way to feel.";
  }
  
  if (foundKeywords.value.length > 0) {
    const topWord = foundKeywords.value[0].word;
    const type = foundKeywords.value[0].type;
    
    if (type === 'negative') {
      return `The word '${topWord}' surfaces frequently like a ripple in a stream. In Morita therapy, we are taught to accept our feelings as they are, like the weather. Observe this heaviness, breathe into it, and allow it to pass through you at its own pace.`;
    } else if (type === 'positive') {
      return `Your mind frequently returns to '${topWord}'. Like a tree turning its leaves toward the sun, you are naturally orienting yourself toward growth and harmony. Nurture this gentle energy.`;
    } else {
      return `The word '${topWord}' anchors your thoughts. These gray words of stillness show a mind that is observing rather than reacting. This is the essence of mindfulness—simply noticing what is, without judgment.`;
    }
  }
  
  return "You are doing well walking the path (道). Continue to observe your mind without judgment.";
});
</script>
