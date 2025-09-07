<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
    <!-- 404图标 -->
    <div class="text-center mb-8">
      <div class="relative mb-6">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-primary/20 rounded-full blur-3xl"></div>
        
        <!-- 主要图标 -->
        <div class="relative w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <span class="text-6xl">🤔</span>
        </div>
      </div>
      
      <h1 class="text-6xl font-bold gradient-text mb-4">404</h1>
      <h2 class="text-2xl font-bold text-white mb-2">页面不见了</h2>
      <p class="text-white/70 max-w-md leading-relaxed">
        你要找的页面可能已经被移动或删除了，<br>
        不如回到首页继续你的颜值PK之旅吧！
      </p>
    </div>
    
    <!-- 操作按钮 -->
    <div class="space-y-4 w-full max-w-sm">
      <button
        @click="goHome"
        class="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span>回到首页</span>
      </button>
      
      <button
        @click="goBack"
        class="btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>返回上页</span>
      </button>
      
      <!-- 快速导航 -->
      <div class="pt-4">
        <p class="text-white/60 text-center text-sm mb-4">或者试试这些：</p>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="$router.push('/arena')"
            v-if="userStore.hasUser"
            class="btn-secondary text-sm flex items-center justify-center space-x-1"
          >
            <span>⚡</span>
            <span>开始打分</span>
          </button>
          
          <button
            @click="$router.push('/leaderboard')"
            class="btn-secondary text-sm flex items-center justify-center space-x-1"
          >
            <span>🏆</span>
            <span>排行榜</span>
          </button>
          
          <button
            @click="$router.push('/profile')"
            v-if="userStore.hasUser"
            class="btn-secondary text-sm flex items-center justify-center space-x-1"
          >
            <span>👤</span>
            <span>个人中心</span>
          </button>
          
          <button
            @click="$router.push('/upload')"
            v-if="!userStore.hasUser"
            class="btn-secondary text-sm flex items-center justify-center space-x-1"
          >
            <span>📸</span>
            <span>上传照片</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 底部装饰 -->
    <div class="mt-12 text-center">
      <div class="flex items-center justify-center space-x-2 text-white/40">
        <span class="text-2xl">✨</span>
        <span class="text-sm">颜值PK - 发现你的魅力</span>
        <span class="text-2xl">✨</span>
      </div>
    </div>
    
    <!-- 浮动装饰元素 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-400/20 rounded-full animate-float delay-0"></div>
      <div class="absolute top-1/3 right-1/4 w-6 h-6 bg-accent-400/20 rounded-full animate-float delay-1000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-8 h-8 bg-primary-400/10 rounded-full animate-float delay-2000"></div>
      <div class="absolute bottom-1/3 right-1/3 w-5 h-5 bg-accent-400/10 rounded-full animate-float delay-1500"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 回到首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.delay-0 {
  animation-delay: 0s;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-1500 {
  animation-delay: 1.5s;
}

.delay-2000 {
  animation-delay: 2s;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
