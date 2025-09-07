// 为演示生成虚拟用户数据
export const generateDemoUsers = (count = 20) => {
  const users = []
  
  // 虚拟头像 - 使用 Unsplash 的头像 API
  const getAvatarUrl = (id) => `https://picsum.photos/seed/${id}/400/400?grayscale`
  
  // 虚拟用户名
  const userNames = [
    '神秘用户', '颜值高手', '魅力达人', '气质美女', '帅气小哥',
    '阳光少年', '甜美女孩', '酷炫男神', '清纯少女', '时尚潮人',
    '温柔女神', '型男代表', '可爱公主', '帅气王子', '知性美女',
    '运动男孩', '文艺青年', '活力女生', '成熟男士', '优雅女士'
  ]
  
  for (let i = 0; i < count; i++) {
    const baseScore = 1200 + Math.random() * 800 // 1200-2000 基础分数
    const variation = (Math.random() - 0.5) * 200 // 增加一些变化
    const eloScore = Math.max(1000, Math.min(2500, baseScore + variation))
    
    users.push({
      id: `demo_${i + 1}`,
      name: userNames[i % userNames.length] + (i > 19 ? ` ${Math.floor(i / 20) + 1}` : ''),
      photo: getAvatarUrl(`user${i + 1}`),
      eloScore: Math.round(eloScore),
      totalVotes: Math.floor(Math.random() * 500) + 50,
      totalMatches: Math.floor(Math.random() * 200) + 20,
      wins: 0, // 将在后面计算
      losses: 0, // 将在后面计算
      fuel: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      badges: generateRandomBadges(),
      scoreHistory: generateScoreHistory(eloScore)
    })
  }
  
  // 计算胜负场次
  users.forEach(user => {
    const winRate = 0.3 + (user.eloScore - 1000) / 1500 * 0.4 // 分数越高胜率越高
    user.wins = Math.floor(user.totalMatches * winRate)
    user.losses = user.totalMatches - user.wins
  })
  
  return users
}

// 生成随机徽章
const generateRandomBadges = () => {
  const allBadges = [
    { id: 'first_win', title: '首胜', description: '获得第一次胜利', icon: '🎉', color: '#4ECDC4' },
    { id: 'streak_5', title: '连胜5场', description: '连续获胜5场比赛', icon: '🔥', color: '#FF6B6B' },
    { id: 'popular', title: '人气王', description: '获得100次投票', icon: '⭐', color: '#FFD700' },
    { id: 'active', title: '活跃用户', description: '连续7天投票', icon: '💪', color: '#45B7D1' },
    { id: 'expert', title: '评分专家', description: '为他人投票500次', icon: '🎯', color: '#96CEB4' },
    { id: 'newcomer', title: '新人', description: '新加入的用户', icon: '🌟', color: '#FFEAA7' }
  ]
  
  const badges = []
  const badgeCount = Math.floor(Math.random() * 4) // 0-3个徽章
  
  for (let i = 0; i < badgeCount; i++) {
    const randomBadge = allBadges[Math.floor(Math.random() * allBadges.length)]
    if (!badges.find(b => b.id === randomBadge.id)) {
      badges.push({
        ...randomBadge,
        earnedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
      })
    }
  }
  
  return badges
}

// 生成分数历史
const generateScoreHistory = (currentScore) => {
  const history = []
  let score = currentScore - 100 + Math.random() * 200
  
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * 50
    score = Math.max(1000, Math.min(2500, score + change))
    history.push(Math.round(score))
  }
  
  return history
}

// 获取等级信息
export const getLevelInfo = (eloScore) => {
  if (eloScore >= 2200) return { level: 'S+', title: '传说级颜值', color: '#FFD700', minScore: 2200 }
  if (eloScore >= 2000) return { level: 'S', title: '大师级颜值', color: '#FF6B6B', minScore: 2000 }
  if (eloScore >= 1800) return { level: 'A+', title: '专家级颜值', color: '#4ECDC4', minScore: 1800 }
  if (eloScore >= 1600) return { level: 'A', title: '优秀颜值', color: '#45B7D1', minScore: 1600 }
  if (eloScore >= 1400) return { level: 'B+', title: '良好颜值', color: '#96CEB4', minScore: 1400 }
  if (eloScore >= 1200) return { level: 'B', title: '中等颜值', color: '#FFEAA7', minScore: 1200 }
  if (eloScore >= 1000) return { level: 'C+', title: '普通颜值', color: '#DDA0DD', minScore: 1000 }
  return { level: 'C', title: '新手', color: '#D63031', minScore: 0 }
}

// 将Elo分数转换为1-10分制
export const eloToRating = (eloScore) => {
  if (eloScore >= 2200) return Math.min(10, 9.5 + (eloScore - 2200) / 200)
  if (eloScore >= 2000) return 8.5 + (eloScore - 2000) / 133.33
  if (eloScore >= 1800) return 7.5 + (eloScore - 1800) / 200
  if (eloScore >= 1600) return 6.5 + (eloScore - 1600) / 200
  if (eloScore >= 1400) return 5.5 + (eloScore - 1400) / 200
  return Math.max(1, 4.5 + (eloScore - 1200) / 200)
}

// 计算Elo分数变化
export const calculateEloChange = (playerScore, opponentScore, won, kFactor = 32) => {
  // 计算期望胜率
  const expectedScore = 1 / (1 + Math.pow(10, (opponentScore - playerScore) / 400))
  
  // 实际得分 (1 = 胜利, 0 = 失败)
  const actualScore = won ? 1 : 0
  
  // 计算分数变化
  const scoreChange = kFactor * (actualScore - expectedScore)
  
  return {
    change: Math.round(scoreChange),
    newScore: Math.round(playerScore + scoreChange),
    expectedWinRate: expectedScore
  }
}

// 生成比赛匹配
export const generateMatch = (userScore, allUsers, excludeIds = []) => {
  const availableUsers = allUsers.filter(user => 
    !excludeIds.includes(user.id)
  )
  
  if (availableUsers.length < 2) return null
  
  // 按分数差距排序，优先选择分数接近的对手
  const sortedUsers = availableUsers.sort((a, b) => {
    const diffA = Math.abs(a.eloScore - userScore)
    const diffB = Math.abs(b.eloScore - userScore)
    return diffA - diffB
  })
  
  // 随机选择前几名中的两个，增加一些随机性
  const topCandidates = sortedUsers.slice(0, Math.min(8, sortedUsers.length))
  const shuffled = topCandidates.sort(() => Math.random() - 0.5)
  
  return {
    user1: shuffled[0],
    user2: shuffled[1],
    matchId: Date.now().toString(),
    timestamp: Date.now()
  }
}

// 模拟网络延迟
export const simulateNetworkDelay = (min = 300, max = 1000) => {
  const delay = min + Math.random() * (max - min)
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 生成随机的分数变化趋势
export const generateTrendData = (currentScore, days = 7) => {
  const data = []
  let score = currentScore - 50 + Math.random() * 100
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const change = (Math.random() - 0.5) * 30
    score = Math.max(1000, Math.min(2500, score + change))
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score),
      change: i === days - 1 ? 0 : Math.round(change)
    })
  }
  
  return data
}
