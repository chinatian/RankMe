<template>
  <div class="min-h-screen bg-gray-900 flex flex-col safe-area-top safe-area-bottom">
    <!-- 顶部状态栏 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/50 backdrop-blur-sm border-b border-dark-300">
      <div class="flex items-center justify-between">
        <!-- 返回按钮 -->
       
        <!-- <button
          @click="$router.back()"
          class="p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button> -->

        <!-- 品牌词 -->
        <div class="">
          <h1 class="text-white font-bold text-lg">比比谁更美</h1>
        </div>
        
        <!-- 状态信息 -->
        <div class="flex items-center space-x-4 text-sm">
         
          
         

          <!-- 排行榜按钮 -->
          <button
            @click="$router.push('/leaderboard')" 
            class="flex items-center space-x-1 text-purple-400"
          >
            <span>🏆</span>
            <span>排行榜</span>
          </button>

          <button
            @click="$router.push('/profile')"
            class="px-4 py-2 bg-gradient-primary rounded-full flex items-center justify-center space-x-1.5
                   shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200
                   active:scale-95 hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-white text-sm font-bold">颜值打分</span>
          </button>
          
         
        </div>
      </div>
      
      <!-- 进度条（新手引导） -->
      <div v-if="userStore.votesNeeded > 0 && false" class="mt-3">
        <div class="flex items-center justify-between text-xs text-white/70 mb-1">
          <span>解锁分数进度</span>
          <span>{{ 10 - userStore.votesNeeded }}/10</span>
        </div>
        <div class="w-full bg-dark-300 rounded-full h-2">
          <div 
            class="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: `${((10 - userStore.votesNeeded) / 10) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex flex-col h-full items-center justify-center">

      <!-- 专场选择 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/30">
      <div class="flex justify-center">
        <div class="flex space-x-2 overflow-visible pb-2 max-w-md relative">
          <!-- 默认显示当前分类 -->
          <div class="flex items-center space-x-2 relative">
            <button
              class="px-4 py-2 rounded-full text-sm font-medium bg-dark-200 text-white"
            >
              {{ currentCategoryDisplay }}
            </button>
            
            <!-- 更多按钮 -->
            <button
              @click="toggleCategoryDropdown"
              class="px-3 py-2 rounded-full text-sm font-medium bg-dark-200 text-white/70 hover:text-white category-trigger"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>

            <!-- 分类下拉菜单 -->
            <div
              v-show="showCategoryDropdown"
              class="absolute top-full left-0 mt-2 w-64 bg-dark-100/95 rounded-xl shadow-lg shadow-black/50 backdrop-blur-lg z-50 category-dropdown"
              style="min-width: 240px;"
            >
              <div class="py-2">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="mb-2 last:mb-0"
                >
                  <!-- 主分类 -->
                  <div 
                    class="px-4 py-2 text-white font-medium text-sm border-b border-white/10 "
                  >
                    {{ category.name }}
                  </div>
                  <!-- 子分类 -->
                  <div class="py-1">
                    <button
                      v-for="subCategory in category.subcategories"
                      :key="subCategory.id"
                      @click="selectCategory(category.id, subCategory.id)"
                      class="w-full px-6 py-2 text-left text-sm transition-colors duration-200 flex items-center space-x-2"
                      :class="[
                        currentMainCategory === category.id && currentSubCategory === subCategory.id
                          ? 'bg-gradient-primary text-white'
                          : 'text-white/70 hover:text-white hover:bg-dark-200/50'
                      ]"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="[
                        currentMainCategory === category.id && currentSubCategory === subCategory.id
                          ? 'bg-white'
                          : 'bg-white/50'
                      ]"></span>
                      <span>{{ subCategory.name }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- 比赛区域 -->
      <div v-if="currentMatch && !isLoading" class=" flex flex-col">
        <!-- 照片对决区域 -->
        <div class="flex-1 flex flex-col md:flex-row items-center justify-center relative p-2 md:p-4">
          <!-- 上方/左侧照片 -->
          <div 
            class="w-[80vw] md:w-[400px] aspect-square relative" 
            
          >
            <div class="absolute inset-0 m-2">
              <div class="photo-card h-full group relative">
                <img
                  :src="currentMatch.user1.photo"
                  :alt="currentMatch.user1.name"
                  class="w-full h-full object-cover rounded-2xl"
                  @error="handleImageError"
                />
                
                <!-- 投诉按钮 - 从点击区域中分离出来 -->
                <div class="absolute top-4 right-4 z-10">
                  <button
                    @click.stop="openReportDialog(currentMatch.user1.id)"
                    class="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm
                           hover:bg-black/70 transition-colors"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                </div>
                
                <!-- 投票点击区域 - 独立的层 -->
                <div 
                  class="absolute inset-0 cursor-pointer"
                  @click="vote(currentMatch.user1.id)"
                >
                  <!-- 选择遮罩 -->
                  <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center rounded-2xl">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 分数显示 -->
                <div class="absolute top-4 left-4 bg-black/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">{{ formatScore(currentMatch.user1.eloScore) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- VS指示器 -->
          <div class="flex-shrink-0 mx-4 md:mx-8 my-2 md:my-4">
            <div class="w-10 h-10 md:w-16 md:h-16 bg-dark-200 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-base md:text-lg">VS</span>
            </div>
          </div>
          
          <!-- 下方/右侧照片 -->
          <div 
            class="w-[80vw] md:w-[400px] aspect-square relative" 
            
          >
            <div class="absolute inset-0 m-2">
              <div class="photo-card h-full group relative">
                <img
                  :src="currentMatch.user2.photo"
                  :alt="currentMatch.user2.name"
                  class="w-full h-full object-cover rounded-2xl"
                  @error="handleImageError"
                />
                
                <!-- 投诉按钮 - 从点击区域中分离出来 -->
                <div class="absolute top-4 right-4 z-10">
                  <button
                    @click.stop="openReportDialog(currentMatch.user2.id)"
                    class="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm
                           hover:bg-black/70 transition-colors"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                </div>
                
                <!-- 投票点击区域 - 独立的层 -->
                <div 
                  class="absolute inset-0 cursor-pointer"
                  @click="vote(currentMatch.user2.id)"
                >
                  <!-- 选择遮罩 -->
                  <div class="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center rounded-2xl">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 分数显示 -->
                <div class="absolute top-4 left-4 bg-black/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <span class="text-white text-sm font-medium">{{ formatScore(currentMatch.user2.eloScore) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部操作栏 -->
        <div class="flex-shrink-0 p-4 flex flex-col justify-center space-x-4 justify-center items-center">
          <button
            @click="skipMatch"
            class="btn-secondary md:w-[100px]"
            :disabled="isVoting"
          >
            跳过
          </button>
          
          
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-white/70">正在准备对决...</p>
        </div>
      </div>
    </div>
    <ReportDialog
      :show="showReportDialog"
      :image-id="reportImageId"
      @close="closeReportDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArenaStore } from '@/stores/arena'
import { useNotificationStore } from '@/stores/notification'
import ReportDialog from '@/components/ReportDialog.vue'

const router = useRouter()
const userStore = useUserStore()
const arenaStore = useArenaStore()
const notificationStore = useNotificationStore()

// 响应式状态
const isLoading = ref(true)
const showCategoryDropdown = ref(false)
const currentMainCategory = ref('normal')
const currentSubCategory = ref('normal_female')
const showReportDialog = ref(false)
const reportImageId = ref(null)

// 计算属性
const currentMatch = computed(() => arenaStore.currentMatch)
const isVoting = computed(() => arenaStore.isVoting)
const userFuel = computed(() => userStore.userFuel)
const userLevel = computed(() => userStore.userLevel)
const todayVotes = computed(() => arenaStore.todayVotes)

// 分类相关
const categories = [
  {
    id: 'normal',
    name: '素人',
    subcategories: [
      { id: 'normal_female', name: '女生' },
      { id: 'normal_male', name: '男生' },
    ]
  },
  {
    id: 'celebrity',
    name: '明星',
    subcategories: [
      { id: 'celebrity_female', name: '女生' },
      { id: 'celebrity_male', name: '男生' },
    ]
  },
  {
    id: 'ai',
    name: 'AI',
    subcategories: [
      { id: 'ai_female', name: '女生' },
      { id: 'ai_male', name: '男生' },
    ]
  }
]

const currentCategoryDisplay = computed(() => {
  const mainCategory = categories.find(c => c.id === currentMainCategory.value)
  const subCategory = mainCategory?.subcategories.find(s => s.id === currentSubCategory.value)
  return `${mainCategory?.name} · ${subCategory?.name}`
})

const toggleCategoryDropdown = () => {
  console.log('Toggling dropdown, current state:', showCategoryDropdown.value)
  showCategoryDropdown.value = !showCategoryDropdown.value
  console.log('New state:', showCategoryDropdown.value)
}

const selectCategory = (mainCategoryId, subCategoryId) => {
  currentMainCategory.value = mainCategoryId
  currentSubCategory.value = subCategoryId
  showCategoryDropdown.value = false
  generateNewMatch(subCategoryId)
}

const handleClickOutside = (event) => {
  if (showCategoryDropdown.value) {
    const dropdown = document.querySelector('.category-dropdown')
    const trigger = document.querySelector('.category-trigger')
    if (dropdown && !dropdown.contains(event.target) && trigger && !trigger.contains(event.target)) {
      showCategoryDropdown.value = false
    }
  }
}

// 格式化分数显示
const formatScore = (eloScore) => {
  if (eloScore >= 2200) return `${(9.5 + (eloScore - 2200) / 200).toFixed(1)}★`
  if (eloScore >= 2000) return `${(8.5 + (eloScore - 2000) / 133.33).toFixed(1)}★`
  if (eloScore >= 1800) return `${(7.5 + (eloScore - 1800) / 200).toFixed(1)}★`
  if (eloScore >= 1600) return `${(6.5 + (eloScore - 1600) / 200).toFixed(1)}★`
  if (eloScore >= 1400) return `${(5.5 + (eloScore - 1400) / 200).toFixed(1)}★`
  return `${Math.max(1, 4.5 + (eloScore - 1200) / 200).toFixed(1)}★`
}

// 修改投票方法
const vote = async (winnerId) => {
  if (!currentMatch.value || isVoting.value) return
  
  try {
    // 保存当前比赛的引用，防止异步操作过程中被清空
    const currentMatchSnapshot = { ...currentMatch.value }
    
    const result = await arenaStore.vote(winnerId)
    
    // 显示成功通知
    notificationStore.showSuccess('投票成功！', '🎉 +5 燃料')
    
    // 等待一小段时间后生成新比赛
    setTimeout(() => {
      generateNewMatch()
    }, 1500)
    
  } catch (error) {
    console.error('投票失败:', error)
  }
}

// 跳过比赛
const skipMatch = () => {
  arenaStore.skipMatch()
  generateNewMatch()
}

// 生成新比赛
const generateNewMatch = (categoryId = currentSubCategory.value) => {
  if (!arenaStore.canVote) {
    return
  }
  
  isLoading.value = true
  
  // 确保清除当前比赛
  currentMatch.value = null
  
  // 模拟网络延迟
  setTimeout(() => {
    try {
      const match = arenaStore.generateMatch(categoryId)
      if (!match) {
        notificationStore.showError('暂时没有可用的对决，请稍后再试')
        return
      }
      isLoading.value = false
    } catch (error) {
      console.error('生成比赛失败:', error)
      notificationStore.showError('生成比赛失败，请刷新页面重试')
    } finally {
      isLoading.value = false
    }
  }, 500)
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.jpg'
}

// 打开投诉对话框
const openReportDialog = (imageId) => {
  reportImageId.value = imageId
  showReportDialog.value = true
}

// 关闭投诉对话框
const closeReportDialog = () => {
  showReportDialog.value = false
  reportImageId.value = null
}

// 初始化
onMounted(() => {
  generateNewMatch()
})

// 监听用户燃料变化
watch(() => userStore.userFuel, (newFuel, oldFuel) => {
  if (newFuel === 0 && oldFuel > 0) {
    notificationStore.showWarning('燃料已用完，需要获得更多燃料才能继续投票')
  }
})

// 键盘快捷键支持
const handleKeyPress = (event) => {
  if (!currentMatch.value || isVoting.value) return
  
  switch (event.key) {
    case '1':
    case 'ArrowUp':
      vote(currentMatch.value.user1.id)
      break
    case '2':  
    case 'ArrowDown':
      vote(currentMatch.value.user2.id)
      break
    case ' ':
    case 'Escape':
      event.preventDefault()
      skipMatch()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
  document.removeEventListener('click', handleClickOutside)
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

/* 触摸反馈 */
@media (hover: none) {
  .photo-card:active {
    transform: scale(0.98);
  }
}

/* 隐藏滚动条但保持可滚动 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
