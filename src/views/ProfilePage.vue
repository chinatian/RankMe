<template>
  <div class="min-h-screen bg-gray-900 safe-area-top safe-area-bottom">
    <!-- 顶部导航 -->
    <div class="flex-shrink-0 p-4 bg-dark-100/50 backdrop-blur-sm border-b border-dark-300">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
        <button
                  @click="$router.back()"
                  class="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
        
        <h1 class="text-xl font-bold text-white">个人中心</h1>
        </div>

        <button
                @click="showUploadDialog = true"
                class="px-4 py-2 bg-gradient-primary rounded-full flex items-center justify-center space-x-1.5
                   shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200
                   active:scale-95 hover:-translate-y-0.5"
              >
                <span>+</span>
                <span>上传照片</span>
              </button>
        
        
      
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-[1024px] mx-auto">
        <!-- 用户照片和基本信息 -->
        <div class="relative p-6">
          <!-- 背景装饰 -->
          <div class="absolute inset-0 bg-gradient-primary/10 rounded-b-3xl"></div>
          
         
        </div>
        
        <!-- 照片列表 -->
        <div class="px-6 mb-6">
          <div class=" p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white flex items-center">
              
                我的照片
              </h3>
              
              
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div
                v-for="photo in userPhotos"
                :key="photo.id"
                class="relative group"
              >
                <!-- 照片容器 -->
                <div class="aspect-square rounded-xl overflow-hidden relative"
                     @click="openShareCard(photo)">
                  <img
                    :src="photo.url"
                    :alt="'照片 ' + photo.id"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- 左上角分数标签 - 仅在PK次数>=20时显示 -->
                  <div
                   
                    class="absolute top-2 left-2 bg-primary/90 px-2 py-1 rounded-lg backdrop-blur-sm"
                  >
                    <span class="text-white font-bold">{{ formatRating(photo.eloScore) }}</span>
                  </div>

                  <!-- 右上角删除按钮 -->
                  <button
                    v-if="userPhotos.length > 1"
                    @click.stop="confirmDeletePhoto(photo)"
                    class="absolute top-2 right-2 w-8 h-8 bg-black/80 rounded-full 
                           flex items-center justify-center text-white
                           hover:bg-black/50 active:scale-95 z-10"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>

                  <!-- PK次数不足遮罩 -->
                  <div
                    v-if="photo.totalMatches < 20"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    
                  </div>
                </div>

                <!-- 照片数据 -->
                <div class="mt-3 space-y-2">
                  <!-- PK数据 -->
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-white/70">PK次数</span>
                    <span class="text-white font-medium">{{ photo.totalMatches }}次</span>
                  </div>
                  
                  <!-- 胜率 -->
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-white/70">胜率</span>
                    <span class="text-white font-medium">{{ Math.round((photo.wins / photo.totalMatches) * 100) || 0 }}%</span>
                  </div>

                  <!-- 加速数据和按钮 -->
                  <div class="flex justify-between items-center">
                    <div class="text-sm">
                      <span class="text-white/70">加速</span>
                      <span class="text-white font-medium ml-1">{{ photo.acceleration || 0 }}x</span>
                    </div>
                    <button
                      @click="acceleratePhoto(photo)"
                      class="text-xs px-2.5 py-1 border border-primary text-primary hover:bg-primary/10 
                             rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!userFuel"
                    >
                      去加速
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
  
        
   
      
        
     
        
        
      </div>
    </div>
    
    <!-- 设置面板 -->
    <transition name="slide-up">
      <div v-if="showSettings" class="fixed inset-0 bg-black/50 z-50 flex items-end"
           @click="showSettings = false">
        <div class="w-full bg-dark-100 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
             @click.stop>
          <div class="text-center mb-6">
            <div class="w-8 h-1 bg-dark-300 rounded-full mx-auto mb-4"></div>
            <h3 class="text-xl font-bold text-white">设置</h3>
          </div>
          
          <div class="space-y-4">
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>隐私设置</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>通知设置</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <button class="w-full btn-secondary text-left flex items-center justify-between">
              <span>关于我们</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 删除确认对话框 -->
    <transition name="fade">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
           @click="showDeleteConfirm = false">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2">确认删除</h3>
            <p class="text-white/70">
              删除后将无法恢复你的所有数据，包括照片、分数和成就。确定要继续吗？
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="showDeleteConfirm = false"
              class="flex-1 btn-secondary"
            >
              取消
            </button>
            
            <button
              @click="deleteAccount"
              class="flex-1 bg-red-600 text-white font-medium py-3 px-6 rounded-xl
                     transition-all hover:bg-red-700 active:scale-95"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 上传照片对话框 -->
    <transition name="fade">
      <div v-if="showUploadDialog" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
           @click="showUploadDialog = false">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2">上传新照片</h3>
            <p class="text-white/70">
              选择一张清晰的照片上传，建议使用正面照，光线充足的照片效果最佳。
            </p>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          
          <div class="space-y-4">
            <button
              @click="$refs.fileInput.click()"
              class="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>选择照片</span>
            </button>
            
            <button
              @click="showUploadDialog = false"
              class="w-full btn-secondary"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 删除照片确认对话框 -->
    <transition name="fade">
      <div v-if="photoToDelete" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
           @click="photoToDelete = null">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2">确认删除照片</h3>
            <p class="text-white/70">
              删除后将无法恢复此照片的所有数据，包括分数和对战记录。确定要继续吗？
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="photoToDelete = null"
              class="flex-1 btn-secondary"
            >
              取消
            </button>
            
            <button
              @click="handleDeletePhoto"
              class="flex-1 bg-red-600 text-white font-medium py-3 px-6 rounded-xl
                     transition-all hover:bg-red-700 active:scale-95"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 分享卡片弹窗 -->
    <transition name="fade">
      <div v-if="selectedPhoto" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
           @click="selectedPhoto = null">
        <div class="bg-dark-100 rounded-2xl p-6 max-w-sm w-full" @click.stop>
          <!-- 分享卡片预览 -->
          <div ref="shareCardRef" class="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl p-6 mb-6 relative overflow-hidden">
            <!-- 装饰背景 -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute -right-12 -top-12 w-48 h-48 bg-primary/30 rounded-full blur-2xl"></div>
              <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
            
            <!-- 内容区域 -->
            <div class="relative">
              <div class="aspect-square rounded-xl overflow-hidden mb-4 shadow-lg">
                <img
                  :src="selectedPhoto?.url"
                  :alt="'照片 ' + selectedPhoto?.id"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <div class="space-y-4">
                <!-- 评分 -->
                <div class="flex justify-between items-center bg-dark-100/50 rounded-lg p-3">
                  <span class="text-white/70">颜值评分</span>
                  <div class="flex items-baseline">
                    <span class="text-primary text-2xl font-bold">{{ formatRating(selectedPhoto?.eloScore) }}</span>
                    <span class="text-white/50 ml-1">分</span>
                  </div>
                </div>
                
                <!-- 数据统计 -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-dark-100/50 rounded-lg p-3">
                    <div class="text-white/70 text-sm mb-1">PK次数</div>
                    <div class="text-white font-medium">{{ selectedPhoto?.totalMatches }}次</div>
                  </div>
                  
                  <div class="bg-dark-100/50 rounded-lg p-3">
                    <div class="text-white/70 text-sm mb-1">胜率</div>
                    <div class="text-white font-medium">{{ Math.round((selectedPhoto?.wins / selectedPhoto?.totalMatches) * 100) || 0 }}%</div>
                  </div>
                </div>

                <!-- 二维码区域 -->
                <div class="flex items-center justify-center pt-2">
                  <div class="bg-white rounded-lg p-2">
                    <QRCode 
                      :value="shareUrl"
                      :size="100"
                      level="M"
                      render-as="svg"
                      :margin="0"
                      class="w-full h-full"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-center space-x-2">
                  <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div class="text-center text-xs text-white/50 px-3">比比谁更美</div>
                  <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="space-y-3">
            <button
              @click="downloadShareCard"
              class="w-full bg-gradient-to-r from-primary to-primary-light text-white font-medium 
                     py-3 px-6 rounded-xl flex items-center justify-center space-x-2
                     transition-all hover:opacity-90 active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>下载并分享</span>
            </button>
            
            <button
              @click="selectedPhoto = null"
              class="w-full border border-white/10 text-white/70 font-medium py-3 px-6 rounded-xl
                     transition-all hover:bg-white/5 active:scale-95"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode.vue'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const showSettings = ref(false)
const showDeleteConfirm = ref(false)
const showUploadDialog = ref(false)
const photoToDelete = ref(null)
const fileInput = ref(null)

// 计算属性
const user = computed(() => userStore.user)
const userRating = computed(() => userStore.userRating)
const userLevel = computed(() => userStore.userLevel)
const userFuel = computed(() => userStore.userFuel)
const userPhotos = computed(() => userStore.userPhotos)
const bestPhoto = computed(() => userStore.bestPhoto)

// 格式化评分
const formatRating = (eloScore) => {
  // 将Elo分数转换为1-10分制
  let rating = 4.5 + (eloScore - 1200) / 200
  if (eloScore >= 2200) rating = Math.min(10, 9.5 + (eloScore - 2200) / 200)
  else if (eloScore >= 2000) rating = 8.5 + (eloScore - 2000) / 133.33
  else if (eloScore >= 1800) rating = 7.5 + (eloScore - 1800) / 200
  else if (eloScore >= 1600) rating = 6.5 + (eloScore - 1600) / 200
  else if (eloScore >= 1400) rating = 5.5 + (eloScore - 1400) / 200
  return rating.toFixed(1)
}

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // 这里应该调用你的文件上传API
      // 为了演示，我们使用本地URL
      const photoUrl = URL.createObjectURL(file)
      await userStore.addPhoto(photoUrl)
      showUploadDialog.value = false
      notificationStore.showSuccess('照片上传成功')
    } catch (error) {
      notificationStore.showError('照片上传失败')
    }
  }
}

// 确认删除照片
const confirmDeletePhoto = (photo) => {
  photoToDelete.value = photo
}

// 处理删除照片
const handleDeletePhoto = () => {
  if (photoToDelete.value) {
    const success = userStore.deletePhoto(photoToDelete.value.id)
    if (success) {
      notificationStore.showSuccess('照片已删除')
    } else {
      notificationStore.showError('必须保留至少一张照片')
    }
    photoToDelete.value = null
  }
}

// 生成模拟分数历史
const scoreHistory = computed(() => {
  const baseScore = user.value?.eloScore || 1500
  const history = []
  for (let i = 6; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 100
    history.push(Math.max(1000, baseScore + variation - i * 10))
  }
  return history
})

const maxScore = computed(() => Math.max(...scoreHistory.value))

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 分享档案
const shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: '颜值PK - 我的档案',
      text: `我在颜值PK中的分数是${userRating.value.toFixed(1)}分，快来挑战我吧！`,
      url: window.location.origin
    }).catch(console.error)
  } else {
    // 降级方案：复制链接
    navigator.clipboard.writeText(window.location.origin).then(() => {
      notificationStore.showSuccess('链接已复制到剪贴板')
    }).catch(() => {
      notificationStore.showInfo('请手动复制链接分享')
    })
  }
}

// 删除账户
const deleteAccount = () => {
  userStore.clearUser()
  notificationStore.showInfo('账户已删除')
  router.push('/')
}

// 加速照片
const acceleratePhoto = (photo) => {
  if (!userFuel.value) {
    notificationStore.showError('燃料不足，无法加速')
    return
  }
  
  try {
    // 这里应该调用加速API
    // 为了演示，我们直接更新本地状态
    photo.acceleration = (photo.acceleration || 0) + 1
    notificationStore.showSuccess('加速成功')
  } catch (error) {
    notificationStore.showError('加速失败')
  }
}

const selectedPhoto = ref(null)
const shareCardRef = ref(null)

// 打开分享卡片
const openShareCard = (photo) => {
  selectedPhoto.value = photo
}

// 生成分享链接
const shareUrl = computed(() => {
  if (!selectedPhoto.value) return ''
  // 这里替换成实际的分享链接
  return `${window.location.origin}/share/${selectedPhoto.value.id}`
})

// 下载分享卡片
const downloadShareCard = async () => {
  if (!shareCardRef.value) return
  
  try {
    const canvas = await html2canvas(shareCardRef.value, {
      backgroundColor: null,
      scale: 2, // 提高导出图片质量
    })
    
    const link = document.createElement('a')
    link.download = `颜值PK-${formatRating(selectedPhoto.value?.eloScore)}分.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    
    selectedPhoto.value = null
    notificationStore.showSuccess('图片已保存')
  } catch (error) {
    notificationStore.showError('保存失败')
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
