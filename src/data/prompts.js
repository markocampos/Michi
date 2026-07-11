export const ikigaiPrompts = [
  {
    step: 1,
    title: "What do you love?",
    subtitle: "What activities make you lose track of time?",
    placeholder: "I love...",
    jp: "好きなこと"
  },
  {
    step: 2,
    title: "What are you good at?",
    subtitle: "What skills come naturally to you?",
    placeholder: "I am good at...",
    jp: "得意なこと"
  },
  {
    step: 3,
    title: "What does the world need?",
    subtitle: "What problem do you wish you could solve?",
    placeholder: "The world needs...",
    jp: "世界に必要なこと"
  },
  {
    step: 4,
    title: "What can you be paid for?",
    subtitle: "What value can you provide that others would invest in?",
    placeholder: "I can be paid for...",
    jp: "お金にできること"
  }
];

export const wabisabiPrompts = [
  "What imperfection did you accept today?",
  "Describe something broken that still holds beauty.",
  "What flaw in yourself are you learning to embrace?",
  "What went wrong today that taught you something?",
  "Describe a moment of beautiful imperfection you witnessed.",
];

export const mononoawarePrompts = [
  "What are you grateful for today?",
  "What changed today that you want to remember?",
  "What season of life are you in right now?",
  "What moment today felt fleeting and precious?",
  "What will you miss about today when it's gone?",
];

export const gamanChallenges = [
  { id: 'meditate-30', name: 'Daily Meditation', days: 30, description: '30 days of mindful breathing', jp: '瞑想30日' },
  { id: 'gratitude-60', name: 'Gratitude Practice', days: 60, description: '60 days of thankfulness', jp: '感謝60日' },
  { id: 'nature-90', name: 'Nature Connection', days: 90, description: '90 days of forest bathing', jp: '自然との繋がり90日' },
  { id: 'journal-30', name: 'Daily Journaling', days: 30, description: '30 days of self-reflection', jp: '日記30日' },
  { id: 'kaizen-60', name: 'Micro-Habits', days: 60, description: '60 days of 1% improvements', jp: '改善60日' },
];

export function getSeason(date = new Date()) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return { en: 'Spring', jp: '春', color: '#E8B4B8' };
  if (month >= 5 && month <= 7) return { en: 'Summer', jp: '夏', color: '#7BAE7F' };
  if (month >= 8 && month <= 10) return { en: 'Autumn', jp: '秋', color: '#D4956A' };
  return { en: 'Winter', jp: '冬', color: '#A8C4D8' };
}
