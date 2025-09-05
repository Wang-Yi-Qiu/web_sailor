<template>
  <div class="blog-page">
    <!-- Header Section -->
    <section class="blog-header">
      <div class="container">
        <h1>技术博客</h1>
        <p>分享我们的技术心得和行业见解</p>
      </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="blog-controls">
      <div class="container">
        <div class="controls-row">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="search-input"
            />
            <button class="search-btn">🔍</button>
          </div>
          
          <div class="filter-select">
            <select v-model="selectedCategory" class="category-select">
              <option value="">全部分类</option>
              <option value="frontend">前端开发</option>
              <option value="backend">后端开发</option>
              <option value="devops">运维部署</option>
              <option value="design">设计</option>
              <option value="tutorial">教程</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Grid Section -->
    <section class="blog-content">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载文章...</p>
        </div>
        
        <div v-else class="articles-grid">
          <article 
            v-for="article in filteredArticles" 
            :key="article.id" 
            class="article-card"
            @click="viewArticle(article)"
          >
            <div class="article-image">
              <img 
                :src="article.image || defaultImage" 
                :alt="article.title"
                @error="handleImageError"
              />
              <div class="article-category">{{ getCategoryName(article.category) }}</div>
            </div>
            
            <div class="article-content">
              <h3>{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-meta">
                <div class="author-info">
                  <img 
                    :src="article.author?.avatar || defaultAvatar" 
                    :alt="article.author?.name"
                    class="author-avatar"
                    @error="handleAvatarError"
                  />
                  <span class="author-name">{{ article.author?.name || '匿名' }}</span>
                </div>
                
                <div class="article-stats">
                  <span class="article-date">{{ formatDate(article.date) }}</span>
                  <span class="read-time">{{ article.readTime || '5' }} 分钟阅读</span>
                </div>
              </div>
              
              <div class="article-tags" v-if="article.tags && article.tags.length">
                <span 
                  v-for="tag in article.tags.slice(0, 3)" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
        
        <div v-if="!loading && filteredArticles.length === 0" class="no-articles">
          <p>{{ searchQuery || selectedCategory ? '没有找到相关文章' : '暂无文章' }}</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="!loading && filteredArticles.length > 0" class="pagination">
          <button 
            class="btn btn-secondary"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          
          <button 
            class="btn btn-secondary"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>订阅我们的博客</h2>
          <p>获取最新的技术文章和行业动态，直接发送到您的邮箱</p>
          <form @submit.prevent="subscribe" class="subscribe-form">
            <input
              v-model="email"
              type="email"
              placeholder="请输入您的邮箱地址"
              required
              class="email-input"
            />
            <button type="submit" class="btn btn-primary" :disabled="subscribing">
              {{ subscribing ? '订阅中...' : '订阅' }}
            </button>
          </form>
          <div v-if="subscribeMessage" :class="subscribeStatus">
            {{ subscribeMessage }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articlesAPI } from '../services/api.js'

const router = useRouter()

const articles = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const articlesPerPage = 9

const email = ref('')
const subscribing = ref(false)
const subscribeMessage = ref('')
const subscribeStatus = ref('')

const defaultImage = 'https://via.placeholder.com/400x250/007bff/ffffff?text=Article'
const defaultAvatar = 'https://via.placeholder.com/40x40/28a745/ffffff?text=A'

// Demo articles data
const demoArticles = [
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '深入探讨 Vue 3 Composition API 的设计理念、使用方法和最佳实践，帮助开发者更好地理解和使用这个强大的功能。',
    content: '详细内容...',
    image: '',
    category: 'frontend',
    tags: ['Vue.js', 'JavaScript', 'Web开发'],
    author: {
      id: 1,
      name: '张三',
      avatar: ''
    },
    date: new Date('2024-03-15'),
    readTime: 8
  },
  {
    id: 2,
    title: 'Node.js 性能优化实战指南',
    excerpt: '分享 Node.js 应用性能优化的实战经验，包括内存管理、CPU优化、数据库查询优化等方面的技巧。',
    content: '详细内容...',
    image: '',
    category: 'backend',
    tags: ['Node.js', '性能优化', '后端开发'],
    author: {
      id: 2,
      name: '李四',
      avatar: ''
    },
    date: new Date('2024-03-10'),
    readTime: 12
  },
  {
    id: 3,
    title: 'Docker 容器化部署最佳实践',
    excerpt: '介绍 Docker 容器化部署的最佳实践，包括镜像优化、多阶段构建、安全配置等内容。',
    content: '详细内容...',
    image: '',
    category: 'devops',
    tags: ['Docker', '容器化', '部署'],
    author: {
      id: 3,
      name: '王五',
      avatar: ''
    },
    date: new Date('2024-03-05'),
    readTime: 10
  },
  {
    id: 4,
    title: '现代 Web 设计趋势与用户体验',
    excerpt: '探讨 2024 年 Web 设计的最新趋势，包括极简主义、深色模式、微交互等设计理念对用户体验的影响。',
    content: '详细内容...',
    image: '',
    category: 'design',
    tags: ['Web设计', 'UX', '用户体验'],
    author: {
      id: 4,
      name: '赵六',
      avatar: ''
    },
    date: new Date('2024-02-28'),
    readTime: 6
  },
  {
    id: 5,
    title: 'TypeScript 高级类型系统详解',
    excerpt: 'TypeScript 高级类型系统的详细讲解，包括联合类型、交叉类型、条件类型、映射类型等高级特性。',
    content: '详细内容...',
    image: '',
    category: 'frontend',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    author: {
      id: 1,
      name: '张三',
      avatar: ''
    },
    date: new Date('2024-02-25'),
    readTime: 15
  },
  {
    id: 6,
    title: 'MongoDB 数据建模与性能优化',
    excerpt: '深入了解 MongoDB 的数据建模原则和性能优化技巧，帮助开发者构建高效的数据库架构。',
    content: '详细内容...',
    image: '',
    category: 'backend',
    tags: ['MongoDB', '数据库', '性能优化'],
    author: {
      id: 2,
      name: '李四',
      avatar: ''
    },
    date: new Date('2024-02-20'),
    readTime: 9
  }
]

const filteredArticles = computed(() => {
  let filtered = articles.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / articlesPerPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

const getCategoryName = (category) => {
  const categories = {
    frontend: '前端开发',
    backend: '后端开发',
    devops: '运维部署',
    design: '设计',
    tutorial: '教程'
  }
  return categories[category] || '其他'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleImageError = (event) => {
  event.target.src = defaultImage
}

const handleAvatarError = (event) => {
  event.target.src = defaultAvatar
}

const viewArticle = (article) => {
  // In a real app, you would navigate to the article detail page
  console.log('查看文章:', article.title)
  // router.push(`/blog/${article.id}`)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const subscribe = async () => {
  if (!email.value) return
  
  subscribing.value = true
  subscribeMessage.value = ''
  
  try {
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    subscribeMessage.value = '订阅成功！感谢您的关注。'
    subscribeStatus.value = 'success'
    email.value = ''
  } catch (error) {
    subscribeMessage.value = '订阅失败，请稍后重试。'
    subscribeStatus.value = 'error'
  } finally {
    subscribing.value = false
  }
}

const loadArticles = async () => {
  try {
    const response = await articlesAPI.getArticles()
    if (response.data && response.data.length > 0) {
      articles.value = response.data
    } else {
      // Use demo data if no articles from API
      articles.value = demoArticles
    }
  } catch (error) {
    console.log('使用演示数据显示文章')
    // Use demo data if API call fails
    articles.value = demoArticles
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.blog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.blog-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.blog-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.blog-controls {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e1e1e1;
}

.controls-row {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 25px;
  padding: 5px;
  min-width: 300px;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 10px 15px;
  font-size: 16px;
  outline: none;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

.category-select {
  padding: 10px 15px;
  border: 2px solid #e1e1e1;
  border-radius: 25px;
  background: white;
  font-size: 16px;
  min-width: 150px;
  cursor: pointer;
}

.category-select:focus {
  outline: none;
  border-color: #007bff;
}

.blog-content {
  padding: 60px 0;
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.article-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.article-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #007bff;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-content {
  padding: 1.5rem;
}

.article-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.4;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.article-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.article-date,
.read-time {
  font-size: 0.8rem;
  color: #999;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.no-articles {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.newsletter {
  background: #f8f9fa;
  padding: 60px 0;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.newsletter-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.subscribe-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 1rem auto;
}

.email-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
}

.email-input:focus {
  outline: none;
  border-color: #007bff;
}

.success {
  color: #28a745;
  font-size: 0.9rem;
}

.error {
  color: #dc3545;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .blog-header h1 {
    font-size: 2rem;
  }
  
  .controls-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .blog-content {
    padding: 40px 0;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .article-stats {
    align-items: flex-start;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .subscribe-form {
    flex-direction: column;
    max-width: 100%;
  }
  
  .newsletter-content h2 {
    font-size: 1.5rem;
  }
}
</style>