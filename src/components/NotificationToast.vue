<template>
  <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none safe-area-top">
    <div class="p-4">
      <transition-group name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'max-w-sm mx-auto p-4 rounded-xl shadow-2xl backdrop-blur-sm pointer-events-auto',
            'transform transition-all duration-300 cursor-pointer',
            getNotificationStyle(notification.type)
          ]"
          @click="removeNotification(notification.id)"
        >
          <div class="flex items-start space-x-3">
            <!-- 图标 -->
            <div class="flex-shrink-0">
              <div :class="[
                'w-6 h-6 rounded-full flex items-center justify-center',
                getIconContainerStyle(notification.type)
              ]">
                <component :is="getIcon(notification.type)" class="w-4 h-4" />
              </div>
            </div>
            
            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <div v-if="notification.title" class="font-semibold text-sm mb-1">
                {{ notification.title }}
              </div>
              <div class="text-sm opacity-90">
                {{ notification.message }}
              </div>
            </div>
            
            <!-- 关闭按钮 -->
            <button
              @click.stop="removeNotification(notification.id)"
              class="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- 进度条 -->
          <div
            v-if="notification.duration > 0"
            class="absolute bottom-0 left-0 h-1 bg-white/20 rounded-full"
            :style="{ 
              width: '100%',
              animation: `shrink ${notification.duration}ms linear forwards`
            }"
          ></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}

const getNotificationStyle = (type) => {
  const styles = {
    success: 'bg-green-600/90 text-white border border-green-500/50',
    error: 'bg-red-600/90 text-white border border-red-500/50',
    warning: 'bg-yellow-600/90 text-white border border-yellow-500/50',
    info: 'bg-blue-600/90 text-white border border-blue-500/50'
  }
  return styles[type] || styles.info
}

const getIconContainerStyle = (type) => {
  const styles = {
    success: 'bg-green-500/20',
    error: 'bg-red-500/20',
    warning: 'bg-yellow-500/20',
    info: 'bg-blue-500/20'
  }
  return styles[type] || styles.info
}

const getIcon = (type) => {
  const icons = {
    success: 'CheckIcon',
    error: 'ExclamationIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon'
  }
  
  // 返回内联SVG组件
  const iconComponents = {
    CheckIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `
    },
    ExclamationIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      `
    },
    ExclamationTriangleIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.464 4.464l15.072 15.072M19.536 4.464L4.464 19.536"></path>
        </svg>
      `
    },
    InformationCircleIcon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `
    }
  }
  
  return iconComponents[icons[type]] || iconComponents.InformationCircleIcon
}
</script>

<style scoped>
/* 通知动画 */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateY(-100%) scale(0.9);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 进度条动画 */
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .max-w-sm {
    max-width: calc(100vw - 2rem);
  }
}
</style>
