import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { 
      title: '颜值PK - 开始挑战',
      transition: 'fade'
    }
  },
  {
    path: '/arena',
    name: 'Arena',
    component: () => import('@/views/ArenaPage.vue'),
    meta: { 
      title: '颜值对决',
      transition: 'slide-left',
      requiresUser: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { 
      title: '个人中心',
      transition: 'slide-up',
      requiresUser: true
    }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/views/LeaderboardPage.vue'),
    meta: { 
      title: '排行榜',
      transition: 'slide-right'
    }
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/views/UploadPage.vue'),
    meta: { 
      title: '上传照片',
      transition: 'slide-up'
    }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/OnboardingPage.vue'),
    meta: { 
      title: '新手引导',
      transition: 'fade'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { 
      title: '页面未找到',
      transition: 'fade'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要用户信息
  if (to.meta.requiresUser && !userStore.hasUser) {
    // 如果没有用户信息，重定向到首页
    next('/')
    return
  }
  
  // 如果用户已经上传照片但还没完成新手引导，引导到打分页面
  if (to.name === 'Home' && userStore.hasUser && userStore.user.needsOnboarding) {
    next('/onboarding')
    return
  }
  
  next()
})

export default router
