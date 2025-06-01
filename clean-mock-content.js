#!/usr/bin/env node

/**
 * 🧹 清理剩余虚拟内容脚本
 * 
 * 用途：清理或简化剩余的虚拟团队成员、项目和文章
 * 使用：node clean-mock-content.js
 */

const fs = require('fs')

// 🔧 配置选项
const CONFIG = {
  // 是否保留虚拟成员（false = 只保留创始人）
  keepVirtualMembers: false,
  
  // 是否保留虚拟项目（false = 清空项目列表）
  keepVirtualProjects: false,
  
  // 是否保留虚拟文章（false = 清空文章列表）
  keepVirtualArticles: false,
  
  // 创始人信息（用于替换虚拟成员）
  founder: {
    name: 'sailor',
    role: '创始人 & 全栈开发 & 也喜欢搞一些嵌入式 & ai大模型 但是都不精通',
    bio: '一个对编程感兴趣并且长时间深耕的编程cool！',
    skills: ['Vue.js', 'Node.js', 'TypeScript', '全栈开发'],
    email: '19715531912@139.com'
  }
}

/**
 * 📝 清理团队成员页面
 */
function cleanMembersView() {
  const filePath = 'StudioCMS/frontend/src/views/MembersView.vue'
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️ 文件不存在:', filePath)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  if (!CONFIG.keepVirtualMembers) {
    // 只保留创始人，清理其他虚拟成员
    const newCoreTeam = `const coreTeam = ref<Member[]>([
  {
    id: 1,
    name: '${CONFIG.founder.name}',
    role: '${CONFIG.founder.role}',
    bio: '${CONFIG.founder.bio}',
    skills: ${JSON.stringify(CONFIG.founder.skills)},
    team: 'core'
  }
])`

    const newDevelopmentTeam = `const developmentTeam = ref<Member[]>([
  // 🔄 团队正在扩建中，敬请期待更多成员加入...
])`

    // 替换核心团队数据
    content = content.replace(
      /const coreTeam = ref<Member\[\]>\(\[[\s\S]*?\]\)/,
      newCoreTeam
    )
    
    // 替换开发团队数据
    content = content.replace(
      /const developmentTeam = ref<Member\[\]>\(\[[\s\S]*?\]\)/,
      newDevelopmentTeam
    )
    
    console.log('✅ 已清理团队成员页面，只保留创始人信息')
  }
  
  // 备份并写入
  fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath))
  fs.writeFileSync(filePath, content)
}

/**
 * 🚀 清理项目展示页面
 */
function cleanProjectsView() {
  const filePath = 'StudioCMS/frontend/src/views/ProjectsView.vue'
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️ 文件不存在:', filePath)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  if (!CONFIG.keepVirtualProjects) {
    // 清空项目列表
    const newProjects = `const projects = ref<Project[]>([
  // 🔄 项目开发中，敬请期待精彩作品...
  // 
  // 示例项目格式：
  // {
  //   id: 1,
  //   title: '你的项目名称',
  //   description: '项目描述...',
  //   category: 'Web开发',
  //   technologies: ['Vue.js', 'Node.js'],
  //   status: 'completed',
  //   liveUrl: 'https://your-project.com',
  //   githubUrl: 'https://github.com/yourusername/project',
  //   createdAt: '2024-01-15'
  // }
])`

    content = content.replace(
      /const projects = ref<Project\[\]>\(\[[\s\S]*?\]\)/,
      newProjects
    )
    
    console.log('✅ 已清理项目展示页面，等待添加真实项目')
  }
  
  fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath))
  fs.writeFileSync(filePath, content)
}

/**
 * 📝 清理博客页面
 */
function cleanBlogView() {
  const filePath = 'StudioCMS/frontend/src/views/BlogView.vue'
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️ 文件不存在:', filePath)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  if (!CONFIG.keepVirtualArticles) {
    // 清空文章列表
    const newArticles = `const articles = ref<Article[]>([
  // 🔄 文章创作中，敬请期待技术分享...
  //
  // 示例文章格式：
  // {
  //   id: 1,
  //   title: '你的文章标题',
  //   summary: '文章摘要...',
  //   content: '详细内容...',
  //   category: '技术分享',
  //   author: '${CONFIG.founder.name}',
  //   publishedAt: '2024-01-15',
  //   featured: false
  // }
])`

    content = content.replace(
      /const articles = ref<Article\[\]>\(\[[\s\S]*?\]\)/,
      newArticles
    )
    
    console.log('✅ 已清理博客页面，等待添加真实文章')
  }
  
  fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath))
  fs.writeFileSync(filePath, content)
}

/**
 * 🔧 清理后台管理页面的虚拟数据
 */
function cleanAdminPages() {
  const files = [
    'StudioCMS/frontend/src/views/admin/MembersManageView.vue',
    'StudioCMS/frontend/src/views/admin/ProjectsManageView.vue', 
    'StudioCMS/frontend/src/views/admin/ArticlesView.vue'
  ]
  
  files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log('⚠️ 文件不存在:', filePath)
      return
    }
    
    let content = fs.readFileSync(filePath, 'utf8')
    
    // 替换虚拟成员姓名
    const virtualNames = ['李四', '王五', '赵六', '孙七', '周八', '吴九']
    virtualNames.forEach(name => {
      content = content.replaceAll(name, '待补充成员')
    })
    
    // 替换虚拟邮箱
    content = content.replaceAll(/@studio\.com/g, '@' + 'www.edutop.top')
    content = content.replaceAll(/zhangsan@/g, 'sailor@')
    content = content.replaceAll(/lisi@/g, 'member1@')
    
    // 替换虚拟链接
    content = content.replaceAll(/https:\/\/example\.com/g, '#')
    content = content.replaceAll(/https:\/\/task-app\.com/g, '#')
    content = content.replaceAll(/github\.com\/studio\//g, 'github.com/Wang-Yi-Qiu/')
    
    fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath))
    fs.writeFileSync(filePath, content)
  })
  
  console.log('✅ 已清理后台管理页面的虚拟数据')
}

/**
 * 📊 更新统计数据
 */
function updateDashboardStats() {
  const filePath = 'StudioCMS/frontend/src/views/admin/DashboardView.vue'
  
  if (!fs.existsSync(filePath)) {
    console.log('⚠️ 文件不存在:', filePath)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  // 更新为更真实的初始数据
  const newStats = `const stats = ref({
  articles: 0,      // 文章数量
  newArticles: 0,   // 新增文章
  projects: 0,      // 项目数量
  newProjects: 0,   // 新增项目
  members: 1,       // 成员数量（创始人）
  activeMembers: 1, // 活跃成员
  totalViews: 0,    // 总访问量
  monthlyViews: 0   // 月访问量
})`

  content = content.replace(
    /const stats = ref\(\{[\s\S]*?\}\)/,
    newStats
  )
  
  // 更新活动记录
  const newActivities = `const recentActivities = ref([
  {
    id: 1,
    icon: '🎉',
    title: 'sailor工作室成立',
    description: '工作室正式成立，开始技术创新之旅',
    time: '刚刚'
  },
  {
    id: 2,
    icon: '🌟',
    title: '网站上线',
    description: '工作室官网正式上线运行',
    time: '1小时前'
  }
])`

  content = content.replace(
    /const recentActivities = ref\(\[[\s\S]*?\]\)/,
    newActivities
  )
  
  fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath))
  fs.writeFileSync(filePath, content)
  
  console.log('✅ 已更新仪表板统计数据')
}

/**
 * 🎯 主执行函数
 */
function main() {
  console.log('🧹 开始清理虚拟内容...\n')
  
  console.log('📋 清理配置:')
  console.log(`   - 保留虚拟成员: ${CONFIG.keepVirtualMembers ? '是' : '否'}`)
  console.log(`   - 保留虚拟项目: ${CONFIG.keepVirtualProjects ? '是' : '否'}`)
  console.log(`   - 保留虚拟文章: ${CONFIG.keepVirtualArticles ? '是' : '否'}`)
  console.log('')
  
  // 执行清理
  cleanMembersView()
  cleanProjectsView()
  cleanBlogView()
  cleanAdminPages()
  updateDashboardStats()
  
  console.log('\n✨ 虚拟内容清理完成！')
  console.log('\n📋 接下来建议：')
  console.log('1. 刷新浏览器查看效果')
  console.log('2. 逐步添加真实的项目和文章内容')
  console.log('3. 上传真实的Logo和头像图片')
  console.log('4. 删除 .backup 备份文件（确认无误后）')
}

// 运行脚本
if (require.main === module) {
  main()
}

module.exports = { cleanMembersView, cleanProjectsView, cleanBlogView } 