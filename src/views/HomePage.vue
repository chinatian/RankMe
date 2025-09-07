<template>
  <div class="min-h-screen bg-gradient-primary flex flex-col justify-center items-center p-6 safe-area-top safe-area-bottom">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
    </div>
    
    <!-- 主要内容 -->
    <div class="relative z-10 text-center max-w-md w-full">
      <!-- Logo和标题 -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-white mb-4 text-shadow">
          颜值PK
        </h1>
        <p class="text-xl text-white/90 text-shadow">
          想知道你的颜值在大家眼中排第几吗？
        </p>
      </div>
      
      <!-- 特性介绍 -->
      <div class="mb-12 space-y-4">
        <div class="glass rounded-2xl p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-lg">⚡</span>
            </div>
            <span class="text-white/90">公平的Elo评分系统</span>
          </div>
        </div>
        
        <div class="glass rounded-2xl p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-lg">🏆</span>
            </div>
            <span class="text-white/90">实时排行榜和成就</span>
          </div>
        </div>
        
        <div class="glass rounded-2xl p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-lg">🔄</span>
            </div>
            <span class="text-white/90">打分赚取曝光机会</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="space-y-4">
        <button
          @click="startJourney"
          class="w-full bg-white text-primary-600 font-bold py-4 px-8 rounded-2xl text-lg
                 shadow-2xl transform transition-all duration-200 active:scale-95 
                 hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">{{ hasUser ? '继续挑战' : '上传照片，开始挑战' }}</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </span>
        </button>
        
        <!-- 如果用户已存在，显示快速进入选项 -->
        <div v-if="hasUser" class="flex space-x-3">
          <button
            @click="$router.push('/arena')"
            class="flex-1 bg-white/10 text-white font-medium py-3 px-6 rounded-xl
                   border border-white/20 transition-all duration-200 hover:bg-white/20 active:scale-95"
          >
            开始打分
          </button>
          
          <button
            @click="$router.push('/profile')"
            class="flex-1 bg-white/10 text-white font-medium py-3 px-6 rounded-xl
                   border border-white/20 transition-all duration-200 hover:bg-white/20 active:scale-95"
          >
            查看分数
          </button>
        </div>
        
        <!-- 排行榜入口 -->
        <button
          @click="$router.push('/leaderboard')"
          class="w-full bg-transparent text-white font-medium py-3 px-6 rounded-xl
                 border border-white/30 transition-all duration-200 hover:bg-white/10 active:scale-95"
        >
          🏆 查看排行榜
        </button>
      </div>
      
      <!-- 底部说明 -->
      <div class="mt-12 text-center">
        <p class="text-white/70 text-sm leading-relaxed">
          匿名、安全、公平<br>
          每一张照片都会经过严格审核
        </p>
      </div>
    </div>
    
    <!-- 版本信息 -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <p class="text-white/50 text-xs">v1.0.0</p>
    </div>
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

const isLoading = ref(false)

const hasUser = computed(() => userStore.hasUser)

const startJourney = async () => {
  isLoading.value = true
  
  try {
    if (hasUser.value) {
      // 已有用户，检查是否需要新手引导
      if (userStore.user.needsOnboarding) {
        router.push('/onboarding')
      } else {
        router.push('/arena')
      }
    } else {
      // 新用户，前往上传页面
      router.push('/upload')
    }
  } catch (error) {
    console.error('启动失败:', error)
    notificationStore.showError('启动失败，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
