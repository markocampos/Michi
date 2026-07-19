<template>
  <div
    class="px-5 pt-12 pb-8 md:px-8 md:pt-14 lg:px-12 lg:pt-16"
  >

    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-charcoal md:text-3xl lg:text-4xl">Growth</h1>
        <p class="text-sm text-muted mt-1">Your journey of continuous improvement</p>
      </div>
    </div>

    <!-- Zen Journey Banner -->
    <div class="relative overflow-hidden glass rounded-3xl p-6 shadow-sm border border-gray-100/50 mb-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left bg-gradient-to-b from-white to-gray-50">
      <div class="relative flex-shrink-0 mt-2 md:mt-0">
        <Icon v-if="growthStage.icon.startsWith('lucide:')" :icon="growthStage.icon" class="w-16 h-16" :class="growthStage.color" />
        <div v-else class="text-6xl flex items-center justify-center w-16 h-16 grayscale opacity-80 select-none transform transition-transform group-hover:scale-110">
          {{ growthStage.icon }}
        </div>
        <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
          <Icon icon="lucide:star" class="w-4 h-4 text-earth-dark" />
        </div>
      </div>
      <div class="flex-1 w-full">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-2 gap-2">
          <div>
            <div class="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h2 class="text-2xl font-bold text-charcoal">{{ growthStage.name }}</h2>
              <span class="text-xs font-bold uppercase tracking-widest text-muted border border-gray-200 px-2 py-0.5 rounded-full">{{ growthStage.kanji }}</span>
            </div>
            <p class="text-sm text-charcoal/70">{{ growthStage.desc }}</p>
          </div>
          <div class="flex items-center justify-end gap-1.5 md:justify-end">
            <p class="text-[11px] font-bold tracking-wider uppercase text-muted text-right">
              {{ growthStage.currentLevelXP }} / {{ growthStage.levelRequiredXP }} XP
            </p>
            <button @click="showXpModal = true" class="text-muted hover:text-charcoal transition-colors p-1 -mr-1" aria-label="What is XP?">
              <Icon icon="lucide:help-circle" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
          <div class="h-full rounded-full transition-all duration-1000 ease-out" :class="growthStage.barColor" :style="{ width: `${growthStage.progress}%` }" />
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 gap-3 mb-8 md:grid-cols-4 md:gap-5">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-forest/30 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon icon="lucide:wind" class="w-5 h-5 text-forest mb-2" />
        <p class="text-2xl font-black text-charcoal mb-0.5">{{ totalMeditationMin }}<span class="text-xs font-medium text-muted ml-1">min</span></p>
        <p class="text-[10px] text-muted font-medium uppercase tracking-wider">Meditated</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-summer/30 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-summer/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon icon="lucide:trees" class="w-5 h-5 text-summer-dark mb-2" />
        <p class="text-2xl font-black text-charcoal mb-0.5">{{ totalWalks }}<span class="text-xs font-medium text-muted ml-1">walks</span></p>
        <p class="text-[10px] text-muted font-medium uppercase tracking-wider">Nature</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-torii/30 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-torii/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon icon="lucide:book-open" class="w-5 h-5 text-torii mb-2" />
        <p class="text-2xl font-black text-charcoal mb-0.5">{{ totalEntries }}<span class="text-xs font-medium text-muted ml-1">entries</span></p>
        <p class="text-[10px] text-muted font-medium uppercase tracking-wider">Journaled</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-earth/30 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-earth/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon icon="lucide:flame" class="w-5 h-5 text-earth-dark mb-2" />
        <p class="text-2xl font-black text-charcoal mb-0.5">{{ currentStreak }}<span class="text-xs font-medium text-muted ml-1">days</span></p>
        <p class="text-[10px] text-muted font-medium uppercase tracking-wider">Streak</p>
      </div>
    </div>

    <!-- Activity Heatmap (Calendar Style) -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-charcoal text-lg">Activity Calendar</h3>
          <p class="text-xs text-muted mt-0.5">Your rhythm over this week</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold" :class="weeklyTrend >= 0 ? 'text-forest' : 'text-torii'">
            {{ weeklyTrend >= 0 ? '+' : '' }}{{ weeklyTrend }}
          </p>
          <p class="text-[10px] text-muted">vs last week</p>
        </div>
      </div>
      
      <!-- Week View (Mobile only) -->
      <div class="md:hidden">
        <div class="grid grid-cols-7 gap-2 max-w-md mx-auto mb-2">
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sun</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Mon</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Tue</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Wed</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Thu</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Fri</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sat</div>
        </div>
        
        <div class="grid grid-cols-7 gap-2 max-w-md mx-auto mb-5">
          <div
            v-for="day in calendarWeekDays"
            :key="day.date"
            class="aspect-square rounded-lg transition-all duration-300 flex items-center justify-center relative"
            :class="
              day.isFuture ? 'bg-transparent border border-dashed border-gray-200' :
              day.count === 0 ? 'bg-gray-50 border border-gray-100' : 
              day.count <= 1 ? 'bg-forest/20 border border-forest/10' : 
              day.count <= 2 ? 'bg-forest/40 border border-forest/20' : 
              day.count <= 3 ? 'bg-forest/70 border border-forest/30 text-white' : 
              'bg-forest border border-forest-dark text-white shadow-sm'
            "
            :title="day.isFuture ? 'Future' : `${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
          >
            <span v-if="!day.isFuture" class="text-sm font-bold" :class="day.count > 2 ? 'text-white' : 'text-charcoal/80'">
              {{ day.dayOfMonth }}
            </span>
          </div>
        </div>
        
        <button @click="showMonthModal = true" class="w-full py-2.5 bg-gray-50 text-charcoal rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-colors">
          View full month
        </button>
      </div>

      <!-- Month View (Tablet only) -->
      <div class="hidden md:block lg:hidden">
        <div class="grid grid-cols-7 gap-2 max-w-md mx-auto mb-2">
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sun</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Mon</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Tue</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Wed</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Thu</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Fri</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sat</div>
        </div>
        
        <div class="grid grid-cols-7 gap-2 max-w-md mx-auto">
          <div
            v-for="day in calendarMonthDays"
            :key="day.date"
            class="aspect-square rounded-lg transition-all duration-300 flex items-center justify-center relative cursor-default hover:-translate-y-0.5 hover:shadow-md"
            :class="
              day.isFuture ? 'bg-transparent border border-dashed border-gray-200' :
              day.count === 0 ? 'bg-gray-50 border border-gray-100' : 
              day.count <= 1 ? 'bg-forest/20 border border-forest/10' : 
              day.count <= 2 ? 'bg-forest/40 border border-forest/20' : 
              day.count <= 3 ? 'bg-forest/70 border border-forest/30 text-white' : 
              'bg-forest border border-forest-dark text-white shadow-sm'
            "
            :title="day.isFuture ? 'Future' : `${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
          >
            <span v-if="!day.isFuture" class="text-sm font-bold" :class="day.count > 2 ? 'text-white' : 'text-charcoal/80'">
              {{ day.dayOfMonth }}
            </span>
          </div>
        </div>
      </div>

      <!-- 8-Month View (Desktop only) -->
      <div class="hidden lg:block xl:hidden overflow-x-auto pb-4 custom-scrollbar">
        <div class="w-max mx-auto flex gap-1.5">
          <!-- Days of week labels (left side) -->
          <div class="flex flex-col gap-[7px] pr-2 pt-[21px]">
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Sun</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Mon</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Tue</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Wed</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Thu</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Fri</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Sat</div>
          </div>
          
          <div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 mb-2 pl-1">Last 8 Months</div>
            <!-- Grid of 34 columns -->
            <div class="grid grid-flow-col grid-rows-7 gap-[7px]">
              <div
                v-for="day in calendarEightMonthDays"
                :key="day.date"
                class="w-[12px] h-[12px] rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 relative cursor-pointer"
                :class="
                  day.isFuture ? 'bg-transparent border border-dashed border-gray-200' :
                  day.count === 0 ? 'bg-gray-50 border border-gray-100 hover:bg-gray-200/60' : 
                  day.count <= 1 ? 'bg-forest/20 border border-forest/10 hover:bg-forest/30' : 
                  day.count <= 2 ? 'bg-forest/40 border border-forest/20 hover:bg-forest/50' : 
                  day.count <= 3 ? 'bg-forest/70 border border-forest/30 hover:bg-forest/80' : 
                  'bg-forest border border-forest-dark hover:bg-forest-dark shadow-sm'
                "
                :title="day.isFuture ? 'Future' : `${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Year View (Desktop L/XL only) -->
      <div class="hidden xl:block overflow-x-auto pb-4 custom-scrollbar">
        <div class="w-max mx-auto flex gap-1.5">
          <!-- Days of week labels (left side) -->
          <div class="flex flex-col gap-[7px] pr-2 pt-[21px]">
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Sun</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Mon</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Tue</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Wed</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Thu</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Fri</div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 h-3 flex items-center justify-end">Sat</div>
          </div>
          
          <div>
            <div class="text-[10px] font-bold tracking-wider uppercase text-muted/60 mb-2 pl-1">Last 12 Months</div>
            <!-- Grid of 52 columns -->
            <div class="grid grid-flow-col grid-rows-7 gap-[7px]">
              <div
                v-for="day in calendarYearDays"
                :key="day.date"
                class="w-[12px] h-[12px] rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 relative cursor-pointer"
                :class="
                  day.isFuture ? 'bg-transparent border border-dashed border-gray-200' :
                  day.count === 0 ? 'bg-gray-50 border border-gray-100 hover:bg-gray-200/60' : 
                  day.count <= 1 ? 'bg-forest/20 border border-forest/10 hover:bg-forest/30' : 
                  day.count <= 2 ? 'bg-forest/40 border border-forest/20 hover:bg-forest/50' : 
                  day.count <= 3 ? 'bg-forest/70 border border-forest/30 hover:bg-forest/80' : 
                  'bg-forest border border-forest-dark hover:bg-forest-dark shadow-sm'
                "
                :title="day.isFuture ? 'Future' : `${day.date}: ${day.count} practice${day.count !== 1 ? 's' : ''}`"
              >
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-center sm:justify-end gap-1.5 mt-6">
        <span class="text-[10px] font-bold uppercase tracking-wider text-muted mr-2">Less</span>
        <div class="w-4 h-4 rounded-md bg-gray-50 border border-gray-100" />
        <div class="w-4 h-4 rounded-md bg-forest/20 border border-forest/10" />
        <div class="w-4 h-4 rounded-md bg-forest/40 border border-forest/20" />
        <div class="w-4 h-4 rounded-md bg-forest/70 border border-forest/30" />
        <div class="w-4 h-4 rounded-md bg-forest border border-forest-dark" />
        <span class="text-[10px] font-bold uppercase tracking-wider text-muted ml-2">More</span>
      </div>
    </div>

    <!-- Practice Breakdown -->
    <h3 class="font-semibold text-charcoal mb-4">Practice Breakdown</h3>
    <p class="text-[10px] text-muted mb-4">How much you've done in each practice area. Data comes from your completed practices.</p>

    <div class="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:grid-cols-3 xl:gap-5">

      <!-- Ma (Meditation) -->
      <div v-if="maData.sessions?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
            <Icon icon="lucide:wind" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Ma 間</h4>
            <p class="text-[10px] text-muted">Meditation sessions</p>
          </div>
          <span class="text-lg font-bold text-forest">{{ totalMeditationMin }} min</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-forest h-2 rounded-full transition-all" :style="{ width: Math.min((maData.sessions.length / 10) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">{{ maData.sessions.length }} session{{ maData.sessions.length !== 1 ? 's' : '' }} completed</p>
      </div>

      <!-- Shinrin-yoku (Forest Bathing) -->
      <div v-if="shinrinData.walks?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-summer/20 flex items-center justify-center">
            <Icon icon="lucide:trees" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Shinrin-yoku 森林浴</h4>
            <p class="text-[10px] text-muted">Forest bathing walks</p>
          </div>
          <span class="text-lg font-bold text-forest">{{ totalWalks }} walks</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-forest h-2 rounded-full transition-all" :style="{ width: Math.min((totalWalks / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">{{ shinrinTotalMin }} minutes in nature total</p>
      </div>

      <!-- Wabi-sabi -->
      <div v-if="wabisabiData.entries?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-earth/10 flex items-center justify-center">
            <Icon icon="lucide:leaf" class="w-5 h-5 text-earth" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Wabi-sabi 侘寂</h4>
            <p class="text-[10px] text-muted">Moments of beautiful imperfection</p>
          </div>
          <span class="text-lg font-bold text-earth-dark">{{ wabisabiData.entries.length }} entries</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-earth h-2 rounded-full transition-all" :style="{ width: Math.min((wabisabiData.entries.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Reflections on embracing imperfection</p>
      </div>

      <!-- Ikigai -->
      <div v-if="ikigaiData.reflections?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-torii/10 flex items-center justify-center">
            <Icon icon="lucide:target" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Ikigai 生きがい</h4>
            <p class="text-[10px] text-muted">Your reason for being</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ ikigaiData.reflections.length }} reflections</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-torii h-2 rounded-full transition-all" :style="{ width: Math.min((ikigaiData.reflections.length / 3) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Times you explored what you love, do well, and value</p>
      </div>

      <!-- Hansei -->
      <div v-if="hanseiData.reflections?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-torii/10 flex items-center justify-center">
            <Icon icon="lucide:scan-eye" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Hansei 反省</h4>
            <p class="text-[10px] text-muted">Self-reflection</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ hanseiData.reflections.length }} reflections</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-torii h-2 rounded-full transition-all" :style="{ width: Math.min((hanseiData.reflections.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Times you reflected on what went well and what to improve</p>
      </div>

      <!-- Mono no aware -->
      <div v-if="mononoawareData.entries?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-spring/20 flex items-center justify-center">
            <Icon icon="lucide:flower-2" class="w-5 h-5 text-torii" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Mono no aware 物の哀れ</h4>
            <p class="text-[10px] text-muted">Awareness of impermanence</p>
          </div>
          <span class="text-lg font-bold text-torii">{{ mononoawareData.entries.length }} entries</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-spring h-2 rounded-full transition-all" :style="{ width: Math.min((mononoawareData.entries.length / 5) * 100, 100) + '%' }" />
        </div>
        <p class="text-[10px] text-muted mt-1">Gratitude and impermanence reflections</p>
      </div>

      <!-- Kaizen -->
      <div v-if="kaizenData.habits?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
            <Icon icon="lucide:trending-up" class="w-5 h-5 text-forest" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Kaizen 改善</h4>
            <p class="text-[10px] text-muted">Micro-habits — small daily improvements</p>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="habit in kaizenData.habits" :key="habit.id" class="flex items-center gap-2">
            <span class="text-xs text-charcoal flex-1">{{ habit.name }}</span>
            <span class="text-[10px] text-muted">{{ habit.completedDates?.length || 0 }} days done</span>
            <div class="flex items-center gap-0.5">
              <Icon icon="lucide:flame" class="w-3 h-3 text-forest" />
              <span class="text-[10px] font-bold text-forest">{{ getHabitStreak(habit) }}d streak</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gaman -->
      <div v-if="gamanData.challenges?.length > 0" class="glass rounded-2xl p-5 shadow-sm border border-gray-100/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-earth/10 flex items-center justify-center">
            <Icon icon="lucide:mountain" class="w-5 h-5 text-earth-dark" />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-charcoal">Gaman 我慢</h4>
            <p class="text-[10px] text-muted">Endurance challenges — long-term commitment</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="c in gamanData.challenges" :key="c.id">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-charcoal">{{ c.name }}</span>
              <span class="text-[10px] font-medium" :class="c.status === 'completed' ? 'text-forest' : 'text-earth-dark'">
                {{ c.completedDates?.length || 0 }} of {{ c.goalDays }} days
                {{ c.status === 'completed' ? '(Done!)' : '' }}
              </span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="c.status === 'completed' ? 'bg-forest' : 'bg-earth'"
                :style="{ width: Math.min(((c.completedDates?.length || 0) / (c.goalDays || 1)) * 100, 100) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Empty state -->
    <div v-if="totalMeditationMin === 0 && totalWalks === 0 && totalEntries === 0" class="text-center mt-8">
      <div class="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
        <Icon icon="lucide:sprout" class="w-10 h-10 text-forest" />
      </div>
      <p class="font-semibold text-charcoal mb-1">Your growth journey awaits</p>
      <p class="text-sm text-muted mb-4">Complete some practices to see your progress here.</p>
      <router-link to="/practices" class="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors">
        <Icon icon="lucide:plus" class="w-4 h-4" />
        Start a practice
      </router-link>
    </div>

    <!-- XP Info Modal -->
    <XpInfoModal v-if="showXpModal" @close="showXpModal = false" />
    <!-- Month Calendar Modal (Mobile) -->
    <div v-if="showMonthModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" @click="showMonthModal = false"></div>
      
      <!-- Modal Content -->
      <div class="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in-up">
        <button @click="showMonthModal = false" class="absolute top-4 right-4 p-2 text-muted hover:text-charcoal bg-gray-50 rounded-full transition-colors">
          <Icon icon="lucide:x" class="w-5 h-5" />
        </button>
        
        <h3 class="font-bold text-charcoal text-xl mb-1">Month View</h3>
        <p class="text-sm text-muted mb-6">Your activity over the last 5 weeks</p>
        
        <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sun</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Mon</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Tue</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Wed</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Thu</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Fri</div>
          <div class="text-center text-[10px] font-bold tracking-wider uppercase text-muted/60">Sat</div>
        </div>
        
        <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
          <div
            v-for="day in calendarMonthDays"
            :key="day.date"
            class="aspect-square rounded-md transition-all duration-300 flex items-center justify-center relative"
            :class="
              day.isFuture ? 'bg-transparent border border-dashed border-gray-200' :
              day.count === 0 ? 'bg-gray-50 border border-gray-100' : 
              day.count <= 1 ? 'bg-forest/20 border border-forest/10' : 
              day.count <= 2 ? 'bg-forest/40 border border-forest/20' : 
              day.count <= 3 ? 'bg-forest/70 border border-forest/30 text-white' : 
              'bg-forest border border-forest-dark text-white shadow-sm'
            "
          >
            <span v-if="!day.isFuture" class="text-xs sm:text-sm font-bold" :class="day.count > 2 ? 'text-white' : 'text-charcoal/80'">
              {{ day.dayOfMonth }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted mr-2">Less</span>
          <div class="w-4 h-4 rounded-md bg-gray-50 border border-gray-100" />
          <div class="w-4 h-4 rounded-md bg-forest/20 border border-forest/10" />
          <div class="w-4 h-4 rounded-md bg-forest/40 border border-forest/20" />
          <div class="w-4 h-4 rounded-md bg-forest/70 border border-forest/30" />
          <div class="w-4 h-4 rounded-md bg-forest border border-forest-dark" />
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted ml-2">More</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import XpInfoModal from '../components/XpInfoModal.vue';
import { readJson } from '../composables/useStorage.js';
import levelsData from '../utils/levels.json';
import { calculateStreak, getHabitStreak } from '../utils/streaks.js';
import { getLastNDays } from '../utils/dates.js';
import { STORAGE_KEYS } from '../utils/storage-keys.js';
const showXpModal = ref(false);

const maData = readJson(STORAGE_KEYS.ma, { sessions: [] });
const shinrinData = readJson(STORAGE_KEYS.shinrin, { walks: [] });
const wabisabiData = readJson(STORAGE_KEYS.wabisabi, { entries: [] });
const mononoawareData = readJson(STORAGE_KEYS.mononoaware, { entries: [] });
const ikigaiData = readJson(STORAGE_KEYS.ikigai, { reflections: [] });
const hanseiData = readJson(STORAGE_KEYS.hansei, { reflections: [] });
const kaizenData = readJson(STORAGE_KEYS.kaizen, { habits: [] });
const gamanData = readJson(STORAGE_KEYS.gaman, { challenges: [] });

// --- Stats ---
const totalMeditationMin = computed(() => {
  const sessions = maData.sessions || [];
  const totalSeconds = sessions.reduce((s, x) => s + (x.duration || 0), 0);
  return Math.round(totalSeconds / 60);
});
const totalWalks = computed(() => (shinrinData.walks || []).length);
const totalEntries = computed(() =>
  (wabisabiData.entries || []).length +
  (mononoawareData.entries || []).length +
  (ikigaiData.reflections || []).length +
  (hanseiData.reflections || []).length
);
const currentStreak = computed(() => calculateStreak(kaizenData, gamanData));

// --- Shinrin total min ---
const shinrinTotalMin = computed(() => {
  const walks = shinrinData.walks || [];
  const totalSeconds = walks.reduce((sum, w) => sum + (w.duration || 0), 0);
  return Math.round(totalSeconds / 60);
});

// --- Growth XP & Stage ---
const totalXP = computed(() => {
  return totalMeditationMin.value + (totalWalks.value * 10) + (totalEntries.value * 5) + (currentStreak.value * 20);
});

const growthStage = computed(() => {
  const xp = totalXP.value;
  
  let currentLevelIndex = -1;
  let accumulatedXP = 0;
  
  for (let i = 0; i < levelsData.length; i++) {
    const lvl = levelsData[i];
    if (xp < accumulatedXP + lvl.requiredXP) {
      currentLevelIndex = i;
      break;
    }
    accumulatedXP += lvl.requiredXP;
  }
  
  // Cap at max level if they somehow exceed everything
  if (currentLevelIndex === -1) {
    currentLevelIndex = levelsData.length - 1;
    accumulatedXP -= levelsData[currentLevelIndex].requiredXP;
  }
  
  const currentLvl = levelsData[currentLevelIndex];
  const xpInCurrentLevel = xp - accumulatedXP;
  const progress = (xpInCurrentLevel / currentLvl.requiredXP) * 100;
  
  return {
    name: currentLvl.name,
    kanji: `LV ${currentLvl.level}`,
    desc: 'The path is the path. Keep walking.',
    icon: currentLvl.icon,
    color: 'text-charcoal',
    barColor: 'bg-forest',
    currentLevelXP: xpInCurrentLevel,
    levelRequiredXP: currentLvl.requiredXP,
    progress: Math.min(progress, 100)
  };
});

// --- Heatmap (Aligned to Sunday-Saturday Calendar view) ---
const showMonthModal = ref(false);

function getDays(numDays) {
  const days = [];
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Find the upcoming Saturday to ensure grid aligns correctly ending on a Saturday
  const upcomingSaturday = new Date(today);
  upcomingSaturday.setDate(upcomingSaturday.getDate() + (6 - upcomingSaturday.getDay()));

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(upcomingSaturday);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfMonth = d.getDate();
    
    const isFuture = dateStr > todayStr;
    let count = 0;
    
    if (!isFuture) {
      if ((maData.sessions || []).some(s => s.date === dateStr)) count++;
      if ((shinrinData.walks || []).some(w => w.date === dateStr)) count++;
      if ((wabisabiData.entries || []).some(e => e.date === dateStr)) count++;
      if ((mononoawareData.entries || []).some(e => e.date === dateStr)) count++;
      if ((ikigaiData.reflections || []).some(r => r.date === dateStr)) count++;
      if ((hanseiData.reflections || []).some(r => r.date === dateStr)) count++;
      if ((kaizenData.habits || []).some(h => h.completedDates?.includes(dateStr))) count++;
      if ((gamanData.challenges || []).some(c => c.completedDates?.includes(dateStr))) count++;
    }
    
    days.push({ date: dateStr, count, isFuture, dayOfMonth });
  }
  return days;
}

const calendarWeekDays = computed(() => getDays(7));
const calendarMonthDays = computed(() => getDays(35));
const calendarEightMonthDays = computed(() => getDays(238));
const calendarYearDays = computed(() => getDays(364));

// Scroll lock when modal is open
watch(showMonthModal, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
onUnmounted(() => {
  document.body.style.overflow = '';
});

// --- Weekly Trend ---
const weeklyTrend = computed(() => {
  let thisWeek = 0;
  let lastWeek = 0;
  
  const d = new Date();
  
  for (let i = 0; i < 14; i++) {
    const dateStr = d.toISOString().split('T')[0];
    let count = 0;
    
    if ((maData.sessions || []).some(s => s.date === dateStr)) count++;
    if ((shinrinData.walks || []).some(w => w.date === dateStr)) count++;
    if ((wabisabiData.entries || []).some(e => e.date === dateStr)) count++;
    if ((mononoawareData.entries || []).some(e => e.date === dateStr)) count++;
    if ((ikigaiData.reflections || []).some(r => r.date === dateStr)) count++;
    if ((hanseiData.reflections || []).some(r => r.date === dateStr)) count++;
    if ((kaizenData.habits || []).some(h => h.completedDates?.includes(dateStr))) count++;
    if ((gamanData.challenges || []).some(c => c.completedDates?.includes(dateStr))) count++;
    
    if (i < 7) thisWeek += count;
    else lastWeek += count;
    
    d.setDate(d.getDate() - 1);
  }
  
  return thisWeek - lastWeek;
});
</script>
