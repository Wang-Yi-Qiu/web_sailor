<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">欢迎来到 StudioCMS</h1>
          <p class="hero-subtitle">专业的内容管理系统，助力您的团队官网建设</p>
          <div class="hero-buttons">
            <router-link to="/projects" class="btn btn-primary">查看项目</router-link>
            <router-link to="/contact" class="btn btn-secondary">联系我们</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>团队管理</h3>
            <p>完善的团队成员展示与管理功能，支持角色权限分级</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>项目展示</h3>
            <p>优雅的项目展示页面，全面展示团队作品与成果</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>博客系统</h3>
            <p>内置博客系统，支持富文本编辑，分享技术心得</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>权限控制</h3>
            <p>细粒度权限控制，确保数据安全与操作规范</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.projects }}</div>
            <div class="stat-label">项目数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.articles }}</div>
            <div class="stat-label">技术文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.members }}</div>
            <div class="stat-label">团队成员</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.users }}</div>
            <div class="stat-label">注册用户</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="recent-posts">
      <div class="container">
        <h2 class="section-title">最新文章</h2>
        <div class="posts-grid">
          <div v-for="post in recentPosts" :key="post.id" class="post-card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <div class="post-meta">
              <span>{{ post.author }}</span>
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </div>
        <div class="text-center">
          <router-link to="/blog" class="btn btn-primary">查看更多文章</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { articlesAPI, projectsAPI, membersAPI, usersAPI } from '../services/api.js'

const stats = ref({
  projects: 0,
  articles: 0,
  members: 0,
  users: 0
})

const recentPosts = ref([
  {
    id: 1,
    title: '欢迎使用 StudioCMS',
    excerpt: '这是一个功能完善的内容管理系统，专为团队官网设计...',
    author: '管理员',
    date: new Date()
  },
  {
    id: 2,
    title: 'Vue 3 开发最佳实践',
    excerpt: '分享 Vue 3 开发中的一些最佳实践和技巧...',
    author: '张三',
    date: new Date(Date.now() - 86400000)
  },
  {
    id: 3,
    title: '现代前端开发工作流',
    excerpt: '介绍现代前端开发中的工具链和工作流程...',
    author: '李四',
    date: new Date(Date.now() - 172800000)
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadStats = async () => {
  try {
    // Load stats from API - these might fail if backend isn't connected
    const [projectsRes, articlesRes, membersRes] = await Promise.allSettled([
      projectsAPI.getProjects(),
      articlesAPI.getArticles(),
      membersAPI.getMembers()
    ])

    if (projectsRes.status === 'fulfilled') {
      stats.value.projects = projectsRes.value.data.length
    }
    
    if (articlesRes.status === 'fulfilled') {
      stats.value.articles = articlesRes.value.data.length
      // Use real recent posts if available
      if (articlesRes.value.data.length > 0) {
        recentPosts.value = articlesRes.value.data.slice(0, 3).map(article => ({
          id: article._id,
          title: article.title,
          excerpt: article.content.substring(0, 100) + '...',
          author: article.author?.username || '匿名',
          date: new Date(article.createdAt)
        }))
      }
    }
    
    if (membersRes.status === 'fulfilled') {
      stats.value.members = membersRes.value.data.length
    }

    // Simulate user count for demo
    stats.value.users = 15
  } catch (error) {
    console.log('使用模拟数据显示统计信息')
    // Use demo data if API calls fail
    stats.value = {
      projects: 12,
      articles: 25,
      members: 8,
      users: 15
    }
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.stats {
  padding: 60px 0;
  background-color: #007bff;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.recent-posts {
  padding: 80px 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.post-card p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #999;
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>