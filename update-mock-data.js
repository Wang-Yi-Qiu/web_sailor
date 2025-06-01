#!/usr/bin/env node

/**
 * 🔄 StudioCMS 虚拟数据批量替换脚本
 * 
 * 使用方法：
 * 1. 修改下面的 USER_CONFIG 配置
 * 2. 运行：node update-mock-data.js
 * 3. 检查更新结果并测试功能
 */

const fs = require('fs')
const path = require('path')

// 🔧 用户配置 - 请在这里填写你的真实信息
const USER_CONFIG = {
  // 👤 个人/公司信息
  companyName: 'sailor',
  companyFullName: 'sailor工作室',
  companyDescription: '一个爱好编程人员的开发者根据地',
  
  // 📞 联系信息
  email: '19715531912@139.com',
  phone: '+86 19715531912',
  address: '河南牧业经济学院北林校区sailor工作室',
  website: '暂无',
  
  // 🌐 社交媒体
  github: 'https://github.com/Wang-Yi-Qiu/',
  
  // 👥 创始人信息
  founderName: 'sailor',
  founderRole: '阮宇鹏',
  founderBio: '一个队编程感兴趣并且长时间深耕的编程cool！',
  
  // 🔐 管理员账号 (建议修改)
  adminUsername: 'admin',
  adminPassword: '123456',
  
  // 域名信息
  domain: 'www.edutop.top'
}

// 📝 替换规则配置
const REPLACEMENT_RULES = [
  // 公司名称
  { search: 'StudioCMS', replace: USER_CONFIG.companyName },
  { search: 'StudioCMS 创意工作室', replace: USER_CONFIG.companyFullName },
  
  // 联系信息
  { search: 'contact@studiocms.com', replace: USER_CONFIG.email },
  { search: '+86 123 4567 8900', replace: USER_CONFIG.phone },
  { search: '北京市朝阳区创意大厦', replace: USER_CONFIG.address },
  
  // 虚拟人员姓名
  { search: '张三', replace: USER_CONFIG.founderName },
  { search: '技术总监', replace: USER_CONFIG.founderRole },
  
  // 邮箱域名
  { search: '@studio.com', replace: `@${USER_CONFIG.domain}` },
  { search: 'studiocms.com', replace: USER_CONFIG.domain },
  
  // 社交媒体
  { search: 'https://github.com/studiocms', replace: USER_CONFIG.github },
  
  // 默认密码提醒
  { search: 'admin123', replace: USER_CONFIG.adminPassword },
  
  // 电话号码前缀
  { search: '13800138', replace: '138000' },  // 示例：改为你的号码前缀
]

// 📁 需要处理的文件列表
const TARGET_FILES = [
  'StudioCMS/frontend/src/views/ContactView.vue',
  'StudioCMS/frontend/src/views/MembersView.vue',
  'StudioCMS/frontend/src/views/admin/MembersManageView.vue',
  'StudioCMS/frontend/src/views/ProjectsView.vue',
  'StudioCMS/frontend/src/views/admin/ProjectsManageView.vue',
  'StudioCMS/frontend/src/views/BlogView.vue',
  'StudioCMS/frontend/src/views/admin/ArticlesView.vue',
  'StudioCMS/frontend/src/views/LoginView.vue',
  'StudioCMS/frontend/src/views/admin/DashboardView.vue',
  'StudioCMS/frontend/src/components/AppNavbar.vue',
  'StudioCMS/backend/routes/auth.js',
  'StudioCMS/README.md'
]

/**
 * 🔍 检查配置是否已更新
 */
function validateUserConfig() {
  const errors = []
  
  if (USER_CONFIG.companyName === '你的公司名称') {
    errors.push('请更新 companyName')
  }
  
  if (USER_CONFIG.email === 'your-email@domain.com') {
    errors.push('请更新 email')
  }
  
  if (USER_CONFIG.phone === '+86 138 0000 0000') {
    errors.push('请更新 phone')
  }
  
  if (USER_CONFIG.founderName === '你的姓名') {
    errors.push('请更新 founderName')
  }
  
  if (errors.length > 0) {
    console.log('❌ 配置验证失败，请先更新以下配置：')
    errors.forEach(error => console.log(`   - ${error}`))
    process.exit(1)
  }
  
  console.log('✅ 配置验证通过')
}

/**
 * 📝 处理单个文件
 */
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在，跳过: ${filePath}`)
      return
    }
    
    let content = fs.readFileSync(filePath, 'utf8')
    let hasChanges = false
    
    // 应用所有替换规则
    REPLACEMENT_RULES.forEach(rule => {
      const oldContent = content
      content = content.replaceAll(rule.search, rule.replace)
      if (content !== oldContent) {
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      // 备份原文件
      const backupPath = filePath + '.backup'
      fs.writeFileSync(backupPath, fs.readFileSync(filePath))
      
      // 写入更新后的内容
      fs.writeFileSync(filePath, content)
      console.log(`✅ 已更新: ${filePath}`)
    } else {
      console.log(`📋 无需更新: ${filePath}`)
    }
    
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
  }
}

/**
 * 🗂️ 创建备份
 */
function createBackup() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const backupDir = `backup-${timestamp}`
  
  console.log(`📦 创建备份目录: ${backupDir}`)
  // 这里可以添加更完整的备份逻辑
}

/**
 * 🎯 主执行函数
 */
function main() {
  console.log('🚀 开始批量更新虚拟数据...\n')
  
  // 1. 验证配置
  validateUserConfig()
  
  // 2. 创建备份
  createBackup()
  
  // 3. 处理所有文件
  console.log('📝 开始处理文件...')
  TARGET_FILES.forEach(processFile)
  
  console.log('\n✨ 批量更新完成！')
  console.log('\n📋 接下来请：')
  console.log('1. 检查更新结果')
  console.log('2. 测试网站功能')
  console.log('3. 删除 .backup 备份文件（确认无误后）')
  console.log('4. 手动更新图片资源（头像、Logo等）')
  console.log('5. 更新项目和文章的具体内容')
}

// 🏃 运行脚本
if (require.main === module) {
  main()
}

module.exports = {
  USER_CONFIG,
  REPLACEMENT_RULES,
  processFile,
  validateUserConfig
} 