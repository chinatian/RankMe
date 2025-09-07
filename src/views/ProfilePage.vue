<template>
  <div class="min-h-screen bg-gray-900 safe-area-top safe-area-bottom">
    <!-- 顶部导航 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/50 backdrop-blur-sm border-b border-dark-300">
      <div class="flex items-center justify-between">
        <button
          @click="$router.back()"
          class="p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <h1 class="text-xl font-bold text-white">个人中心</h1>
        
        <button
          @click="showSettings = !showSettings"
          class="p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 用户照片和基本信息 -->
      <div class="relative p-6">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-primary/10 rounded-b-3xl"></div>
        
        <div class="relative z-10 text-center">
          <!-- 用户照片 -->
          <div class="relative inline-block mb-4">
            <div class="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
              <img
                v-if="user?.photo"
                :src="user.photo"
                :alt="'用户照片'"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-dark-300 flex items-center justify-center">
                <svg class="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            
            <!-- 等级徽章 -->
            <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-primary rounded-full 
                        flex items-center justify-center border-2 border-gray-900 shadow-lg">
              <span class="text-white font-bold text-sm">{{ userLevel.level }}</span>
            </div>
          </div>
          
          <!-- 等级标题 -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold gradient-text mb-1">{{ userLevel.title }}</h2>
            <p class="text-white/60">加入于 {{ formatDate(user?.createdAt) }}</p>
          </div>
        </div>
      </div>
      
      <!-- 分数展示 -->
      <div class="px-6 mb-6">
        <div class="card p-6">
          <div class="text-center mb-6">
            <div class="score-display mb-2">{{ userRating.toFixed(1) }}</div>
            <p class="text-white/80 mb-4">当前颜值分数</p>
            
            <!-- 分数变化趋势 -->
            <div v-if="user?.eloScore" class="text-sm text-white/60">
              Elo: {{ user.eloScore }} 分
              <span v-if="userRank" class="ml-2">排名: #{{ userRank }}</span>
            </div>
          </div>
          
          <!-- 进度条 -->
          <div v-if="userStore.votesNeeded > 0" class="mb-6">
            <div class="flex items-center justify-between text-sm text-white/70 mb-2">
              <span>解锁分数进度</span>
              <span>{{ 10 - userStore.votesNeeded }}/10</span>
            </div>
            <div class="w-full bg-dark-300 rounded-full h-3">
              <div 
                class="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                :style="{ width: `${((10 - userStore.votesNeeded) / 10) * 100}%` }"
              ></div>
            </div>
            <p class="text-white/60 text-sm mt-2">
              再为他人打分 {{ userStore.votesNeeded }} 次即可查看你的分数
            </p>
          </div>
          
          <!-- 快速操作 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="$router.push('/arena')"
              class="btn-primary flex items-center justify-center space-x-2"
            >
              <span>⚡</span>
              <span>继续打分</span>
            </button>
            
            <button
              @click="$router.push('/leaderboard')"
              class="btn-secondary flex items-center justify-center space-x-2"
            >
              <span>🏆</span>
              <span>查看排名</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 统计数据 -->
      <div class="px-6 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <!-- 燃料 -->
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-yellow-400 mb-1">{{ userFuel }}</div>
            <div class="text-white/60 text-sm">燃料点数</div>
          </div>
          
          <!-- 总投票数 -->
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-blue-400 mb-1">{{ user?.totalVotes || 0 }}</div>
            <div class="text-white/60 text-sm">获得投票</div>
          </div>
          
          <!-- 胜率 -->
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-green-400 mb-1">{{ winRate }}%</div>
            <div class="text-white/60 text-sm">胜率</div>
          </div>
          
          <!-- 总对决 -->
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-purple-400 mb-1">{{ user?.totalMatches || 0 }}</div>
            <div class="text-white/60 text-sm">总对决</div>
          </div>
        </div>
      </div>
      
      <!-- 成就徽章 -->
      <div v-if="user?.badges && user.badges.length > 0" class="px-6 mb-6">
        <div class="card p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <span class="mr-2">🏆</span>
            成就徽章
          </h3>
          
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="badge in user.badges.slice(0, 6)"
              :key="badge.id"
              class="text-center p-3 bg-dark-200/50 rounded-xl"
            >
              <div class="text-2xl mb-1">{{ badge.icon }}</div>
              <div class="text-white/80 text-xs font-medium">{{ badge.title }}</div>
            </div>
            
            <div
              v-if="user.badges.length > 6"
              class="text-center p-3 bg-dark-200/50 rounded-xl flex items-center justify-center"
            >
              <span class="text-white/60 text-sm">+{{ user.badges.length - 6 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分数历史图表 -->
      <div class="px-6 mb-6">
        <div class="card p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <span class="mr-2">📈</span>
            分数变化
          </h3>
          
          <!-- 简单的分数历史显示 -->
          <div class="h-32 flex items-end justify-between space-x-1">
            <div
              v-for="(point, index) in scoreHistory"
              :key="index"
              class="flex-1 bg-gradient-primary/30 rounded-t"
              :style="{ height: `${(point / maxScore) * 100}%` }"
            ></div>
          </div>
          
          <div class="flex justify-between text-white/60 text-xs mt-2">
            <span>7天前</span>
            <span>今天</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="px-6 pb-6 space-y-4">
        <button
          @click="shareProfile"
          class="w-full btn-secondary flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
          <span>分享我的档案</span>
        </button>
        
        <button
          @click="showDeleteConfirm = true"
          class="w-full bg-red-600/20 text-red-400 font-medium py-3 px-6 rounded-xl
                 border border-red-600/30 transition-all hover:bg-red-600/30 active:scale-95"
        >
          删除账户
        </button>
      </div>
    </div>
    
    <!-- 设置面板 -->
    <transition name="slide-up">
      <div v-if="showSettings" class="fixed inset-0 bg-black/50 z-50 flex items-end"
           @click="showSettings = false">
        <div class="w-full bg-dark-100 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
             @click.stop>
          <div class="text-center mb-6">
            <div class="w-8 h-1 bg-dark-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-xl font-bold text-white">设置</h3>
          </div>
          
          <div class="space-y-4">
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>隐私设置</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>通知设置</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>关于我们</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 删除确认对话框 -->
    <transition name="fade">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
           @click="showDeleteConfirm = false">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2">确认删除</h3>
            <p class="text-white/70">
              删除后将无法恢复你的所有数据，包括照片、分数和成就。确定要继续吗？
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 btn-secondary"
            >
              取消
            </button>
            
            <button
              @click="deleteAccount"
              class="flex-1 bg-red-600 text-white font-medium py-3 px-6 rounded-xl
                     transition-all hover:bg-red-700 active:scale-95"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const showSettings = ref(false)
const showDeleteConfirm = ref(false)

// 计算属性
const user = computed(() => userStore.user)
const userRating = computed(() => userStore.userRating)
const userLevel = computed(() => userStore.userLevel)
const userFuel = computed(() => userStore.userFuel)

const winRate = computed(() => {
  if (!user.value || user.value.totalMatches === 0) return 0
  return Math.round((user.value.wins / user.value.totalMatches) * 100)
})

// 生成模拟分数历史
const scoreHistory = computed(() => {
  const baseScore = user.value?.eloScore || 1500
  const history = []
  for (let i = 6; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 100
    history.push(Math.max(1000, baseScore + variation - i * 10))
  }
  return history
})

const maxScore = computed(() => Math.max(...scoreHistory.value))

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 分享档案
const shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: '颜值PK - 我的档案',
      text: `我在颜值PK中的分数是${userRating.value.toFixed(1)}分，快来挑战我吧！`,
      url: window.location.origin
    }).catch(console.error)
  } else {
    // 降级方案：复制链接
    navigator.clipboard.writeText(window.location.origin).then(() => {
      notificationStore.showSuccess('链接已复制到剪贴板')
    }).catch(() => {
      notificationStore.showInfo('请手动复制链接分享')
    })
  }
}

// 删除账户
const deleteAccount = () => {
  userStore.clearUser()
  notificationStore.showInfo('账户已删除')
  router.push('/')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
