# StudioCMS 最终版说明文档

## 项目简介

StudioCMS 是一套基于 **Vue 3 + Vite + Pinia** 前端、**Node.js + Express + MongoDB** 后端的全栈内容管理系统。支持团队博客、项目展示、成员管理、权限分级、文件上传等功能，适合工作室、团队官网、技术社区等场景。

---

## 目录结构

```
StudioCMS/
├── backend/      # Node.js + Express 后端
│   ├── config/         # 配置文件（如数据库）
│   ├── controllers/    # 业务控制器
│   ├── middleware/     # 中间件（鉴权等）
│   ├── models/         # Mongoose 数据模型
│   ├── routes/         # API 路由
│   ├── uploads/        # 上传文件存储目录
│   ├── utils/          # 工具函数
│   ├── index.js        # 后端入口
│   └── package.json    # 后端依赖
├── frontend/     # Vue 3 + Vite 前端
│   ├── src/
│   │   ├── components/ # 通用组件
│   │   ├── views/      # 页面组件
│   │   ├── services/   # API 封装
│   │   ├── stores/     # Pinia 状态管理
│   │   └── ...         # 其他前端资源
│   ├── public/         # 静态资源
│   ├── index.html      # 入口 HTML
│   └── package.json    # 前端依赖
└── docs/         # 其他文档（已清空）
```

---

## 主要功能

- **用户系统**：注册、登录、登出、个人信息、密码修改
- **权限管理**：支持超级管理员、管理员、普通用户分级，细粒度权限控制
- **角色管理**：自定义角色及权限
- **成员管理**：团队成员信息展示与后台管理
- **项目管理**：项目内容展示与后台管理
- **博客系统**：文章发布、编辑、删除、浏览
- **文件上传**：支持图片/文档上传，限制类型和大小
- **富文本编辑器**：支持图片上传，禁用拖拽上传
- **API 安全**：JWT 鉴权，接口权限校验
- **响应式设计**：适配 PC 和移动端

---

## 快速启动

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 配置环境变量

在 `backend` 目录下新建 `.env` 文件：

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studiocms
JWT_SECRET=your-secret-key
```

### 3. 启动服务

```bash
# 启动后端
cd backend
npm run dev

# 启动前端
cd ../frontend
npm run dev
```

前端默认端口：5173  
后端默认端口：5000

---

## 部署建议

- 前端可用 Vercel/Netlify/Nginx 静态托管
- 后端推荐用 PM2/Nginx/云服务器部署
- 数据库可用本地 MongoDB 或 MongoDB Atlas 云服务

---

## 常用 API 说明

- `/api/auth/register`  用户注册
- `/api/auth/login`     用户登录
- `/api/auth/logout`    用户登出
- `/api/auth/me`        获取当前用户信息
- `/api/users`          用户管理（需管理员权限）
- `/api/roles`          角色管理（需管理员权限）
- `/api/permissions`    权限列表（需管理员权限）
- `/api/upload`         文件上传（需登录）
- `/uploads/`           上传文件访问路径

---

## 其他说明

- **所有用户数据存储在 MongoDB 的 `users` 集合中**
- **上传文件存储在 backend/uploads 目录，URL 以 /uploads/ 开头**
- **富文本编辑器禁用拖拽上传，仅支持按钮上传**
- **如需二次开发，建议先阅读 models、controllers、routes 目录下的代码**

---

如需详细部署、二次开发、API 文档或遇到问题，欢迎联系项目维护者。 