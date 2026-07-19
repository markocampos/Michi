<template>
  <div>
    <!-- Scroll wrapper: fixed to its parent's width, scrolls internally -->
    <div
      ref="scrollEl"
      style="
        width: 100%;
        overflow-x: auto;
        overflow-y: visible;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
      "
    >
      <!-- Inner grid: natural size, never wraps -->
      <div style="display: flex; flex-direction: column; width: max-content;">

        <!-- Month labels -->
        <div style="display: flex; padding-left: 26px; margin-bottom: 5px;">
          <div
            v-for="(month, idx) in months"
            :key="idx"
            style="flex-shrink: 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;"
            :style="{ width: `${month.weeks * CELL_TOTAL}px` }"
          >{{ month.name }}</div>
        </div>

        <!-- Day labels + week columns -->
        <div style="display: flex; align-items: flex-start;">

          <!-- Day-of-week labels -->
          <div style="display: flex; flex-direction: column; width: 22px; margin-right: 4px; flex-shrink: 0;" :style="{ gap: `${GAP}px` }">
            <div
              v-for="(label, i) in ['','Mon','','Wed','','Fri','']"
              :key="i"
              style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #9ca3af; text-align: right; line-height: 1;"
              :style="{ height: `${CELL_SIZE}px`, lineHeight: `${CELL_SIZE}px` }"
            >{{ label }}</div>
          </div>

          <!-- Weeks -->
          <div style="display: flex; flex-shrink: 0;" :style="{ gap: `${GAP}px` }">
            <div
              v-for="(week, wIdx) in calendarGrid"
              :key="wIdx"
              style="display: flex; flex-direction: column; flex-shrink: 0;"
              :style="{ gap: `${GAP}px`, width: `${CELL_SIZE}px` }"
            >
              <div
                v-for="day in week"
                :key="day.date"
                style="flex-shrink: 0; border-radius: 2px; cursor: default; transition: opacity 0.15s;"
                :style="{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }"
                :class="
                  day.count === 0 || day.isFuture ? 'bg-gray-200/70' :
                  day.count === 1 ? 'bg-forest/25' :
                  day.count === 2 ? 'bg-forest/50' :
                  day.count === 3 ? 'bg-forest/75' :
                  'bg-forest'
                "
                :title="day.isFuture ? '' : `${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100/60">
      <p class="text-sm font-medium text-charcoal">
        <span class="text-xl font-black text-forest mr-1">{{ totalYearlyPractices }}</span>
        total this year
      </p>
      <div class="flex items-center gap-[4px]">
        <span class="text-[10px] font-bold uppercase tracking-wider text-muted mr-1">Less</span>
        <div v-for="c in legendColors" :key="c"
          style="border-radius: 2px; flex-shrink: 0;"
          :class="c"
          :style="{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }"
        />
        <span class="text-[10px] font-bold uppercase tracking-wider text-muted ml-1">More</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { readJson } from '../composables/useStorage.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';

const scrollEl = ref(null);

const CELL_SIZE  = 11;
const GAP        = 3;
const CELL_TOTAL = CELL_SIZE + GAP;

const legendColors = [
  'bg-gray-200/70', 'bg-forest/25', 'bg-forest/50', 'bg-forest/75', 'bg-forest'
];

const maData          = readJson(STORAGE_KEYS.ma,          { sessions:    [] });
const shinrinData     = readJson(STORAGE_KEYS.shinrin,     { walks:       [] });
const wabisabiData    = readJson(STORAGE_KEYS.wabisabi,    { entries:     [] });
const mononoawareData = readJson(STORAGE_KEYS.mononoaware, { entries:     [] });
const ikigaiData      = readJson(STORAGE_KEYS.ikigai,      { reflections: [] });
const hanseiData      = readJson(STORAGE_KEYS.hansei,      { reflections: [] });
const kaizenData      = readJson(STORAGE_KEYS.kaizen,      { habits:      [] });
const gamanData       = readJson(STORAGE_KEYS.gaman,       { challenges:  [] });

const calendarGrid = computed(() => {
  const weeks = [];
  const today    = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const year     = today.getFullYear();

  const jan1  = new Date(year, 0, 1);
  const start = new Date(jan1);
  start.setDate(jan1.getDate() - jan1.getDay()); // back to Sunday

  const dec31 = new Date(year, 11, 31);
  const end   = new Date(dec31);
  end.setDate(dec31.getDate() + (6 - dec31.getDay())); // forward to Saturday

  const totalWeeks = Math.round((end - start) / (7 * 86_400_000)) + 1;
  const cur = new Date(start);

  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr  = cur.toISOString().split('T')[0];
      const isFuture = dateStr > todayStr;
      let count = 0;
      if (!isFuture) {
        if ((maData.sessions        || []).some(s => s.date === dateStr)) count++;
        if ((shinrinData.walks      || []).some(x => x.date === dateStr)) count++;
        if ((wabisabiData.entries   || []).some(x => x.date === dateStr)) count++;
        if ((mononoawareData.entries|| []).some(x => x.date === dateStr)) count++;
        if ((ikigaiData.reflections || []).some(x => x.date === dateStr)) count++;
        if ((hanseiData.reflections || []).some(x => x.date === dateStr)) count++;
        if ((kaizenData.habits      || []).some(h => h.completedDates?.includes(dateStr))) count++;
        if ((gamanData.challenges   || []).some(c => c.completedDates?.includes(dateStr))) count++;
      }
      week.push({ date: dateStr, count, isFuture, month: cur.getMonth(), year: cur.getFullYear() });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
});

const totalYearlyPractices = computed(() =>
  calendarGrid.value.flat().reduce((s, d) => s + d.count, 0)
);

const months = computed(() => {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year  = new Date().getFullYear();
  const result = [];
  let curMonth = -1, curWeeks = 0;

  calendarGrid.value.forEach(week => {
    const rep = week.find(d => d.year === year) || week[3];
    const m   = rep.month;
    if (m !== curMonth) {
      if (curMonth !== -1) result.push({ name: names[curMonth], weeks: curWeeks });
      curMonth = m; curWeeks = 1;
    } else { curWeeks++; }
  });
  if (curMonth !== -1) result.push({ name: names[curMonth], weeks: curWeeks });
  return result;
});
</script>
