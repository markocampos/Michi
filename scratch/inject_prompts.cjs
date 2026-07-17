const fs = require('fs');
const path = require('path');

const practiceIds = {
  'GamanPractice.vue': 'gaman',
  'HanseiPractice.vue': 'hansei',
  'IkigaiPractice.vue': 'ikigai',
  'KaizenPractice.vue': 'kaizen',
  'MaPractice.vue': 'ma',
  'MonoNoAwarePractice.vue': 'mononoaware',
  'ShinrinYokuPractice.vue': 'shinrin',
  'WabiSabiPractice.vue': 'wabisabi'
};

const dir = path.join(__dirname, '../src/practices');

Object.keys(practiceIds).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('DailyPrompt')) return; // Already injected

  // 1. Inject import
  content = content.replace('<script setup>', "<script setup>\nimport DailyPrompt from '../components/DailyPrompt.vue';");

  // 2. Inject component after header
  // Header looks like:
  // <p class="text-sm text-muted mt-1">...</p>
  // </div>
  const headerEndRegex = /(<\/p>\s*<\/div>)/;
  content = content.replace(headerEndRegex, `$1\n\n    <DailyPrompt practiceId="${practiceIds[file]}" />`);

  fs.writeFileSync(filePath, content);
  console.log('Injected DailyPrompt into', file);
});
