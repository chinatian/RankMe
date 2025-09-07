import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { generateDemoUsers } from '@/utils/demoData'

export const useArenaStore = defineStore('arena', () => {
  // 状态
  const currentMatch = ref(null)
  const isVoting = ref(false)
  const todayVotes = ref(0)
  const totalVotesGiven = ref(0)
  const matchHistory = ref([])
  
  // 生成演示数据
  const allUsers = ref([])
  
  // 计算属性
  const canVote = computed(() => {
    const userStore = useUserStore()
    // 用户需要有足够的燃料或者是新手
    return userStore.userFuel > 0 || userStore.votesNeeded > 0
  })
  
  const votesUntilReward = computed(() => {
    // 每投票5次获得奖励
    return 5 - (totalVotesGiven.value % 5)
  })
  
  // Elo评分计算
  const calculateEloChange = (playerScore, opponentScore, won, kFactor = 32) => {
    // 计算期望胜率
    const expectedScore = 1 / (1 + Math.pow(10, (opponentScore - playerScore) / 400))
    
    // 实际得分 (1 = 胜利, 0 = 失败)
    const actualScore = won ? 1 : 0
    
    // 计算分数变化
    const scoreChange = kFactor * (actualScore - expectedScore)
    
    return {
      change: Math.round(scoreChange),
      newScore: playerScore + scoreChange
    }
  }
  
  // 根据Elo分数匹配对手
  const findMatchingOpponents = (userScore, excludeIds = []) => {
    const availableUsers = allUsers.value.filter(user => 
      !excludeIds.includes(user.id)
    )
    
    if (availableUsers.length < 2) return null
    
    // 按分数差距排序，优先选择分数接近的对手
    const sortedUsers = availableUsers.sort((a, b) => {
      const diffA = Math.abs(a.eloScore - userScore)
      const diffB = Math.abs(b.eloScore - userScore)
      return diffA - diffB
    })
    
    // 随机选择前几名中的两个
    const topCandidates = sortedUsers.slice(0, Math.min(6, sortedUsers.length))
    const shuffled = topCandidates.sort(() => Math.random() - 0.5)
    
    return {
      user1: shuffled[0],
      user2: shuffled[1]
    }
  }
  
  // 动作
  const generateMatch = () => {
    const userStore = useUserStore()
    
    if (!canVote.value) {
      return null
    }
    
    // 获取用户最近投票过的用户ID，避免重复
    const recentUserIds = matchHistory.value
      .slice(-10)
      .flatMap(match => [match.user1.id, match.user2.id])
    
    const match = findMatchingOpponents(userStore.userScore, recentUserIds)
    
    if (match) {
      currentMatch.value = {
        ...match,
        id: Date.now().toString(),
        startTime: Date.now()
      }
    }
    
    return currentMatch.value
  }
  
  const vote = async (winnerId) => {
    if (!currentMatch.value || isVoting.value) return
    
    isVoting.value = true
    const userStore = useUserStore()
    
    try {
      const { user1, user2 } = currentMatch.value
      const winner = winnerId === user1.id ? user1 : user2
      const loser = winnerId === user1.id ? user2 : user1
      
      // 计算Elo分数变化
      const winnerEloChange = calculateEloChange(winner.eloScore, loser.eloScore, true)
      const loserEloChange = calculateEloChange(loser.eloScore, winner.eloScore, false)
      
      // 更新用户分数（在实际应用中应该发送到后端）
      winner.eloScore = winnerEloChange.newScore
      loser.eloScore = loserEloChange.newScore
      
      // 如果投票的是当前用户的照片
      if (winner.id === userStore.user?.id) {
        userStore.updateEloScore(winnerEloChange.newScore, true, loser.eloScore)
      } else if (loser.id === userStore.user?.id) {
        userStore.updateEloScore(loserEloChange.newScore, false, winner.eloScore)
      }
      
      // 记录投票
      const voteRecord = {
        id: currentMatch.value.id,
        user1: { ...user1 },
        user2: { ...user2 },
        winnerId,
        timestamp: Date.now(),
        scoreChanges: {
          winner: winnerEloChange.change,
          loser: loserEloChange.change
        }
      }
      
      matchHistory.value.unshift(voteRecord)
      if (matchHistory.value.length > 50) {
        matchHistory.value = matchHistory.value.slice(0, 50)
      }
      
      // 更新统计
      todayVotes.value += 1
      totalVotesGiven.value += 1
      
      // 给用户奖励燃料
      userStore.addFuel(5)
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 清除当前比赛
      currentMatch.value = null
      
      // 保存数据到本地存储
      saveArenaData()
      
      return voteRecord
      
    } catch (error) {
      console.error('投票失败:', error)
      throw error
    } finally {
      isVoting.value = false
    }
  }
  
  const skipMatch = () => {
    if (currentMatch.value && !isVoting.value) {
      currentMatch.value = null
      generateMatch()
    }
  }
  
  const saveArenaData = () => {
    const data = {
      todayVotes: todayVotes.value,
      totalVotesGiven: totalVotesGiven.value,
      matchHistory: matchHistory.value,
      lastSaveDate: new Date().toDateString()
    }
    localStorage.setItem('yanzhi_arena', JSON.stringify(data))
  }
  
  const loadArenaData = () => {
    const data = localStorage.getItem('yanzhi_arena')
    if (data) {
      const parsed = JSON.parse(data)
      
      // 检查是否是新的一天，如果是则重置每日统计
      const today = new Date().toDateString()
      if (parsed.lastSaveDate === today) {
        todayVotes.value = parsed.todayVotes || 0
      } else {
        todayVotes.value = 0
      }
      
      totalVotesGiven.value = parsed.totalVotesGiven || 0
      matchHistory.value = parsed.matchHistory || []
    }
  }
  
  const getVoteStats = () => {
    const today = new Date().toDateString()
    const todayMatches = matchHistory.value.filter(match => 
      new Date(match.timestamp).toDateString() === today
    )
    
    return {
      today: todayMatches.length,
      total: matchHistory.value.length,
      streak: calculateVoteStreak()
    }
  }
  
  const calculateVoteStreak = () => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toDateString()
      
      const dayVotes = matchHistory.value.filter(match => 
        new Date(match.timestamp).toDateString() === dateStr
      ).length
      
      if (dayVotes > 0) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
  
  // 初始化
  loadArenaData()
  
  // 生成演示用户数据
  if (allUsers.value.length === 0) {
    allUsers.value = generateDemoUsers(50)
  }
  
  return {
    // 状态
    currentMatch,
    isVoting,
    todayVotes,
    totalVotesGiven,
    matchHistory,
    allUsers,
    
    // 计算属性
    canVote,
    votesUntilReward,
    
    // 动作
    generateMatch,
    vote,
    skipMatch,
    getVoteStats,
    saveArenaData,
    loadArenaData
  }
})
