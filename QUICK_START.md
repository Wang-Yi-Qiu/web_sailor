# ⚡ 快速更新虚拟信息指南

> 5分钟快速将项目虚拟信息替换为你的真实信息

## 🎯 **方法一：使用自动化脚本 (推荐)**

### 第1步: 配置信息
编辑 `update-mock-data.js` 文件中的 `USER_CONFIG` 部分：

```javascript
const USER_CONFIG = {
  companyName: '你的公司名称',           // 🔴 必填
  email: 'your-email@domain.com',      // 🔴 必填
  phone: '+86 138 0000 0000',          // 🔴 必填
  address: '你的真实地址',              // 🔴 必填
  founderName: '你的姓名',              // 🔴 必填
  domain: 'yourdomain.com',            // 🔴 必填
  // ... 其他配置
}
```

### 第2步: 运行脚本
```bash
node update-mock-data.js
```

### 第3步: 检查结果
检查生成的 `.backup` 文件，确认更新正确后删除备份文件。

---

## 🛠 **方法二：手动更新 (精确控制)**

### 📞 **1. 联系信息** (最重要)
**文件**: `StudioCMS/frontend/src/views/ContactView.vue`

找到并替换：
```javascript
const contactInfo = {
  email: 'contact@studiocms.com',     // 👈 改这里
  phone: '+86 123 4567 8900',         // 👈 改这里  
  address: '北京市朝阳区创意大厦'       // 👈 改这里
}
```

### 👥 **2. 团队成员** 
**文件**: `StudioCMS/frontend/src/views/MembersView.vue`

搜索 `张三`、`李四`、`王五` 等虚拟姓名，替换为真实成员信息。

### 🚀 **3. 项目展示**
**文件**: `StudioCMS/frontend/src/views/ProjectsView.vue`

搜索 `StudioCMS 官网`，替换为你的真实项目。

### 📝 **4. 博客文章**
**文件**: `StudioCMS/frontend/src/views/BlogView.vue`

搜索虚拟文章标题，替换为你的真实文章。

### 🔐 **5. 登录密码** (安全重要)
**文件**: `StudioCMS/frontend/src/views/LoginView.vue`

搜索 `admin123`，替换为安全密码。

---

## 📋 **快速检查清单**

- [ ] ✅ 邮箱地址已更新
- [ ] ✅ 电话号码已更新  
- [ ] ✅ 公司地址已更新
- [ ] ✅ 团队成员姓名已更新
- [ ] ✅ 项目信息已更新
- [ ] ✅ 管理员密码已修改
- [ ] ✅ 公司名称已更新
- [ ] ✅ 所有虚拟链接已更新

## 🔍 **批量搜索替换**

使用代码编辑器的全局搜索功能：

```
搜索: 张三          替换为: 你的姓名
搜索: contact@      替换为: your-email@
搜索: +86 123       替换为: +86 138
搜索: StudioCMS     替换为: 你的公司名
搜索: admin123      替换为: 你的密码
```

## ⚡ **超快速3步法**

如果你时间很紧，至少做这3步：

1. **更新联系信息** → `ContactView.vue`
2. **修改管理密码** → `LoginView.vue` 
3. **替换公司名称** → 全局搜索 `StudioCMS`

## 🎉 **完成后**

1. 刷新浏览器测试网站
2. 登录后台检查管理功能
3. 逐步添加真实的项目和文章内容

---

💡 **提示**: 建议先使用自动化脚本批量替换基础信息，再手动精细调整具体内容。 