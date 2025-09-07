<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <!-- 全屏路由视图 -->
    <router-view v-slot="{ Component, route }">
      <transition
        :name="route.meta.transition || 'fade'"
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    
    <!-- 全局通知组件 -->
    <NotificationToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import NotificationToast from '@/components/NotificationToast.vue'

const userStore = useUserStore()

onMounted(() => {
  // 初始化用户数据
  userStore.initializeUser()
  
  // 设置PWA相关
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
  
  // 防止页面刷新时的滚动恢复
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual'
  }
})
</script>

<style>
/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(-100%);
}
</style>
