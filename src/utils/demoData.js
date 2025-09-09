// 为演示生成虚拟用户数据
export const generateDemoUsers = (count = 20) => {
  const users = []
  
  // 虚拟头像 - 使用 Unsplash 的头像 API
  const getAvatarUrl = (id) => `https://picsum.photos/seed/${id}/400/400?grayscale`
  
  // 虚拟用户名
  const userNames = {
    normal_male: [
      '阳光少年', '酷炫男神', '型男代表', '帅气王子', '运动男孩',
      '文艺青年', '成熟男士', '潮流达人', '活力小伙', '魅力先生'
    ],
    normal_female: [
      '气质美女', '甜美女孩', '清纯少女', '可爱公主', '知性美女',
      '优雅女士', '时尚佳人', '活力女生', '魅力女神', '温柔淑女'
    ],
    celebrity_male: [
      '张艺兴', '王一博', '肖战', '易烊千玺', '蔡徐坤',
      '朱一龙', '白宇', '杨洋', '李现', '王俊凯'
    ],
    celebrity_female: [
      '杨幂', '迪丽热巴', '赵丽颖', '杨颖', '刘亦菲',
      '宋茜', '郑爽', '唐嫣', '杨紫', '关晓彤'
    ],
    ai_male: [
      'AI型男1号', 'AI绅士2号', 'AI帅哥3号', 'AI男神4号', 'AI酷哥5号',
      'AI型男6号', 'AI绅士7号', 'AI帅哥8号', 'AI男神9号', 'AI酷哥10号'
    ],
    ai_female: [
      'AI美女1号', 'AI女神2号', 'AI佳人3号', 'AI淑女4号', 'AI靓女5号',
      'AI美女6号', 'AI女神7号', 'AI佳人8号', 'AI淑女9号', 'AI靓女10号'
    ]
  }
  
  // 分配每个类别的用户数量
  const categoryDistribution = {
    normal_male: Math.floor(count * 0.2),
    normal_female: Math.floor(count * 0.2),
    celebrity_male: Math.floor(count * 0.15),
    celebrity_female: Math.floor(count * 0.15),
    ai_male: Math.floor(count * 0.15),
    ai_female: Math.floor(count * 0.15)
  }
  
  // 确保总数等于count
  let total = Object.values(categoryDistribution).reduce((a, b) => a + b, 0)
  if (total < count) {
    categoryDistribution.normal_female += count - total
  }
  
  // 为每个类别生成用户
  Object.entries(categoryDistribution).forEach(([category, categoryCount]) => {
    const [mainCategory, subCategory] = category.split('_')
    for (let i = 0; i < categoryCount; i++) {
      // 根据类别调整基础分数范围
      let baseScoreRange
      if (mainCategory === 'celebrity') {
        baseScoreRange = [1600, 2400] // 明星分数范围较高
      } else if (mainCategory === 'ai') {
        baseScoreRange = [1400, 2200] // AI分数范围中等
      } else {
        baseScoreRange = [1200, 2000] // 素人分数范围正常
      }
      
      const baseScore = baseScoreRange[0] + Math.random() * (baseScoreRange[1] - baseScoreRange[0])
      const variation = (Math.random() - 0.5) * 200
      const eloScore = Math.max(1000, Math.min(2500, baseScore + variation))
      
      const categoryNames = userNames[category]
      const name = categoryNames[i % categoryNames.length] + 
        (i >= categoryNames.length ? ` ${Math.floor(i / categoryNames.length) + 1}` : '')
      
      users.push({
        id: `demo_${category}_${i + 1}`,
        name,
        photo: getAvatarUrl(`${category}_${i + 1}`),
        mainCategory,
        subCategory,
        eloScore: Math.round(eloScore),
        totalVotes: Math.floor(Math.random() * 500) + 50,
        totalMatches: Math.floor(Math.random() * 200) + 20,
        wins: 0, // 将在后面计算
        losses: 0, // 将在后面计算
        fuel: Math.floor(Math.random() * 100) + 10,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        badges: generateRandomBadges(),
        scoreHistory: generateScoreHistory(eloScore)
      })
    }
  })
  
  // 计算胜负场次
  users.forEach(user => {
    const winRate = 0.3 + (user.eloScore - 1000) / 1500 * 0.4 // 分数越高胜率越高
    user.wins = Math.floor(user.totalMatches * winRate)
    user.losses = user.totalMatches - user.wins
  })
  
  return users
}

// 生成用户照片数据
export const generateUserPhotos = (count = 3) => {
  const photos = []
  
  for (let i = 0; i < count; i++) {
    const baseScore = 1200 + Math.random() * 800 // 1200-2000 基础分数
    const variation = (Math.random() - 0.5) * 200 // 增加一些变化
    const eloScore = Math.max(1000, Math.min(2500, baseScore + variation))
    const totalMatches = Math.floor(Math.random() * 200) + 20
    const winRate = 0.3 + (eloScore - 1000) / 1500 * 0.4
    const wins = Math.floor(totalMatches * winRate)
    
    photos.push({
      id: Date.now().toString() + i,
      url: `https://picsum.photos/seed/user_photo_${i}/400/400?grayscale`,
      eloScore: Math.round(eloScore),
      totalVotes: Math.floor(Math.random() * 500) + 50,
      totalMatches,
      wins,
      losses: totalMatches - wins,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  // 按分数排序，分数最高的照片排在前面
  return photos.sort((a, b) => b.eloScore - a.eloScore)
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
export const generateMatch = (userScore, allUsers, excludeIds = [], category = 'normal_female') => {
  // 根据分类筛选用户
  const availableUsers = allUsers.filter(user => 
    !excludeIds.includes(user.id) &&
    `${user.mainCategory}_${user.subCategory}` === category
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
  
  if (shuffled.length < 2) return null
  
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
