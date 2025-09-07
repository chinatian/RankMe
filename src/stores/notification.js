import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  
  const addNotification = (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      title: '',
      message: '',
      duration: 3000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // 自动移除
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  // 便捷方法
  const showSuccess = (message, title = '成功') => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 2000
    })
  }
  
  const showError = (message, title = '错误') => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 4000
    })
  }
  
  const showInfo = (message, title = '提示') => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 3000
    })
  }
  
  const showWarning = (message, title = '警告') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 3000
    })
  }
  
  const showScoreUpdate = (oldScore, newScore, change) => {
    const isIncrease = change > 0
    return addNotification({
      type: isIncrease ? 'success' : 'warning',
      title: isIncrease ? '分数提升！' : '分数下降',
      message: `${oldScore.toFixed(1)} → ${newScore.toFixed(1)} (${change > 0 ? '+' : ''}${change.toFixed(1)})`,
      duration: 3000
    })
  }
  
  const showAchievement = (achievement) => {
    return addNotification({
      type: 'success',
      title: '🎉 新成就解锁！',
      message: `${achievement.icon} ${achievement.title} - ${achievement.description}`,
      duration: 5000
    })
  }
  
  const showFuelReward = (amount) => {
    return addNotification({
      type: 'info',
      title: '⚡ 获得燃料',
      message: `+${amount} 燃料点数`,
      duration: 2000
    })
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showScoreUpdate,
    showAchievement,
    showFuelReward
  }
})
