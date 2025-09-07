# 颜值PK - 颜值对决网站

一个基于Vue 3的现代化颜值打分应用，采用Elo评分系统，提供公平、有趣的颜值对决体验。

## ✨ 特性

### 🎯 核心功能
- **Elo评分系统** - 科学公平的评分算法，类似国际象棋评分
- **颜值对决** - 二选一的简单操作，专注核心体验
- **实时排行榜** - 总榜、日榜、周榜、性别分类
- **燃料系统** - 投票获得燃料，燃料换取曝光机会
- **成就徽章** - 丰富的成就系统，增加游戏化体验

### 🎨 设计特色
- **暗色主题** - 让照片更突出的深色界面
- **渐变配色** - 赛博朋克风格的紫粉渐变
- **移动优先** - 专为移动端优化的响应式设计
- **流畅动画** - 精心设计的过渡和交互动画
- **PWA支持** - 可安装的渐进式Web应用

### 🔒 隐私保护
- **匿名系统** - 用户可以保持匿名
- **内容审核** - AI + 人工的双重审核机制
- **数据安全** - 本地存储，保护用户隐私

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **Pinia** - 轻量级状态管理
- **Vue Router** - 单页应用路由

### UI & 样式
- **Tailwind CSS** - 原子化CSS框架
- **PostCSS** - CSS后处理器
- **自定义动画** - CSS3动画和过渡

### 开发工具
- **Vite** - 极速的前端构建工具
- **PWA Plugin** - 渐进式Web应用支持

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 7+ 或 yarn 1.22+

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📱 功能模块

### 1. 首页 (HomePage)
- 应用介绍和特性展示
- 新用户引导入口
- 快速访问各功能模块

### 2. 上传页面 (UploadPage)
- 照片选择（相册/相机）
- 实时裁剪和调整
- 三步式上传流程

### 3. 新手引导 (OnboardingPage)
- 10次投票解锁分数
- 进度显示和激励
- 引导式用户体验

### 4. 打分竞技场 (ArenaPage)
- 核心对决功能
- Elo匹配算法
- 实时反馈和奖励

### 5. 个人中心 (ProfilePage)
- 分数和排名展示
- 统计数据图表
- 成就徽章管理

### 6. 排行榜 (LeaderboardPage)
- 多维度排名展示
- 实时更新数据
- 用户位置定位

## 🧮 评分算法

### Elo评分系统

应用采用国际象棋Elo评分系统的改进版本：

```javascript
// 基础Elo计算公式
expectedScore = 1 / (1 + 10^((opponent - player) / 400))
newScore = player + K * (actual - expected)
```

**参数说明：**
- `K值`: 32 (可根据用户活跃度调整)
- `初始分数`: 1500
- `分数范围`: 1000-2500

**分数转换：**
- Elo分数 → 1-10分制显示
- 2200+ → 9.5-10分 (传说级)
- 2000-2200 → 8.5-9.5分 (大师级)
- 1800-2000 → 7.5-8.5分 (专家级)
- 以此类推...

### 匹配算法

优先匹配分数相近的对手，确保对决公平性：

1. 按分数差距排序
2. 选择前8名候选者
3. 随机选择2人对决
4. 避免重复匹配

## 🎮 激励机制

### 燃料系统
- **获得方式**: 投票 +5燃料、被投票 +1燃料
- **消耗方式**: 照片曝光需要燃料
- **目的**: 鼓励用户积极参与投票

### 成就系统
- **新手引导**: 完成10次投票
- **连胜成就**: 连续胜利5/10/20场
- **分数里程碑**: 突破1600/1800/2000分
- **活跃奖励**: 连续登录、投票数量

## 📊 数据结构

### 用户数据模型
```javascript
{
  id: "用户唯一ID",
  photo: "头像URL",
  eloScore: 1500,           // Elo分数
  totalVotes: 0,            // 获得投票总数
  totalMatches: 0,          // 参与对决总数
  wins: 0,                  // 获胜次数
  losses: 0,                // 失败次数
  fuel: 0,                  // 燃料点数
  rank: null,               // 当前排名
  badges: [],               // 成就徽章
  needsOnboarding: true,    // 是否需要新手引导
  createdAt: "2024-01-01",  // 创建时间
  lastActiveAt: "2024-01-01" // 最后活跃时间
}
```

### 比赛数据模型
```javascript
{
  id: "比赛ID",
  user1: UserObject,        // 参赛者1
  user2: UserObject,        // 参赛者2
  winnerId: "获胜者ID",
  timestamp: 1640995200000, // 比赛时间戳
  scoreChanges: {           // 分数变化
    winner: +15,
    loser: -15
  }
}
```

## 🎨 设计规范

### 色彩系统
- **主色调**: 紫色渐变 `#8A2BE2` → `#FF007F`
- **辅助色**: 橙黄渐变 `#FF4500` → `#FFD700`
- **背景色**: 深灰色系 `#121212`, `#1e1e1e`
- **文本色**: 白色及透明度变化

### 组件规范
- **按钮**: 圆角统一 `rounded-xl` (12px)
- **卡片**: 圆角 `rounded-2xl` (16px)
- **照片**: 圆角 `rounded-2xl` 带阴影
- **动画**: 统一使用 `transition-all duration-300`

### 响应式断点
- **移动端**: `< 640px`
- **平板**: `640px - 1024px` 
- **桌面**: `> 1024px`

## 📂 项目结构

```
src/
├── components/          # 可复用组件
│   └── NotificationToast.vue
├── stores/             # Pinia状态管理
│   ├── user.js         # 用户状态
│   ├── arena.js        # 竞技场状态
│   └── notification.js # 通知状态
├── views/              # 页面组件
│   ├── HomePage.vue
│   ├── UploadPage.vue
│   ├── OnboardingPage.vue
│   ├── ArenaPage.vue
│   ├── ProfilePage.vue
│   ├── LeaderboardPage.vue
│   └── NotFoundPage.vue
├── router/             # 路由配置
│   └── index.js
├── utils/              # 工具函数
│   └── demoData.js
├── style.css           # 全局样式
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 🔧 配置文件

### Tailwind配置 (`tailwind.config.js`)
- 自定义颜色系统
- 渐变背景配置
- 动画和关键帧
- 响应式断点

### Vite配置 (`vite.config.js`)  
- Vue插件配置
- PWA插件配置
- 路径别名设置

### PWA配置
- 离线缓存策略
- 应用清单文件
- 图标和主题色

## 🌟 最佳实践

### 性能优化
- 路由懒加载
- 图片压缩和WebP支持
- 组件异步加载
- 缓存策略优化

### 用户体验
- 加载状态提示
- 错误边界处理
- 离线功能支持
- 手势交互优化

### 代码质量
- Vue 3 Composition API
- TypeScript类型支持（可选）
- ESLint代码规范
- 组件模块化设计

## 🚀 部署指南

### 静态部署
1. 构建生产版本: `npm run build`
2. 将 `dist/` 目录部署到静态服务器
3. 配置服务器支持SPA路由

### 推荐部署平台
- **Vercel** - 零配置部署
- **Netlify** - 自动化部署
- **GitHub Pages** - 免费静态托管
- **阿里云OSS** - 国内CDN加速

### 环境变量
```bash
# 生产环境API地址
VITE_API_BASE_URL=https://api.example.com

# 分析工具
VITE_ANALYTICS_ID=your_analytics_id
```

## 🤝 贡献指南

欢迎提交问题和功能请求！

### 开发流程
1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循Vue官方风格指南
- 编写清晰的提交信息
- 添加必要的注释

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: your-email@example.com

## 🙏 致谢

- Vue.js 团队提供的优秀框架
- Tailwind CSS 的原子化设计理念
- Unsplash 提供的免费图片API
- 所有贡献者和测试用户

---

**⭐ 如果这个项目对你有帮助，请给它一个星标！**
