# 部署指南

本文档提供颜值PK应用的详细部署说明。

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd 颜值打分
   ```

2. **自动化安装**
   ```bash
   # macOS/Linux
   ./scripts/setup.sh
   
   # Windows
   npm install
   npm run dev
   ```

3. **手动安装**
   ```bash
   # 安装依赖
   npm install
   
   # 启动开发服务器
   npm run dev
   ```

4. **访问应用**
   - 开发地址：http://localhost:5173
   - 自动打开浏览器并支持热重载

## 📦 构建生产版本

### 构建命令
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 构建输出
- 输出目录：`dist/`
- 静态资源：`dist/assets/`
- 入口文件：`dist/index.html`

## 🌐 部署平台

### 1. Vercel (推荐)

**一键部署：**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yanzhi-pk)

**手动部署：**
1. 安装Vercel CLI：`npm i -g vercel`
2. 登录：`vercel login`
3. 部署：`vercel --prod`

**配置：**
- 已包含 `vercel.json` 配置文件
- 自动配置SPA路由
- 静态资源缓存优化

### 2. Netlify

**一键部署：**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/yanzhi-pk)

**手动部署：**
1. 在Netlify控制台创建新站点
2. 连接Git仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

**配置：**
- 已包含 `netlify.toml` 配置文件
- SPA路由重定向
- 性能和安全优化

### 3. GitHub Pages

**配置GitHub Actions：**

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. 阿里云OSS + CDN

**步骤：**
1. 创建OSS存储桶
2. 开启静态网站托管
3. 上传构建文件到OSS
4. 配置CDN加速

**自动化脚本：**
```bash
# 安装阿里云CLI
npm install -g @alicloud/cli

# 配置访问密钥
aliyun configure

# 同步文件到OSS
aliyun oss cp -r dist/ oss://your-bucket-name/ --update
```

## 🔧 环境配置

### 环境变量

创建 `.env.production`：

```bash
# API地址（如果有后端）
VITE_API_BASE_URL=https://api.yourapp.com

# 分析工具
VITE_ANALYTICS_ID=your_google_analytics_id

# CDN地址
VITE_CDN_BASE_URL=https://cdn.yourapp.com

# 应用版本
VITE_APP_VERSION=1.0.0
```

### PWA配置

编辑 `vite.config.js` 中的PWA设置：

```javascript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  },
  manifest: {
    name: '你的应用名称',
    short_name: '短名称',
    description: '应用描述',
    theme_color: '#8A2BE2',
    background_color: '#121212',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})
```

## 📊 性能优化

### 构建优化

1. **代码分割**
   - 路由级别懒加载
   - 组件异步导入
   - 第三方库单独打包

2. **资源优化**
   - 图片压缩和WebP格式
   - CSS和JS压缩
   - Gzip压缩

3. **缓存策略**
   - 静态资源长期缓存
   - HTML短期缓存
   - Service Worker缓存

### 监控和分析

**添加分析工具：**

```javascript
// src/utils/analytics.js
export const initAnalytics = () => {
  if (import.meta.env.VITE_ANALYTICS_ID) {
    // Google Analytics 4
    gtag('config', import.meta.env.VITE_ANALYTICS_ID)
  }
}

export const trackEvent = (eventName, parameters) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters)
  }
}
```

## 🛡️ 安全配置

### 内容安全策略 (CSP)

在 `index.html` 中添加：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https:;
               font-src 'self' https://fonts.gstatic.com;">
```

### HTTPS配置

所有部署平台都应强制使用HTTPS：

1. **Vercel/Netlify**: 自动配置
2. **自定义服务器**: 配置SSL证书
3. **CDN**: 开启HTTPS回源

## 📱 移动端优化

### PWA安装引导

```javascript
// src/utils/pwa.js
let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  showInstallPrompt()
})

export const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    return outcome === 'accepted'
  }
  return false
}
```

### 触摸优化

CSS配置：
```css
/* 改善触摸体验 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* 按钮触摸反馈 */
.btn {
  touch-action: manipulation;
}

.btn:active {
  transform: scale(0.98);
}
```

## 🔍 SEO优化

### Meta标签

```html
<!-- 基础SEO -->
<title>颜值PK - 颜值对决，看看你排第几</title>
<meta name="description" content="公平的颜值评分平台，使用Elo算法进行科学排名">
<meta name="keywords" content="颜值,打分,排名,PK,评分">

<!-- Open Graph -->
<meta property="og:title" content="颜值PK">
<meta property="og:description" content="颜值对决，看看你在大家眼中排第几">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://yourapp.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="颜值PK">
<meta name="twitter:description" content="颜值对决，看看你在大家眼中排第几">
<meta name="twitter:image" content="/twitter-image.jpg">
```

### Sitemap生成

```javascript
// scripts/generate-sitemap.js
import { writeFileSync } from 'fs'

const routes = ['/', '/leaderboard', '/upload']
const baseUrl = 'https://yourapp.com'

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`

writeFileSync('dist/sitemap.xml', sitemap)
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清除缓存
   rm -rf node_modules package-lock.json
   npm install
   
   # 检查Node.js版本
   node --version  # 需要 16+
   ```

2. **路由404错误**
   - 确保服务器配置SPA重定向
   - 检查 `base` 配置是否正确

3. **PWA不工作**
   - 检查HTTPS配置
   - 验证Service Worker注册
   - 确认manifest.json可访问

4. **图片加载失败**
   - 检查图片路径
   - 确认CDN配置
   - 验证CORS设置

### 调试模式

开发环境调试：
```bash
# 开启详细日志
DEBUG=vite:* npm run dev

# 分析构建包大小
npm run build -- --analyze
```

生产环境调试：
```javascript
// 在浏览器控制台
console.log('App Version:', import.meta.env.VITE_APP_VERSION)
console.log('Build Time:', document.querySelector('meta[name="build-time"]')?.content)
```

## 📈 监控和维护

### 性能监控

1. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)  
   - CLS (Cumulative Layout Shift)

2. **自定义指标**
   - 页面加载时间
   - API响应时间
   - 用户交互延迟

### 错误监控

```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // 发送错误报告到监控服务
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  // 发送错误报告到监控服务
})
```

### 日志收集

```javascript
// src/utils/logger.js
export const logger = {
  info: (message, data) => {
    console.info(message, data)
    // 发送到日志服务
  },
  
  error: (message, error) => {
    console.error(message, error)
    // 发送错误到监控服务
  },
  
  track: (event, properties) => {
    console.log('Track:', event, properties)
    // 发送到分析服务
  }
}
```

---

## 🎯 总结

本部署指南涵盖了从本地开发到生产部署的完整流程。选择合适的部署平台并按照相应配置进行部署即可。

如需帮助，请查看：
- 项目README.md
- GitHub Issues
- 在线文档

祝你部署顺利！🚀
