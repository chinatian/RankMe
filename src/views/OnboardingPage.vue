<template>
  <div class="min-h-screen bg-gray-900 flex flex-col safe-area-top safe-area-bottom">
    <!-- 顶部进度条 -->
    <div class="flex-shrink-0 p-4">
      <div class="w-full bg-dark-300 rounded-full h-2">
        <div 
          class="bg-gradient-primary h-2 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <div class="flex items-center justify-between mt-2 text-sm text-white/60">
        <span>新手引导</span>
        <span>{{ votesGiven }}/{{ votesNeeded }}</span>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 引导信息 -->
      <div class="flex-shrink-0 p-6 text-center">
        <div class="mb-6">
          <div class="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <span class="text-3xl">⚡</span>
          </div>
          
          <h2 class="text-2xl font-bold text-white mb-2">为他人打分</h2>
          <p class="text-white/70 leading-relaxed">
            通过为他人打分来解锁你的颜值分数<br>
            每次投票都能获得燃料，让你的照片获得更多曝光
          </p>
        </div>
        
        <!-- 激励信息 -->
        <div class="bg-gradient-primary/10 rounded-2xl p-4 mb-6">
          <div class="flex items-center justify-center space-x-4 text-sm">
            <div class="text-center">
              <div class="text-yellow-400 font-bold text-lg">+5</div>
              <div class="text-white/60">燃料</div>
            </div>
            <div class="w-px h-8 bg-white/20"></div>
            <div class="text-center">
              <div class="text-blue-400 font-bold text-lg">{{ votesGiven }}</div>
              <div class="text-white/60">已投票</div>
            </div>
            <div class="w-px h-8 bg-white/20"></div>
            <div class="text-center">
              <div class="text-green-400 font-bold text-lg">{{ votesLeft }}</div>
              <div class="text-white/60">剩余</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 比赛区域 -->
      <div v-if="currentMatch && !isLoading" class="flex-1 flex flex-col px-4">
        <!-- VS指示器 -->
        <div class="flex-shrink-0 text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full shadow-lg">
            <span class="text-white font-bold text-lg">VS</span>
          </div>
        </div>
        
        <!-- 照片对决区域 -->
        <div class="flex-1 flex flex-col max-h-[60vh]">
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
                
                <!-- 选择提示 -->
                <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span class="text-white text-2xl">👆</span>
                    </div>
                  </div>
                </div>
                
                <!-- 操作提示 -->
                <div class="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">点击选择</span>
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
                />
                
                <!-- 选择提示 -->
                <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span class="text-white text-2xl">👆</span>
                    </div>
                  </div>
                </div>
                
                <!-- 操作提示 -->
                <div class="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">点击选择</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部操作指引 -->
        <div class="flex-shrink-0 p-4 text-center">
          <p class="text-white/70 text-sm mb-4">选择你认为更有魅力的一张照片</p>
          
          <button
            @click="skipMatch"
            class="btn-secondary text-sm"
            :disabled="isVoting"
          >
            跳过这一轮
          </button>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 animate-spin">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-white/70">准备对决中...</p>
        </div>
      </div>
      
      <!-- 完成引导 -->
      <div v-else-if="isCompleted" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center max-w-sm">
          <div class="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-in">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-white mb-2">🎉 恭喜解锁！</h3>
          <p class="text-white/70 mb-6 leading-relaxed">
            你已完成新手引导，现在可以查看自己的颜值分数了！
          </p>
          
          <!-- 解锁的分数预览 -->
          <div class="bg-gradient-primary/10 rounded-2xl p-6 mb-6">
            <div class="text-center">
              <div class="score-display mb-2">{{ userRating.toFixed(1) }}</div>
              <div class="text-white/80 mb-2">你的颜值分数</div>
              <div class="text-white/60 text-sm">{{ userLevel.title }}</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <button
              @click="viewProfile"
              class="btn-primary w-full"
            >
              查看完整档案
            </button>
            
            <button
              @click="continueRating"
              class="btn-secondary w-full"
            >
              继续为他人打分
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 投票成功动画 -->
    <transition name="vote-success">
      <div v-if="showVoteSuccess" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div class="bg-gradient-primary rounded-2xl p-6 text-center animate-bounce-in">
          <div class="text-4xl mb-2">✨</div>
          <div class="text-white font-bold text-lg">投票成功！</div>
          <div class="text-white/80 text-sm">+5 燃料 | 进度 {{ votesGiven }}/{{ votesNeeded }}</div>
        </div>
      </div>
    </transition>
    
    <!-- 激励弹窗 -->
    <transition name="modal">
      <div v-if="showEncouragement" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
           @click="showEncouragement = false">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full text-center" @click.stop>
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🔥</span>
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2">干得漂亮！</h3>
          <p class="text-white/70 mb-6">
            {{ encouragementMessage }}
          </p>
          
          <button
            @click="showEncouragement = false"
            class="btn-primary w-full"
          >
            继续
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArenaStore } from '@/stores/arena'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const userStore = useUserStore()
const arenaStore = useArenaStore()
const notificationStore = useNotificationStore()

// 状态
const votesNeeded = 10
const votesGiven = ref(0)
const isLoading = ref(true)
const isVoting = ref(false)
const isCompleted = ref(false)
const showVoteSuccess = ref(false)
const showEncouragement = ref(false)
const encouragementMessage = ref('')

// 计算属性
const currentMatch = computed(() => arenaStore.currentMatch)
const progress = computed(() => (votesGiven.value / votesNeeded) * 100)
const votesLeft = computed(() => votesNeeded - votesGiven.value)
const userRating = computed(() => userStore.userRating)
const userLevel = computed(() => userStore.userLevel)

// 激励消息列表
const encouragementMessages = [
  '你的判断很准确！',
  '继续保持这个节奏！',
  '你为社区做出了贡献！',
  '每一票都很重要！',
  '你的眼光很独特！',
  '越来越熟练了！',
  '快要达成目标了！',
  '你的参与很有价值！'
]

// 投票
const vote = async (winnerId) => {
  if (!currentMatch.value || isVoting.value) return
  
  isVoting.value = true
  
  try {
    await arenaStore.vote(winnerId)
    
    votesGiven.value += 1
    
    // 显示成功动画
    showVoteSuccess.value = true
    setTimeout(() => {
      showVoteSuccess.value = false
    }, 2000)
    
    // 检查是否完成
    if (votesGiven.value >= votesNeeded) {
      setTimeout(() => {
        completeOnboarding()
      }, 2000)
    } else {
      // 显示激励信息
      if (votesGiven.value % 3 === 0 || votesGiven.value === votesNeeded - 1) {
        setTimeout(() => {
          showEncourageMessage()
        }, 1500)
      }
      
      // 生成新比赛
      setTimeout(() => {
        generateNewMatch()
      }, 2000)
    }
    
  } catch (error) {
    console.error('投票失败:', error)
    notificationStore.showError('投票失败，请重试')
  } finally {
    isVoting.value = false
  }
}

// 跳过比赛
const skipMatch = () => {
  if (isVoting.value) return
  arenaStore.skipMatch()
  generateNewMatch()
}

// 显示激励消息
const showEncourageMessage = () => {
  const messages = [
    ...encouragementMessages,
    `还差${votesLeft.value}票就能解锁分数了！`,
    `你已经为${votesGiven.value}位用户投票了！`
  ]
  
  encouragementMessage.value = messages[Math.floor(Math.random() * messages.length)]
  showEncouragement.value = true
}

// 生成新比赛
const generateNewMatch = () => {
  isLoading.value = true
  
  setTimeout(() => {
    const match = arenaStore.generateMatch()
    isLoading.value = false
    
    if (!match) {
      notificationStore.showError('暂时没有可用的对决')
    }
  }, 500)
}

// 完成新手引导
const completeOnboarding = () => {
  isCompleted.value = true
  userStore.completeOnboarding()
  
  // 添加完成成就
  const completionBadge = {
    id: 'onboarding_complete',
    title: '新手毕业',
    description: '完成新手引导',
    icon: '🎓',
    color: '#4ECDC4',
    earnedAt: new Date().toISOString()
  }
  
  if (userStore.user && !userStore.user.badges.find(b => b.id === 'onboarding_complete')) {
    userStore.user.badges.push(completionBadge)
    userStore.saveUser()
  }
}

// 查看档案
const viewProfile = () => {
  router.push('/profile')
}

// 继续打分
const continueRating = () => {
  router.push('/arena')
}

// 处理图片错误
const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.jpg'
}

// 监听用户引导状态
watch(() => userStore.user?.needsOnboarding, (needsOnboarding) => {
  if (needsOnboarding === false && !isCompleted.value) {
    // 如果用户已经完成引导但页面状态未更新
    completeOnboarding()
  }
})

// 初始化
onMounted(() => {
  // 如果用户已经完成引导
  if (!userStore.user?.needsOnboarding) {
    isCompleted.value = true
    isLoading.value = false
    return
  }
  
  // 初始化投票计数
  const existingVotes = userStore.user?.totalVotes || 0
  votesGiven.value = Math.min(existingVotes, votesNeeded)
  
  if (votesGiven.value >= votesNeeded) {
    completeOnboarding()
    isLoading.value = false
  } else {
    generateNewMatch()
  }
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 脉冲发光动画 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(138, 43, 226, 0.8);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>
