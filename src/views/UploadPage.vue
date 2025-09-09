<template>
  <div class="min-h-screen bg-gray-900 flex flex-col safe-area-top safe-area-bottom">
    <!-- 顶部导航 -->
    <div class="flex-shrink-0 p-4 flex items-center justify-between">
      <button
        @click="$router.back()"
        class="p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <h1 class="text-xl font-bold text-white">上传照片</h1>
      
      <div class="w-10"></div>
    </div>
    
    <!-- 主要内容 -->
    <div class="flex-1 flex flex-col p-6">
      <!-- 上传区域 -->
      <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <!-- 步骤指示器 -->
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                currentStep >= 1 ? 'bg-gradient-primary text-white' : 'bg-dark-300 text-white/50'
              ]">
                1
              </div>
              <span :class="['text-sm', currentStep >= 1 ? 'text-white' : 'text-white/50']">选择照片</span>
            </div>
            
            <div class="w-8 h-px bg-dark-300"></div>
            
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                currentStep >= 2 ? 'bg-gradient-primary text-white' : 'bg-dark-300 text-white/50'
              ]">
                2
              </div>
              <span :class="['text-sm', currentStep >= 2 ? 'text-white' : 'text-white/50']">裁剪调整</span>
            </div>
            
            <div class="w-8 h-px bg-dark-300"></div>
            
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                currentStep >= 3 ? 'bg-gradient-primary text-white' : 'bg-dark-300 text-white/50'
              ]">
                3
              </div>
              <span :class="['text-sm', currentStep >= 3 ? 'text-white' : 'text-white/50']">完成</span>
            </div>
          </div>
        </div>
        
        <!-- 步骤1: 选择照片 -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">选择你的照片</h2>
            <p class="text-white/70">上传一张清晰的正面照片</p>
          </div>
          
          <!-- 上传区域 -->
          <div
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
            class="relative border-2 border-dashed border-dark-300 rounded-2xl p-8 text-center
                   hover:border-primary-500 transition-colors cursor-pointer group"
            :class="{ 'border-primary-500 bg-primary-500/5': isDragging }"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
            
            <div class="space-y-4">
              <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              
              <div>
                <p class="text-white font-medium mb-1">点击上传或拖拽照片到这里</p>
                <p class="text-white/60 text-sm">支持 JPG、PNG 格式，大小不超过 5MB</p>
              </div>
            </div>
          </div>
          
          <!-- 相机拍照选项 -->
          <div class="flex space-x-3">
            <button
              @click="openCamera"
              class="flex-1 bg-dark-200 text-white font-medium py-3 px-4 rounded-xl
                     border border-dark-300 transition-all hover:bg-dark-300 active:scale-95
                     flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>拍照</span>
            </button>
            
            <button
              @click="triggerFileInput"
              class="flex-1 bg-dark-200 text-white font-medium py-3 px-4 rounded-xl
                     border border-dark-300 transition-all hover:bg-dark-300 active:scale-95
                     flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>相册</span>
            </button>
          </div>
        </div>
        
        <!-- 步骤2: 裁剪照片 -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">调整照片</h2>
            <p class="text-white/70">拖拽调整照片位置和大小</p>
          </div>
          
          <!-- 裁剪区域 -->
          <div class="relative bg-dark-200 rounded-2xl overflow-hidden" style="aspect-ratio: 1;">
            <canvas
              ref="cropCanvas"
              class="w-full h-full object-cover cursor-move"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @touchstart="startDrag"
              @touchmove="onDrag"
              @touchend="endDrag"
            ></canvas>
            
            <!-- 裁剪框 -->
            <div class="absolute inset-4 border-2 border-white rounded-2xl pointer-events-none">
              <div class="absolute inset-0 border border-white/50 rounded-2xl"></div>
            </div>
          </div>
          
          <!-- 调整控件 -->
          <div class="space-y-4">
            <div>
              <label class="text-white/80 text-sm block mb-2">缩放</label>
              <input
                v-model="cropScale"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                class="w-full"
                @input="updateCrop"
              />
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex space-x-3">
            <button
              @click="currentStep = 1"
              class="flex-1 btn-secondary"
            >
              重新选择
            </button>
            
            <button
              @click="finalizeCrop"
              class="flex-1 btn-primary"
            >
              确认
            </button>
          </div>
        </div>
        
        <!-- 步骤3: 上传成功 -->
        <div v-if="currentStep === 3" class="text-center space-y-6">
          <div class="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-bounce-in">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">上传成功！</h2>
            <p class="text-white/70 mb-6">
              你的照片正在审核中，通常需要几分钟时间。<br>
              现在开始为他人打分来解锁你的分数吧！
            </p>
          </div>
          
          <!-- 最终照片预览 -->
          <div v-if="finalImage" class="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-xl">
            <img :src="finalImage" alt="上传的照片" class="w-full h-full object-cover" />
          </div>
          
          <button
            @click="completeUpload"
            class="btn-primary w-full"
          >
            开始打分之旅
          </button>
        </div>
      </div>
      
      <!-- 注意事项 -->
      <div class="mt-8 bg-dark-200/50 rounded-xl p-4 max-w-md mx-auto w-full">
        <h3 class="text-white font-medium mb-2">📝 上传须知</h3>
        <ul class="text-white/70 text-sm space-y-1">
          <li>• 请上传真实、清晰的正面照片</li>
          <li>• 照片会经过人工审核，不合规内容将被删除</li>
          <li>• 我们承诺保护你的隐私安全</li>
          <li>• 禁止上传他人照片或明星照片</li>
        </ul>
      </div>
    </div>
    
    <!-- 加载遮罩 -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-dark-100 rounded-2xl p-6 text-center">
        <div class="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-white">{{ loadingText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

// 状态
const currentStep = ref(1)
const isLoading = ref(false)
const loadingText = ref('处理中...')
const isDragging = ref(false)

// 文件相关
const fileInput = ref(null)
const selectedFile = ref(null)
const originalImage = ref(null)
const finalImage = ref(null)

// 裁剪相关
const cropCanvas = ref(null)
const cropScale = ref(1)
const cropX = ref(0)
const cropY = ref(0)
const isDraggingCrop = ref(false)
const lastMousePos = ref({ x: 0, y: 0 })

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 打开相机
const openCamera = async () => {
  try {
    // 创建一个临时的 input 元素来触发相机
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'user' // 前置摄像头
    
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    }
    
    input.click()
  } catch (error) {
    console.error('打开相机失败:', error)
    notificationStore.showError('无法打开相机，请直接选择照片')
    triggerFileInput()
  }
}

// 处理拖拽上传
const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

// 处理文件选择
const handleFileSelect = (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0])
  }
}

// 处理文件
const handleFile = (file) => {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    notificationStore.showError('请选择图片文件')
    return
  }
  
  // 验证文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    notificationStore.showError('文件大小不能超过5MB')
    return
  }
  
  selectedFile.value = file
  loadImage(file)
}

// 加载图片
const loadImage = (file) => {
  isLoading.value = true
  loadingText.value = '加载图片中...'
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      setupCropCanvas()
      currentStep.value = 2
      isLoading.value = false
    }
    img.onerror = () => {
      notificationStore.showError('图片加载失败，请重试')
      isLoading.value = false
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

// 设置裁剪画布
const setupCropCanvas = () => {
  if (!cropCanvas.value || !originalImage.value) return
  
  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')
  
  // 设置画布尺寸
  const containerSize = canvas.parentElement.clientWidth
  canvas.width = containerSize
  canvas.height = containerSize
  
  // 重置裁剪参数
  cropScale.value = 1
  cropX.value = 0
  cropY.value = 0
  
  updateCrop()
}

// 更新裁剪
const updateCrop = () => {
  if (!cropCanvas.value || !originalImage.value) return
  
  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')
  const img = originalImage.value
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 计算图片尺寸
  const scale = cropScale.value
  const imgWidth = img.width * scale
  const imgHeight = img.height * scale
  
  // 计算居中位置
  const x = (canvas.width - imgWidth) / 2 + cropX.value
  const y = (canvas.height - imgHeight) / 2 + cropY.value
  
  // 绘制图片
  ctx.drawImage(img, x, y, imgWidth, imgHeight)
}

// 开始拖拽
const startDrag = (e) => {
  isDraggingCrop.value = true
  const pos = getEventPosition(e)
  lastMousePos.value = pos
  e.preventDefault()
}

// 拖拽中
const onDrag = (e) => {
  if (!isDraggingCrop.value) return
  
  const pos = getEventPosition(e)
  const deltaX = pos.x - lastMousePos.value.x
  const deltaY = pos.y - lastMousePos.value.y
  
  cropX.value += deltaX
  cropY.value += deltaY
  
  lastMousePos.value = pos
  updateCrop()
  e.preventDefault()
}

// 结束拖拽
const endDrag = () => {
  isDraggingCrop.value = false
}

// 获取事件位置
const getEventPosition = (e) => {
  if (e.touches && e.touches[0]) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

// 完成裁剪
const finalizeCrop = () => {
  if (!cropCanvas.value) return
  
  isLoading.value = true
  loadingText.value = '处理图片中...'
  
  // 创建最终的裁剪图片
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 512 // 最终图片尺寸
  
  canvas.width = size
  canvas.height = size
  
  // 获取裁剪区域
  const sourceCanvas = cropCanvas.value
  const cropSize = sourceCanvas.width * 0.8 // 裁剪框大小 (减去边距)
  const cropStartX = sourceCanvas.width * 0.1
  const cropStartY = sourceCanvas.height * 0.1
  
  // 绘制裁剪后的图片
  ctx.drawImage(
    sourceCanvas,
    cropStartX, cropStartY, cropSize, cropSize,
    0, 0, size, size
  )
  
  // 转换为图片
  canvas.toBlob((blob) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      finalImage.value = e.target.result
      currentStep.value = 3
      isLoading.value = false
    }
    reader.readAsDataURL(blob)
  }, 'image/jpeg', 0.9)
}

// 完成上传
const completeUpload = async () => {
  if (!finalImage.value) return
  
  isLoading.value = true
  loadingText.value = '创建用户档案...'
  
  try {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建用户
    const userData = {
      photo: finalImage.value,
      needsOnboarding: true
    }
    
    userStore.createUser(userData)
    
    notificationStore.showSuccess('照片上传成功！开始你的颜值PK之旅吧')
    
    // 跳转到新手引导
    router.push('/arena')
    
  } catch (error) {
    console.error('上传失败:', error)
    notificationStore.showError('上传失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 监听拖拽事件
onMounted(() => {
  document.addEventListener('dragenter', (e) => {
    if (currentStep.value === 1) {
      isDragging.value = true
    }
  })
  
  document.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget) {
      isDragging.value = false
    }
  })
  
  document.addEventListener('drop', () => {
    isDragging.value = false
  })
})

onBeforeUnmount(() => {
  // 清理事件监听
  document.removeEventListener('dragenter', () => {})
  document.removeEventListener('dragleave', () => {})
  document.removeEventListener('drop', () => {})
})
</script>

<style scoped>
/* 裁剪画布样式 */
canvas {
  max-width: 100%;
  height: auto;
}

/* 拖拽时的样式 */
.is-dragging {
  background-color: rgba(138, 43, 226, 0.1);
  border-color: #8A2BE2;
}

/* 滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #404040;
  height: 4px;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: linear-gradient(135deg, #8A2BE2 0%, #FF007F 100%);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #404040;
  height: 4px;
  border-radius: 2px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: linear-gradient(135deg, #8A2BE2 0%, #FF007F 100%);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
