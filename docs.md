
 💡 StudioCMS 实现计划书（Vue 项目）

> 项目代号：**StudioCMS**
> 类型：Vue + Node 全栈项目  
> 目标：构建一个既美观又实用的工作室官网，支持内容发布、管理和浏览，提升开发体验与参与感。

---

## 🗂 项目结构概览

StudioCMS/
├── frontend/ # Vue 3 + Vite 前端项目
│ ├── pages/ # 页面组件（首页、博客、后台）
│ ├── components/ # 通用组件（Navbar、Card）
│ ├── admin/ # 后台页面（登录、发布文章等）
│ └── services/ # API 封装
├── backend/ # Node + Express/Koa 后端项目
│ ├── routes/ # API 路由
│ ├── controllers/ # 逻辑控制器
│ ├── models/ # 数据模型（MongoDB）
│ └── middleware/ # 鉴权、错误处理
├── docs/ # 文档说明
└── README.md

yaml
复制
编辑

---

## 📌 核心功能拆解

| 模块       | 子功能                              | 是否需要登录 |
|------------|---------------------------------------|---------------|
| 首页       | Banner、介绍、导航                    | 否            |
| 成员介绍   | 头像 + 简介 + 分组展示                | 否            |
| 项目展示   | 图片 + 文案 + 标签过滤                | 否            |
| 博客功能   | 文章列表、文章详情                    | 否            |
| 联系方式   | 表单或链接                            | 否            |
| 登录系统   | 管理员登录（JWT）                     | 是            |
| 内容管理   | 博客文章的增删改查                    | 是            |
| 成员管理   | 管理成员头像、介绍                    | 是            |
| 项目管理   | 管理项目的图文展示                    | 是            |

---

## ✨ 界面风格与交互理念

- 🌿 **极简主义设计**：采用 TailwindCSS / UnoCSS
- 🔤 字体干净清晰，图文比例均衡
- 🚀 所有操作流畅（使用 loading 状态 + 弹窗反馈）
- 💬 鼓励使用 Markdown 编辑器，降低内容编写门槛
- 📱 响应式适配：支持 PC / 移动端访问

---

## 🛠 前端开发任务清单（Vue 3 + Vite）

### ✅ 基础搭建
- [ ] 项目初始化（Vite + Vue Router + Pinia）
- [ ] 路由设计（含前台与后台）
- [ ] 登录态管理（JWT 本地存储）

### ✅ 页面开发
- [ ] 首页设计（Banner + 简介）
- [ ] 成员页面（网格卡片 + 动画）
- [ ] 项目展示（卡片 + 分类过滤）
- [ ] 博客列表页（分页 + 摘要）
- [ ] 博客详情页（Markdown 渲染）

### ✅ 后台功能页（/admin）
- [ ] 登录页（账号密码）
- [ ] 控制台 Dashboard
- [ ] 内容管理（文章增删改查）
- [ ] 成员管理（上传头像 + 编辑）
- [ ] 项目管理（上传图文）

### ✅ 通用组件
- [ ] `Navbar.vue`
- [ ] `Footer.vue`
- [ ] `Card.vue`（项目/成员复用）
- [ ] `RichEditor.vue`（Markdown 编辑器）

---

## 📡 后端开发任务清单（Node.js + Express）

### ✅ 用户认证
- [ ] 登录接口 `/api/login`（JWT 返回）
- [ ] 鉴权中间件 `verifyToken`
- [ ] 权限校验（仅管理员可操作内容接口）

### ✅ API 模块
- [ ] `/api/articles`（内容发布管理）
- [ ] `/api/projects`（项目图文管理）
- [ ] `/api/members`（成员信息管理）

### ✅ 数据模型（MongoDB + Mongoose）
- [ ] User 模型（管理员）
- [ ] Article 模型（博客文章）
- [ ] Project 模型（图文项目）
- [ ] Member 模型（成员资料）

---

## 🔐 鉴权逻辑设计

```ts
前端：
- 登录成功保存 token 至 localStorage
- 请求时带上 Authorization: Bearer <token>

后端：
- 中间件读取 token -> 验证有效性
- 接口加权限保护：只允许 admin 用户访问管理功能
🔁 API 请求结构建议
ts
复制
编辑
// 统一封装 API 请求
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
🧪 开发节奏建议
阶段	时间	内容
初始化阶段	第1周	构建项目结构 + 登录系统搭建
前台开发阶段	第2周	实现各个展示页面
后台开发阶段	第3周	管理功能开发（文章、项目等）
联调优化阶段	第4周	接口对接 + UI 调整 + 部署

🚀 预期效果
📱 前端加载迅速，界面干净，体验轻快

🔒 后台权限清晰、安全、易操作

📝 内容可由管理者自主发布与更新

💻 鼓励编程人员参与内容创作（低门槛）

🛳 推荐部署方案
前端：部署至 Vercel / Netlify / Nginx 静态目录

后端：Node 使用 PM2 管理进程，部署于 Linux 云服务器

数据库：MongoDB Atlas（或本地 Docker）

📎 参考组件/库推荐
名称	说明
Vue Router	页面路由导航
Pinia	状态管理
axios	请求库
@vueuse	Composition API 工具库
vite-plugin-md	支持 Markdown 渲染
TailwindCSS	原子化样式，清晰开发体验
toast-ui 或 tiptap	富文本/Markdown 编辑器