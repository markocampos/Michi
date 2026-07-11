import { ref } from 'vue';
import { quotes } from '../data/quotes.js';

const currentQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

export function useQuote() {
  function refresh() {
    currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return { en: 'Good night', jp: 'おやすみなさい' };
    if (hour < 12) return { en: 'Good morning', jp: 'おはようございます' };
    if (hour < 17) return { en: 'Good afternoon', jp: 'こんにちは' };
    if (hour < 21) return { en: 'Good evening', jp: 'こんばんは' };
    return { en: 'Good night', jp: 'おやすみなさい' };
  }

  return { currentQuote, refresh, getGreeting };
}
