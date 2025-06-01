# 🔄 StudioCMS 虚拟信息更新指南

> 本指南将帮助你系统性地将项目中的所有虚拟信息替换为真实信息

## 📋 更新清单

### ✅ **1. 联系信息** (最高优先级)

**文件**: `StudioCMS/frontend/src/views/ContactView.vue`

```javascript
// 在文件顶部的 contactInfo 对象中更新
const contactInfo = {
  email: 'your-email@domain.com',     // 替换为你的邮箱
  phone: '+86 138 0000 0000',         // 替换为你的电话
  address: '你的实际地址'              // 替换为你的地址
}
```

### ✅ **2. 团队成员信息**

#### 前台展示页面
**文件**: `StudioCMS/frontend/src/views/MembersView.vue`

需要更新的虚拟成员信息：
- **核心团队**: 张三(技术总监)、李四(产品经理)、王五(设计总监)
- **开发团队**: 赵六、孙七、周八、吴九

**更新步骤**:
1. 找到 `coreTeam` 和 `developmentTeam` 数组
2. 替换姓名、职位、简介、技能标签

#### 后台管理页面
**文件**: `StudioCMS/frontend/src/views/admin/MembersManageView.vue`

需要更新：
- 成员邮箱格式: `zhangsan@studio.com` → 你的域名
- 电话号码: `13800138001` → 真实号码
- 技能、入职时间等信息

### ✅ **3. 项目展示信息**

#### 前台展示页面  
**文件**: `StudioCMS/frontend/src/views/ProjectsView.vue`

虚拟项目列表：
```javascript
// 需要更新的示例项目
projects: [
  {
    title: 'StudioCMS 官网',        // 替换为你的项目
    description: '项目描述...',      // 替换为真实描述
    liveUrl: 'https://example.com', // 替换为真实链接
    githubUrl: 'https://github.com/studio/cms' // 替换为真实仓库
  }
  // ... 其他项目
]
```

#### 后台管理页面
**文件**: `StudioCMS/frontend/src/views/admin/ProjectsManageView.vue` 

### ✅ **4. 博客文章信息**

#### 前台展示页面
**文件**: `StudioCMS/frontend/src/views/BlogView.vue`

虚拟文章列表：
```javascript
// 需要更新的示例文章
articles: [
  {
    title: 'Vue 3 Composition API 深度解析',  // 替换为你的文章标题
    author: '张三',                          // 替换为真实作者
    summary: '文章摘要...'                   // 替换为真实摘要
  }
  // ... 其他文章
]
```

#### 后台管理页面
**文件**: `StudioCMS/frontend/src/views/admin/ArticlesView.vue`

### ✅ **5. 登录认证信息**

**文件**: `StudioCMS/frontend/src/views/LoginView.vue`

当前默认账号：
```javascript
// 开发环境自动填充的演示账号
username: 'admin'
password: 'admin123'
```

**安全建议**:
1. 修改默认用户名和密码
2. 在生产环境中移除自动填充功能
3. 更新后端的用户验证逻辑

**后端认证文件**: `StudioCMS/backend/routes/auth.js`

### ✅ **6. 公司品牌信息**

#### 导航栏
**文件**: `StudioCMS/frontend/src/components/AppNavbar.vue`
- 公司名称/Logo
- 导航菜单项

#### 首页
**文件**: `StudioCMS/frontend/src/views/HomeView.vue`  
- 公司介绍
- 欢迎文案
- 特色展示

#### 项目说明
**文件**: `StudioCMS/README.md`
- 项目描述
- 使用说明
- 部署指南

### ✅ **7. 后台统计数据**

**文件**: `StudioCMS/frontend/src/views/admin/DashboardView.vue`

虚拟统计数据：
```javascript
const stats = {
  articles: 12,      // 文章数量
  projects: 8,       // 项目数量  
  members: 6,        // 成员数量
  totalViews: 8432   // 总访问量
}
```

### ✅ **8. API 服务配置**

**文件**: `StudioCMS/frontend/src/services/api.ts`
- API 基础URL
- 请求头配置
- 错误处理

## 🚀 **分步骤更新建议**

### **阶段一: 基础信息** (第1天)
1. ✅ 更新联系信息 (ContactView.vue)
2. ✅ 修改登录账号密码 
3. ✅ 更新公司名称和品牌

### **阶段二: 内容数据** (第2-3天)  
1. ✅ 替换团队成员信息
2. ✅ 更新项目展示内容
3. ✅ 修改博客文章数据

### **阶段三: 后台管理** (第4-5天)
1. ✅ 更新后台统计数据
2. ✅ 配置API服务
3. ✅ 测试所有功能

## 💡 **更新技巧**

### **1. 批量搜索替换**
使用代码编辑器的全局搜索功能：
- 搜索 "张三" → 替换为真实姓名
- 搜索 "contact@studiocms.com" → 替换为真实邮箱
- 搜索 "13800138" → 替换为真实电话前缀

### **2. 创建配置文件**
建议创建统一的配置文件来管理所有信息：

```javascript
// config/site.js
export const siteConfig = {
  company: {
    name: '你的公司名称',
    email: 'your@email.com',
    phone: '+86 138 0000 0000',
    address: '你的地址'
  },
  social: {
    github: 'https://github.com/yourusername',
    website: 'https://yourwebsite.com'
  }
}
```

### **3. 图片资源**
别忘了更新：
- Logo 图片
- 团队成员头像
- 项目展示图片
- 公司相关图片

### **4. 域名和链接**
检查并更新所有：
- 演示链接 (example.com)
- GitHub 仓库链接
- 社交媒体链接
- 图片资源链接

## ⚠️ **重要提醒**

1. **备份原始数据**: 更新前建议备份当前版本
2. **分批测试**: 每更新一部分就测试一次功能
3. **安全考虑**: 生产环境前务必修改所有默认密码
4. **SEO优化**: 更新页面标题、描述等元信息
5. **响应式检查**: 确保新内容在移动端显示正常

## 📝 **更新检查清单**

- [ ] 联系信息 (邮箱、电话、地址)
- [ ] 团队成员 (姓名、职位、简介、技能)  
- [ ] 项目展示 (标题、描述、链接)
- [ ] 博客文章 (标题、作者、内容)
- [ ] 登录账号 (用户名、密码)
- [ ] 公司品牌 (名称、Logo、介绍)
- [ ] 统计数据 (数量、访问量)
- [ ] 图片资源 (头像、Logo、项目图)
- [ ] 链接地址 (域名、社交媒体)
- [ ] 配置文件 (API、环境变量)

---

✨ **更新完成后，你将拥有一个完全个性化的工作室网站！** 