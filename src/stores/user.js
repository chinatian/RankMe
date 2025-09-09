import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateUserPhotos } from '@/utils/demoData'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref({
    id: 'demo_user',
    photos: generateUserPhotos(3), // 生成3张模拟照片
    fuel: 50,
    rank: 123,
    needsOnboarding: false,
    badges: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    totalVotes: 150,
    totalMatches: 100,
    wins: 60,
    losses: 40
  })
  const isLoading = ref(false)
  
  // 计算属性
  const hasUser = computed(() => user.value !== null)
  const userPhotos = computed(() => user.value?.photos || [])
  const bestPhoto = computed(() => {
    if (!userPhotos.value.length) return null
    return userPhotos.value.reduce((best, current) => 
      (current.eloScore > best.eloScore) ? current : best
    )
  })
  const userScore = computed(() => bestPhoto.value?.eloScore || 1500)
  const userRating = computed(() => {
    // 将Elo分数转换为1-10分制
    const elo = userScore.value
    if (elo >= 2200) return Math.min(10, 9.5 + (elo - 2200) / 200)
    if (elo >= 2000) return 8.5 + (elo - 2000) / 133.33
    if (elo >= 1800) return 7.5 + (elo - 1800) / 200
    if (elo >= 1600) return 6.5 + (elo - 1600) / 200
    if (elo >= 1400) return 5.5 + (elo - 1400) / 200
    return Math.max(1, 4.5 + (elo - 1200) / 200)
  })
  const userRank = computed(() => user.value?.rank || null)
  const userFuel = computed(() => user.value?.fuel || 0)
  const votesNeeded = computed(() => {
    if (!user.value) return 10
    return Math.max(0, 10 - user.value.totalVotes)
  })
  
  // 用户等级和头衔
  const userLevel = computed(() => {
    const rating = userRating.value
    if (rating >= 9.5) return { level: 'S+', title: '传说级颜值', color: '#FFD700' }
    if (rating >= 9.0) return { level: 'S', title: '大师级颜值', color: '#FF6B6B' }
    if (rating >= 8.5) return { level: 'A+', title: '专家级颜值', color: '#4ECDC4' }
    if (rating >= 8.0) return { level: 'A', title: '优秀颜值', color: '#45B7D1' }
    if (rating >= 7.5) return { level: 'B+', title: '良好颜值', color: '#96CEB4' }
    if (rating >= 7.0) return { level: 'B', title: '中等颜值', color: '#FFEAA7' }
    if (rating >= 6.0) return { level: 'C+', title: '普通颜值', color: '#DDA0DD' }
    if (rating >= 5.0) return { level: 'C', title: '入门颜值', color: '#D63031' }
    return { level: 'D', title: '新手', color: '#74b9ff' }
  })
  
  // 动作
  const initializeUser = () => {
    const userData = localStorage.getItem('yanzhi_user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
  }
  
  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      photos: [{
        id: Date.now().toString(),
        url: userData.photo,
        eloScore: 1500,
        totalVotes: 0,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        uploadedAt: new Date().toISOString()
      }],
      fuel: 50, // 给新用户50点燃料
      rank: null,
      needsOnboarding: false,
      badges: [],
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      ...userData
    }
    
    user.value = newUser
    saveUser()
    return newUser
  }
  
  const updateUser = (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates, lastActiveAt: new Date().toISOString() }
      saveUser()
    }
  }
  
  const addFuel = (amount) => {
    if (user.value) {
      user.value.fuel += amount
      saveUser()
    }
  }
  
  const consumeFuel = (amount) => {
    if (user.value && user.value.fuel >= amount) {
      user.value.fuel -= amount
      saveUser()
      return true
    }
    return false
  }
  
  const updateEloScore = (newScore, won, opponentScore) => {
    if (user.value) {
      const oldScore = user.value.eloScore
      user.value.eloScore = Math.round(newScore)
      user.value.totalMatches += 1
      
      if (won) {
        user.value.wins += 1
      } else {
        user.value.losses += 1
      }
      
      // 检查是否达成新成就
      checkAchievements(oldScore, newScore, won, opponentScore)
      saveUser()
    }
  }
  
  const addVote = () => {
    if (user.value) {
      user.value.totalVotes += 1
      
      // 每获得一次投票，增加燃料
      addFuel(1)
      
      // 检查是否解锁分数查看权限
      if (user.value.totalVotes >= 10 && user.value.needsOnboarding) {
        user.value.needsOnboarding = false
      }
      
      saveUser()
    }
  }
  
  const checkAchievements = (oldScore, newScore, won, opponentScore) => {
    if (!user.value) return
    
    const achievements = []
    
    // 分数里程碑
    const milestones = [1600, 1800, 2000, 2200, 2400]
    milestones.forEach(milestone => {
      if (oldScore < milestone && newScore >= milestone) {
        achievements.push({
          id: `score_${milestone}`,
          title: `突破${milestone}分`,
          description: `Elo分数达到${milestone}分`,
          icon: '🏆',
          color: '#FFD700'
        })
      }
    })
    
    // 连胜成就
    if (won && user.value.currentWinStreak) {
      user.value.currentWinStreak += 1
    } else if (won) {
      user.value.currentWinStreak = 1
    } else {
      user.value.currentWinStreak = 0
    }
    
    const winStreakMilestones = [5, 10, 20, 50]
    winStreakMilestones.forEach(streak => {
      if (user.value.currentWinStreak === streak) {
        achievements.push({
          id: `winstreak_${streak}`,
          title: `连胜${streak}场`,
          description: `连续获胜${streak}场比赛`,
          icon: '🔥',
          color: '#FF6B6B'
        })
      }
    })
    
    // 添加新成就到用户记录
    achievements.forEach(achievement => {
      if (!user.value.badges.find(badge => badge.id === achievement.id)) {
        user.value.badges.push({
          ...achievement,
          earnedAt: new Date().toISOString()
        })
      }
    })
    
    return achievements
  }
  
  const saveUser = () => {
    if (user.value) {
      localStorage.setItem('yanzhi_user', JSON.stringify(user.value))
    }
  }
  
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('yanzhi_user')
  }
  
  const completeOnboarding = () => {
    if (user.value) {
      user.value.needsOnboarding = false
      saveUser()
    }
  }

  // 添加新照片
  const addPhoto = (photoUrl) => {
    if (user.value) {
      const newPhoto = {
        id: Date.now().toString(),
        url: photoUrl,
        eloScore: 1500,
        totalVotes: 0,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        uploadedAt: new Date().toISOString()
      }
      user.value.photos.push(newPhoto)
      saveUser()
      return newPhoto
    }
    return null
  }

  // 更新照片分数
  const updatePhotoEloScore = (photoId, newScore, won, opponentScore) => {
    if (user.value) {
      const photo = user.value.photos.find(p => p.id === photoId)
      if (photo) {
        const oldScore = photo.eloScore
        photo.eloScore = Math.round(newScore)
        photo.totalMatches += 1
        
        if (won) {
          photo.wins += 1
        } else {
          photo.losses += 1
        }
        
        // 检查是否达成新成就
        checkAchievements(oldScore, newScore, won, opponentScore)
        saveUser()
      }
    }
  }

  // 删除照片
  const deletePhoto = (photoId) => {
    if (user.value && user.value.photos.length > 1) {
      user.value.photos = user.value.photos.filter(p => p.id !== photoId)
      saveUser()
      return true
    }
    return false
  }
  
  return {
    // 状态
    user,
    isLoading,
    
    // 计算属性
    hasUser,
    userScore,
    userRating,
    userRank,
    userFuel,
    votesNeeded,
    userLevel,
    userPhotos,
    bestPhoto,
    
    // 动作
    initializeUser,
    createUser,
    updateUser,
    addFuel,
    consumeFuel,
    updateEloScore: updatePhotoEloScore, // 替换为新的照片分数更新方法
    addVote,
    saveUser,
    clearUser,
    completeOnboarding,
    addPhoto,
    deletePhoto
  }
})
