<template>
  <div class="projects-page">
    <!-- Header Section -->
    <section class="projects-header">
      <div class="container">
        <h1>项目展示</h1>
        <p>探索我们的创新项目和技术成果</p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="projects-filter">
      <div class="container">
        <div class="filter-buttons">
          <button 
            @click="setFilter('all')"
            :class="['filter-btn', { active: currentFilter === 'all' }]"
          >
            全部项目
          </button>
          <button 
            @click="setFilter('web')"
            :class="['filter-btn', { active: currentFilter === 'web' }]"
          >
            Web应用
          </button>
          <button 
            @click="setFilter('mobile')"
            :class="['filter-btn', { active: currentFilter === 'mobile' }]"
          >
            移动应用
          </button>
          <button 
            @click="setFilter('cms')"
            :class="['filter-btn', { active: currentFilter === 'cms' }]"
          >
            内容管理
          </button>
        </div>
      </div>
    </section>

    <!-- Projects Grid Section -->
    <section class="projects-content">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载项目...</p>
        </div>
        
        <div v-else class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id" 
            class="project-card"
          >
            <div class="project-image">
              <img 
                :src="project.image || defaultImage" 
                :alt="project.name"
                @error="handleImageError"
              />
              <div class="project-overlay">
                <div class="project-actions">
                  <a 
                    v-if="project.demoUrl" 
                    :href="project.demoUrl" 
                    target="_blank"
                    class="action-btn"
                    title="查看演示"
                  >
                    🔗 演示
                  </a>
                  <a 
                    v-if="project.githubUrl" 
                    :href="project.githubUrl" 
                    target="_blank"
                    class="action-btn"
                    title="查看源码"
                  >
                    🐙 源码
                  </a>
                </div>
              </div>
            </div>
            
            <div class="project-info">
              <div class="project-category">{{ getCategoryName(project.category) }}</div>
              <h3>{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-tech" v-if="project.technologies && project.technologies.length">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
              
              <div class="project-meta">
                <span class="project-status" :class="project.status">
                  {{ getStatusName(project.status) }}
                </span>
                <span class="project-date">{{ formatDate(project.date) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && filteredProjects.length === 0" class="no-projects">
          <p>{{ currentFilter === 'all' ? '暂无项目' : '该分类下暂无项目' }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="projects-cta">
      <div class="container">
        <div class="cta-content">
          <h2>有项目想法？</h2>
          <p>我们乐于与您合作，将您的想法变为现实。无论是网站开发、移动应用还是企业系统，我们都有经验丰富的团队为您服务。</p>
          <router-link to="/contact" class="btn btn-primary">开始合作</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { projectsAPI } from '../services/api.js'

const projects = ref([])
const loading = ref(true)
const currentFilter = ref('all')
const defaultImage = 'https://via.placeholder.com/400x250/007bff/ffffff?text=Project'

// Demo projects data
const demoProjects = [
  {
    id: 1,
    name: 'StudioCMS 官网',
    description: '基于 Vue 3 和 Node.js 的现代化内容管理系统，支持多用户权限管理和富文本编辑。',
    image: '',
    category: 'cms',
    status: 'completed',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/studiocms',
    date: new Date('2024-01-15')
  },
  {
    id: 2,
    name: '电商管理平台',
    description: '全功能电商后台管理系统，包含商品管理、订单处理、用户管理等核心功能。',
    image: '',
    category: 'web',
    status: 'completed',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    demoUrl: 'https://example.com/ecommerce',
    githubUrl: 'https://github.com/example/ecommerce',
    date: new Date('2023-11-20')
  },
  {
    id: 3,
    name: '移动端阅读应用',
    description: '跨平台移动阅读应用，支持在线阅读、离线下载、个性化推荐等功能。',
    image: '',
    category: 'mobile',
    status: 'completed',
    technologies: ['React Native', 'Redux', 'Firebase'],
    demoUrl: 'https://example.com/reading-app',
    date: new Date('2023-09-10')
  },
  {
    id: 4,
    name: '企业协作平台',
    description: '面向企业的在线协作平台，集成项目管理、文档协作、即时通讯等功能。',
    image: '',
    category: 'web',
    status: 'in-progress',
    technologies: ['Vue.js', 'Nest.js', 'WebSocket', 'Redis'],
    githubUrl: 'https://github.com/example/collaboration',
    date: new Date('2024-02-01')
  },
  {
    id: 5,
    name: '智能博客系统',
    description: '基于 AI 的智能博客系统，支持自动分类、智能推荐、SEO优化等功能。',
    image: '',
    category: 'cms',
    status: 'in-progress',
    technologies: ['Next.js', 'Python', 'TensorFlow', 'Elasticsearch'],
    date: new Date('2024-03-15')
  },
  {
    id: 6,
    name: '健身管理App',
    description: '个人健身管理移动应用，包含运动计划、营养追踪、社交分享等功能。',
    image: '',
    category: 'mobile',
    status: 'planning',
    technologies: ['Flutter', 'Dart', 'Firebase', 'Machine Learning'],
    date: new Date('2024-04-01')
  }
]

const filteredProjects = computed(() => {
  if (currentFilter.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project => project.category === currentFilter.value)
})

const setFilter = (filter) => {
  currentFilter.value = filter
}

const getCategoryName = (category) => {
  const categories = {
    web: 'Web应用',
    mobile: '移动应用',
    cms: '内容管理',
    other: '其他'
  }
  return categories[category] || '其他'
}

const getStatusName = (status) => {
  const statuses = {
    completed: '已完成',
    'in-progress': '进行中',
    planning: '计划中',
    paused: '暂停'
  }
  return statuses[status] || '未知'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  })
}

const handleImageError = (event) => {
  event.target.src = defaultImage
}

const loadProjects = async () => {
  try {
    const response = await projectsAPI.getProjects()
    if (response.data && response.data.length > 0) {
      projects.value = response.data
    } else {
      // Use demo data if no projects from API
      projects.value = demoProjects
    }
  } catch (error) {
    console.log('使用演示数据显示项目')
    // Use demo data if API call fails
    projects.value = demoProjects
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.projects-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.projects-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.projects-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.projects-filter {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e1e1e1;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e1e1e1;
  background: white;
  color: #666;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.projects-content {
  padding: 60px 0;
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.project-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 10px 20px;
  background: white;
  color: #333;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: transform 0.3s;
}

.action-btn:hover {
  transform: scale(1.05);
}

.project-info {
  padding: 1.5rem;
}

.project-category {
  color: #007bff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.project-info h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-status {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-status.completed {
  background: #d4edda;
  color: #155724;
}

.project-status.in-progress {
  background: #fff3cd;
  color: #856404;
}

.project-status.planning {
  background: #cce5ff;
  color: #004085;
}

.project-status.paused {
  background: #f8d7da;
  color: #721c24;
}

.project-date {
  color: #999;
  font-size: 0.9rem;
}

.no-projects {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.projects-cta {
  background: #f8f9fa;
  padding: 60px 0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.cta-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .projects-header h1 {
    font-size: 2rem;
  }
  
  .projects-content {
    padding: 40px 0;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-buttons {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .project-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cta-content h2 {
    font-size: 1.5rem;
  }
}
</style>