<template>
  <div class="min-h-screen bg-gray-900 flex flex-col safe-area-top safe-area-bottom">
    <!-- 顶部状态栏 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/50 backdrop-blur-sm border-b border-dark-300">
      <div class="flex items-center justify-between">
        <!-- 返回按钮 -->
        <button
          @click="$router.back()"
          class="p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <!-- 状态信息 -->
        <div class="flex items-center space-x-4 text-sm">
          <!-- 燃料显示 -->
          <div class="flex items-center space-x-1 text-yellow-400">
            <span>⚡</span>
            <span>{{ userFuel }}</span>
          </div>
          
          <!-- 今日投票数 -->
          <div class="flex items-center space-x-1 text-blue-400">
            <span>🗳️</span>
            <span>{{ todayVotes }}</span>
          </div>
          
          <!-- 用户菜单 -->
          <button
            @click="$router.push('/profile')"
            class="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center"
          >
            <span class="text-white text-sm font-bold">{{ userLevel.level }}</span>
          </button>
        </div>
      </div>
      
      <!-- 进度条（新手引导） -->
      <div v-if="userStore.votesNeeded > 0" class="mt-3">
        <div class="flex items-center justify-between text-xs text-white/70 mb-1">
          <span>解锁分数进度</span>
          <span>{{ 10 - userStore.votesNeeded }}/10</span>
        </div>
        <div class="w-full bg-dark-300 rounded-full h-2">
          <div 
            class="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: `${((10 - userStore.votesNeeded) / 10) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 比赛区域 -->
      <div v-if="currentMatch && !isLoading" class="flex-1 flex flex-col">
        <!-- VS指示器 -->
        <div class="flex-shrink-0 text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full">
            <span class="text-white font-bold text-lg">VS</span>
          </div>
        </div>
        
        <!-- 照片对决区域 -->
        <div class="flex-1 flex flex-col">
          <!-- 上方照片 -->
          <div class="flex-1 relative" @click="vote(currentMatch.user1.id)">
            <div class="absolute inset-0 m-2">
              <div class="photo-card h-full group cursor-pointer" :class="{ 'voting': isVoting }">
                <img
                  :src="currentMatch.user1.photo"
                  :alt="currentMatch.user1.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                
                <!-- 选择遮罩 -->
                <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- 分数显示 -->
                <div class="absolute top-4 left-4 bg-black/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">{{ formatScore(currentMatch.user1.eloScore) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 中间分割线 -->
          <div class="flex-shrink-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-8"></div>
          
          <!-- 下方照片 -->
          <div class="flex-1 relative" @click="vote(currentMatch.user2.id)">
            <div class="absolute inset-0 m-2">
              <div class="photo-card h-full group cursor-pointer" :class="{ 'voting': isVoting }">
                <img
                  :src="currentMatch.user2.photo"
                  :alt="currentMatch.user2.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                
                <!-- 选择遮罩 -->
                <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- 分数显示 -->
                <div class="absolute top-4 left-4 bg-black/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">{{ formatScore(currentMatch.user2.eloScore) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部操作栏 -->
        <div class="flex-shrink-0 p-4 flex justify-center space-x-4">
          <button
            @click="skipMatch"
            class="btn-secondary"
            :disabled="isVoting"
          >
            跳过
          </button>
          
          <div class="text-center text-white/60 text-sm">
            选择你认为更有魅力的一张
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-white/70">正在准备对决...</p>
        </div>
      </div>
      
      <!-- 无法投票状态 -->
      <div v-else class="flex-1 flex items-center justify-center p-6">
        <div class="text-center max-w-sm">
          <div class="w-20 h-20 bg-dark-200 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span class="text-4xl">⚡</span>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2">燃料不足</h3>
          <p class="text-white/70 mb-6 leading-relaxed">
            你需要更多燃料来参与投票。通过以下方式获得燃料：
          </p>
          
          <div class="space-y-3 mb-6">
            <div class="bg-dark-200 rounded-lg p-3 text-left">
              <div class="flex items-center space-x-2">
                <span class="text-green-400">✓</span>
                <span class="text-white/90">每次被投票 +1 燃料</span>
              </div>
            </div>
            <div class="bg-dark-200 rounded-lg p-3 text-left">
              <div class="flex items-center space-x-2">
                <span class="text-blue-400">ℹ</span>
                <span class="text-white/90">分享给朋友增加曝光</span>
              </div>
            </div>
          </div>
          
          <button
            @click="$router.push('/profile')"
            class="btn-primary w-full"
          >
            查看我的状态
          </button>
        </div>
      </div>
    </div>
    
    <!-- 投票成功动画 -->
    <transition name="vote-success">
      <div v-if="showVoteSuccess" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div class="bg-gradient-primary rounded-2xl p-6 text-center animate-bounce-in">
          <div class="text-4xl mb-2">🎉</div>
          <div class="text-white font-bold text-lg">投票成功！</div>
          <div class="text-white/80">+5 燃料</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArenaStore } from '@/stores/arena'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const userStore = useUserStore()
const arenaStore = useArenaStore()
const notificationStore = useNotificationStore()

const isLoading = ref(true)
const showVoteSuccess = ref(false)

// 计算属性
const currentMatch = computed(() => arenaStore.currentMatch)
const isVoting = computed(() => arenaStore.isVoting)
const userFuel = computed(() => userStore.userFuel)
const userLevel = computed(() => userStore.userLevel)
const todayVotes = computed(() => arenaStore.todayVotes)

// 格式化分数显示
const formatScore = (eloScore) => {
  if (eloScore >= 2200) return `${(9.5 + (eloScore - 2200) / 200).toFixed(1)}★`
  if (eloScore >= 2000) return `${(8.5 + (eloScore - 2000) / 133.33).toFixed(1)}★`
  if (eloScore >= 1800) return `${(7.5 + (eloScore - 1800) / 200).toFixed(1)}★`
  if (eloScore >= 1600) return `${(6.5 + (eloScore - 1600) / 200).toFixed(1)}★`
  if (eloScore >= 1400) return `${(5.5 + (eloScore - 1400) / 200).toFixed(1)}★`
  return `${Math.max(1, 4.5 + (eloScore - 1200) / 200).toFixed(1)}★`
}

// 投票
const vote = async (winnerId) => {
  if (!currentMatch.value || isVoting.value) return
  
  try {
    const result = await arenaStore.vote(winnerId)
    
    // 显示成功动画
    showVoteSuccess.value = true
    setTimeout(() => {
      showVoteSuccess.value = false
    }, 2000)
    
    // 显示分数变化通知
    if (result.scoreChanges) {
      const change = winnerId === currentMatch.value.user1.id 
        ? result.scoreChanges.winner 
        : result.scoreChanges.loser
      
      if (change !== 0) {
        notificationStore.showFuelReward(5)
      }
    }
    
    // 等待一小段时间后生成新比赛
    setTimeout(() => {
      generateNewMatch()
    }, 1500)
    
  } catch (error) {
    console.error('投票失败:', error)
    notificationStore.showError('投票失败，请重试')
  }
}

// 跳过比赛
const skipMatch = () => {
  arenaStore.skipMatch()
  generateNewMatch()
}

// 生成新比赛
const generateNewMatch = () => {
  if (!arenaStore.canVote) {
    return
  }
  
  isLoading.value = true
  
  // 模拟网络延迟
  setTimeout(() => {
    const match = arenaStore.generateMatch()
    isLoading.value = false
    
    if (!match) {
      notificationStore.showError('暂时没有可用的对决，请稍后再试')
    }
  }, 500)
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.jpg'
}

// 初始化
onMounted(() => {
  generateNewMatch()
})

// 监听用户燃料变化
watch(() => userStore.userFuel, (newFuel, oldFuel) => {
  if (newFuel === 0 && oldFuel > 0) {
    notificationStore.showWarning('燃料已用完，需要获得更多燃料才能继续投票')
  }
})

// 键盘快捷键支持
const handleKeyPress = (event) => {
  if (!currentMatch.value || isVoting.value) return
  
  switch (event.key) {
    case '1':
    case 'ArrowUp':
      vote(currentMatch.value.user1.id)
      break
    case '2':  
    case 'ArrowDown':
      vote(currentMatch.value.user2.id)
      break
    case ' ':
    case 'Escape':
      event.preventDefault()
      skipMatch()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.voting {
  pointer-events: none;
  opacity: 0.7;
}

.vote-success-enter-active,
.vote-success-leave-active {
  transition: all 0.5s ease;
}

.vote-success-enter-from,
.vote-success-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 触摸反馈 */
@media (hover: none) {
  .photo-card:active {
    transform: scale(0.98);
  }
}

/* 防止图片拖拽 */
img {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
}</style>
