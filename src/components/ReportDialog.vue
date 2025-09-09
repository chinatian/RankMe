<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close"></div>
    
    <!-- 表单对话框 -->
    <div class="relative bg-dark-100 rounded-2xl w-[90vw] max-w-md p-6 shadow-xl">
      <h3 class="text-xl font-bold text-white mb-4">投诉举报</h3>
      
      <!-- 投诉类型选择 -->
      <div class="space-y-3 mb-6">
        <label class="block text-white/70 text-sm mb-2">投诉类型</label>
        <div class="space-y-2">
          <label 
            v-for="type in reportTypes" 
            :key="type.value"
            class="flex items-center space-x-2 p-2 rounded hover:bg-dark-200 cursor-pointer"
          >
            <input
              type="radio"
              :value="type.value"
              v-model="selectedType"
              class="text-primary"
            >
            <span class="text-white">{{ type.label }}</span>
          </label>
        </div>
      </div>
      
      <!-- 备注信息 -->
      <div class="mb-6">
        <label class="block text-white/70 text-sm mb-2">备注信息（选填）</label>
        <textarea
          v-model="comment"
          rows="3"
          class="w-full bg-dark-200 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入补充说明..."
        ></textarea>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex space-x-3">
        <button
          @click="close"
          class="flex-1 px-4 py-2 rounded-lg bg-dark-200 text-white hover:bg-dark-300 transition-colors"
        >
          取消
        </button>
        <button
          @click="submit"
          :disabled="!selectedType"
          class="flex-1 px-4 py-2 rounded-lg bg-gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  imageId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

// 投诉类型列表
const reportTypes = [
  { value: 'wrong_category', label: '分类错误' },
  { value: 'low_quality', label: '图片不清晰' },
  { value: 'adult_content', label: '涉黄' },
  { value: 'political', label: '涉政' },
  { value: 'other', label: '其他' }
]

// 表单数据
const selectedType = ref('')
const comment = ref('')

// 关闭对话框
const close = () => {
  selectedType.value = ''
  comment.value = ''
  emit('close')
}

// 提交投诉
const submit = () => {
  if (!selectedType.value) return
  
  // TODO: 调用API提交投诉
  console.log('提交投诉:', {
    imageId: props.imageId,
    type: selectedType.value,
    comment: comment.value
  })
  
  notificationStore.showSuccess('投诉已提交', '感谢您的反馈')
  close()
}
</script> 