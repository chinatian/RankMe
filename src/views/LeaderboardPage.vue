<template>
  <div class="min-h-screen bg-gray-900 safe-area-top safe-area-bottom">
    <!-- 顶部导航 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/50 backdrop-blur-sm border-b border-dark-300">
      <div class="flex items-center justify-between  mx-auto">
        <button
          @click="$router.back()"
          class="p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <h1 class="text-xl font-bold text-white">排行榜</h1>
        
        <button
          @click="refreshLeaderboard"
          class="p-2 text-white/70 hover:text-white transition-colors"
          :class="{ 'animate-spin': isRefreshing }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 内容区域包装器 -->
    <div class="max-w-[750px] mx-auto">
      <!-- 筛选标签 -->
      <div class="flex-shrink-0 p-4">
        <div class="space-y-3">
          <!-- 父标签 -->
          <div class="flex space-x-2 overflow-x-auto no-scrollbar justify-center">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeParentTab = tab.key; activeChildTab = tab.children[0].key"
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all',
                activeParentTab === tab.key 
                  ? 'bg-gradient-primary text-white shadow-lg' 
                  : 'bg-dark-200 text-white/70 hover:bg-dark-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <!-- 子标签 -->
          <div class="flex space-x-2 overflow-x-auto no-scrollbar justify-center">
            <button
              v-for="childTab in tabs.find(t => t.key === activeParentTab).children"
              :key="childTab.key"
              @click="activeChildTab = childTab.key"
              :class="[
                'flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeChildTab === childTab.key 
                  ? 'bg-primary-400/20 text-primary-400' 
                  : 'bg-dark-200/50 text-white/50 hover:bg-dark-300/50'
              ]"
            >
              {{ childTab.label }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 榜首展示 -->
      <div v-if="topThree.length > 0" class="px-6 mb-6">
        <div class="relative">
          <!-- 背景装饰 -->
          <div class="absolute inset-0 bg-gradient-primary/10 rounded-3xl"></div>
          
          <div class="relative z-10 p-6">
            <h2 class="text-xl font-bold text-white text-center mb-6">👑 巅峰三甲</h2>
            
            <div class="flex items-end justify-center space-x-4">
              <!-- 第二名 -->
              <div v-if="topThree[1]" class="text-center">
                <div class="relative mb-3">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-xl ring-2 ring-silver">
                    <img :src="topThree[1].photo" :alt="topThree[1].name" class="w-full h-full object-cover" />
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-silver rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">2</span>
                  </div>
                </div>
                <div class="text-silver text-lg font-bold">{{ formatScore(topThree[1].eloScore) }}</div>
                <div class="text-white/60 text-sm">{{ topThree[1].name }}</div>
              </div>
              
              <!-- 第一名 -->
              <div v-if="topThree[0]" class="text-center transform scale-110">
                <div class="relative mb-3">
                  <div class="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-yellow-400">
                    <img :src="topThree[0].photo" :alt="topThree[0].name" class="w-full h-full object-cover" />
                  </div>
                  <div class="absolute -top-3 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span class="text-yellow-900 text-sm font-bold">1</span>
                  </div>
                  <!-- 皇冠 -->
                  <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span class="text-2xl">👑</span>
                  </div>
                </div>
                <div class="text-yellow-400 text-xl font-bold">{{ formatScore(topThree[0].eloScore) }}</div>
                <div class="text-white/80 text-sm font-medium">{{ topThree[0].name }}</div>
              </div>
              
              <!-- 第三名 -->
              <div v-if="topThree[2]" class="text-center">
                <div class="relative mb-3">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-xl ring-2 ring-orange-400">
                    <img :src="topThree[2].photo" :alt="topThree[2].name" class="w-full h-full object-cover" />
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">3</span>
                  </div>
                </div>
                <div class="text-orange-400 text-lg font-bold">{{ formatScore(topThree[2].eloScore) }}</div>
                <div class="text-white/60 text-sm">{{ topThree[2].name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户当前排名 -->
      <div v-if="userStore.hasUser && userRank" class="px-6 mb-6">
        <div class="card p-4">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img
                v-if="userStore.user?.photo"
                :src="userStore.user.photo"
                alt="我的照片"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white font-bold">我的排名</div>
                  <div class="text-white/60 text-sm">{{ userStore.userLevel.title }}</div>
                </div>
                
                <div class="text-right">
                  <div class="text-2xl font-bold gradient-text">#{{ userRank }}</div>
                  <div class="text-white/80 text-sm">{{ userStore.userRating.toFixed(1) }} 分</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 排行榜列表 -->
      <div class="flex-1 px-6 pb-6">
        <div class="card">
          <!-- 列表头部 -->
          <div class="p-4 border-b border-dark-300">
            <div class="flex items-center justify-between text-white/60 text-sm">
              <span>用户</span>
              <span>分数</span>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="isLoading" class="p-8 text-center">
            <div class="w-8 h-8 bg-gradient-primary rounded-full mx-auto mb-4 animate-spin flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-white/70">加载排行榜中...</p>
          </div>
          
          <!-- 排行榜条目 -->
          <div v-else class="divide-y divide-dark-300">
            <div
              v-for="(user, index) in displayedUsers"
              :key="user.id"
              class="p-4 flex items-center space-x-4 hover:bg-dark-200/50 transition-colors"
              :class="{ 'bg-gradient-primary/10': isCurrentUser(user) }"
            >
              <!-- 排名 -->
              <div class="w-8 text-center">
                <span
                  v-if="getRankNumber(index) <= 3"
                  class="text-lg"
                >
                  {{ getRankEmoji(getRankNumber(index)) }}
                </span>
                <span
                  v-else
                  :class="[
                    'text-sm font-bold',
                    isCurrentUser(user) ? 'text-white' : 'text-white/60'
                  ]"
                >
                  #{{ getRankNumber(index) }}
                </span>
              </div>
              
              <!-- 用户头像 -->
              <div class="w-12 h-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  :src="user.photo"
                  :alt="user.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              
              <!-- 用户信息 -->
              <div class="flex-1 min-w-0">
                <div
                  :class="[
                    'font-medium truncate',
                    isCurrentUser(user) ? 'text-white' : 'text-white/90'
                  ]"
                >
                  {{ user.name }}
                  <span v-if="isCurrentUser(user)" class="text-primary-400 ml-2">(我)</span>
                </div>
                <div class="text-white/60 text-sm">
                  {{ getUserLevel(user.eloScore).title }}
                </div>
              </div>
              
              <!-- 分数和变化 -->
              <div class="text-right flex-shrink-0">
                <div
                  :class="[
                    'text-lg font-bold',
                    isCurrentUser(user) ? 'gradient-text' : 'text-white'
                  ]"
                >
                  {{ formatScore(user.eloScore) }}
                </div>
                
                <!-- 分数变化趋势 -->
                <div class="flex items-center justify-end space-x-1 text-xs">
                  <span
                    v-if="user.scoreChange !== undefined"
                    :class="[
                      'flex items-center',
                      user.scoreChange > 0 ? 'text-green-400' : 
                      user.scoreChange < 0 ? 'text-red-400' : 'text-white/60'
                    ]"
                  >
                    <svg
                      v-if="user.scoreChange !== 0"
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="user.scoreChange > 0"
                        d="M7 14l5-5 5 5H7z"
                      />
                      <path
                        v-else
                        d="M7 10l5 5 5-5H7z"
                      />
                    </svg>
                    {{ user.scoreChange > 0 ? '+' : '' }}{{ user.scoreChange }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 加载更多 -->
            <div v-if="hasMore" class="p-4 text-center">
              <button
                @click="loadMore"
                class="btn-secondary"
                :disabled="isLoadingMore"
              >
                <span v-if="!isLoadingMore">加载更多</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  加载中...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArenaStore } from '@/stores/arena'

const router = useRouter()
const userStore = useUserStore()
const arenaStore = useArenaStore()

// 状态
const activeParentTab = ref('female')
const activeChildTab = ref('all_total')
const isLoading = ref(true)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const pageSize = 20

// 标签配置
const tabs = [
  
  { 
    key: 'male',
    label: '男生',
    children: [
      { key: 'male_total', label: '总榜' },
      { key: 'male_daily', label: '日榜' },
      { key: 'male_weekly', label: '周榜' }
    ]
  },
  { 
    key: 'female',
    label: '女生',
    children: [
      { key: 'female_total', label: '总榜' },
      { key: 'female_daily', label: '日榜' },
      { key: 'female_weekly', label: '周榜' }
    ]
  }
]

// 模拟排行榜数据
const allLeaderboardData = ref([])

// 计算属性
const sortedUsers = computed(() => {
  let users = [...arenaStore.allUsers]
  
  // 首先按性别筛选
  if (activeParentTab.value === 'male') {
    users = users.filter((_, index) => index % 2 === 0)
  } else if (activeParentTab.value === 'female') {
    users = users.filter((_, index) => index % 2 === 1)
  }
  
  // 然后按时间维度筛选和排序
  const timeFilter = activeChildTab.value.split('_')[1]
  switch (timeFilter) {
    case 'daily':
      users = users.map(user => ({
        ...user,
        dailyScore: user.eloScore + (Math.random() - 0.5) * 100,
        scoreChange: Math.floor((Math.random() - 0.5) * 50)
      })).sort((a, b) => b.dailyScore - a.dailyScore)
      break
      
    case 'weekly':
      users = users.map(user => ({
        ...user,
        weeklyScore: user.eloScore + (Math.random() - 0.5) * 150,
        scoreChange: Math.floor((Math.random() - 0.5) * 80)
      })).sort((a, b) => b.weeklyScore - a.weeklyScore)
      break
      
    default:
      // 总榜
      users = users.sort((a, b) => b.eloScore - a.eloScore)
      break
  }
  
  return users
})

const displayedUsers = computed(() => {
  return sortedUsers.value.slice(0, currentPage.value * pageSize)
})

const topThree = computed(() => {
  return sortedUsers.value.slice(0, 3)
})

const hasMore = computed(() => {
  return displayedUsers.value.length < sortedUsers.value.length
})

const userRank = computed(() => {
  if (!userStore.hasUser) return null
  
  const userIndex = sortedUsers.value.findIndex(user => 
    user.id === userStore.user?.id
  )
  
  return userIndex !== -1 ? userIndex + 1 : null
})

// 方法
const formatScore = (eloScore) => {
  if (eloScore >= 2200) return `${(9.5 + (eloScore - 2200) / 200).toFixed(1)}`
  if (eloScore >= 2000) return `${(8.5 + (eloScore - 2000) / 133.33).toFixed(1)}`
  if (eloScore >= 1800) return `${(7.5 + (eloScore - 1800) / 200).toFixed(1)}`
  if (eloScore >= 1600) return `${(6.5 + (eloScore - 1600) / 200).toFixed(1)}`
  if (eloScore >= 1400) return `${(5.5 + (eloScore - 1400) / 200).toFixed(1)}`
  return `${Math.max(1, 4.5 + (eloScore - 1200) / 200).toFixed(1)}`
}

const getUserLevel = (eloScore) => {
  const rating = parseFloat(formatScore(eloScore))
  if (rating >= 9.5) return { level: 'S+', title: '传说级颜值', color: '#FFD700' }
  if (rating >= 9.0) return { level: 'S', title: '大师级颜值', color: '#FF6B6B' }
  if (rating >= 8.5) return { level: 'A+', title: '专家级颜值', color: '#4ECDC4' }
  if (rating >= 8.0) return { level: 'A', title: '优秀颜值', color: '#45B7D1' }
  if (rating >= 7.5) return { level: 'B+', title: '良好颜值', color: '#96CEB4' }
  if (rating >= 7.0) return { level: 'B', title: '中等颜值', color: '#FFEAA7' }
  if (rating >= 6.0) return { level: 'C+', title: '普通颜值', color: '#DDA0DD' }
  if (rating >= 5.0) return { level: 'C', title: '入门颜值', color: '#D63031' }
  return { level: 'D', title: '新手', color: '#74b9ff' }
}

const getRankNumber = (index) => {
  return index + 1
}

const getRankEmoji = (rank) => {
  switch (rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return rank.toString()
  }
}

const isCurrentUser = (user) => {
  return userStore.hasUser && user.id === userStore.user?.id
}

const refreshLeaderboard = async () => {
  isRefreshing.value = true
  
  // 模拟刷新延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 重置分页
  currentPage.value = 1
  
  isRefreshing.value = false
}

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  
  isLoadingMore.value = true
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentPage.value += 1
  isLoadingMore.value = false
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.jpg'
}

// 监听标签变化
watch([activeParentTab, activeChildTab], () => {
  currentPage.value = 1
})

// 初始化
onMounted(async () => {
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
})
</script>

<style scoped>
/* 银色 */
.ring-silver {
  --tw-ring-color: #C0C0C0;
}

.text-silver {
  color: #C0C0C0;
}

.bg-silver {
  background-color: #C0C0C0;
}

/* 榜首动画 */
@keyframes crown-float {
  0%, 100% { transform: translateY(0px) translateX(-50%); }
  50% { transform: translateY(-3px) translateX(-50%); }
}

.crown-animation {
  animation: crown-float 2s ease-in-out infinite;
}

/* 滚动优化 */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
