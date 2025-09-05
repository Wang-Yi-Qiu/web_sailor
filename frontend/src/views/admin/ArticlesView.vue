<template>
  <div class="articles-manage-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>文章管理</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            + 新建文章
          </button>
        </div>
      </div>
    </div>

    <!-- Articles List -->
    <section class="articles-section">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载文章...</p>
        </div>
        
        <div v-else class="articles-table">
          <div class="table-header">
            <div class="table-row">
              <div class="table-cell">标题</div>
              <div class="table-cell">分类</div>
              <div class="table-cell">作者</div>
              <div class="table-cell">创建时间</div>
              <div class="table-cell">状态</div>
              <div class="table-cell">操作</div>
            </div>
          </div>
          
          <div class="table-body">
            <div v-for="article in articles" :key="article.id" class="table-row">
              <div class="table-cell">
                <strong>{{ article.title }}</strong>
                <p class="article-excerpt">{{ article.excerpt }}</p>
              </div>
              <div class="table-cell">
                <span class="category-tag">{{ getCategoryName(article.category) }}</span>
              </div>
              <div class="table-cell">{{ article.author?.name || '匿名' }}</div>
              <div class="table-cell">{{ formatDate(article.date) }}</div>
              <div class="table-cell">
                <span :class="['status-tag', article.status]">
                  {{ getStatusName(article.status) }}
                </span>
              </div>
              <div class="table-cell">
                <div class="action-buttons">
                  <button @click="editArticle(article)" class="btn-action edit">编辑</button>
                  <button @click="deleteArticle(article.id)" class="btn-action delete">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && articles.length === 0" class="no-articles">
          <p>暂无文章，点击上方按钮创建第一篇文章</p>
        </div>
      </div>
    </section>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑文章' : '新建文章' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveArticle">
            <div class="form-group">
              <label for="title">文章标题 *</label>
              <input
                id="title"
                v-model="articleForm.title"
                type="text"
                required
                placeholder="请输入文章标题"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">分类 *</label>
                <select id="category" v-model="articleForm.category" required>
                  <option value="">请选择分类</option>
                  <option value="frontend">前端开发</option>
                  <option value="backend">后端开发</option>
                  <option value="devops">运维部署</option>
                  <option value="design">设计</option>
                  <option value="tutorial">教程</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="status">状态 *</label>
                <select id="status" v-model="articleForm.status" required>
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="excerpt">文章摘要</label>
              <textarea
                id="excerpt"
                v-model="articleForm.excerpt"
                rows="3"
                placeholder="请输入文章摘要（可选）"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="tags">标签</label>
              <input
                id="tags"
                v-model="tagsInput"
                type="text"
                placeholder="输入标签，用逗号分隔"
              />
            </div>
            
            <div class="form-group">
              <label for="content">文章内容 *</label>
              <textarea
                id="content"
                v-model="articleForm.content"
                rows="10"
                required
                placeholder="请输入文章内容"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">取消</button>
          <button 
            @click="saveArticle" 
            class="btn btn-primary"
            :disabled="saving"
          >
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { articlesAPI } from '../../services/api.js'

const articles = ref([])
const loading = ref(true)
const saving = ref(false)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingArticle = ref(null)

const articleForm = ref({
  title: '',
  category: '',
  status: 'draft',
  excerpt: '',
  content: '',
  tags: []
})

const tagsInput = ref('')

// Demo articles data
const demoArticles = [
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '深入探讨 Vue 3 Composition API 的设计理念和使用方法',
    content: '文章详细内容...',
    category: 'frontend',
    status: 'published',
    tags: ['Vue.js', 'JavaScript'],
    author: { id: 1, name: '张三' },
    date: new Date('2024-03-15')
  },
  {
    id: 2,
    title: 'Node.js 性能优化指南',
    excerpt: 'Node.js 应用性能优化的实战经验分享',
    content: '文章详细内容...',
    category: 'backend',
    status: 'published',
    tags: ['Node.js', '性能优化'],
    author: { id: 2, name: '李四' },
    date: new Date('2024-03-10')
  },
  {
    id: 3,
    title: 'Docker 容器化部署实践',
    excerpt: 'Docker 容器化部署的最佳实践',
    content: '文章详细内容...',
    category: 'devops',
    status: 'draft',
    tags: ['Docker', '部署'],
    author: { id: 1, name: '张三' },
    date: new Date('2024-03-05')
  }
]

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

const getStatusName = (status) => {
  const statuses = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档'
  }
  return statuses[status] || '未知'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadArticles = async () => {
  try {
    const response = await articlesAPI.getArticles()
    if (response.data && response.data.length > 0) {
      articles.value = response.data
    } else {
      articles.value = demoArticles
    }
  } catch (error) {
    console.log('使用演示数据')
    articles.value = demoArticles
  } finally {
    loading.value = false
  }
}

const editArticle = (article) => {
  editingArticle.value = article
  articleForm.value = {
    title: article.title,
    category: article.category,
    status: article.status,
    excerpt: article.excerpt || '',
    content: article.content || '',
    tags: article.tags || []
  }
  tagsInput.value = (article.tags || []).join(', ')
  showEditModal.value = true
}

const deleteArticle = async (articleId) => {
  if (!confirm('确定要删除这篇文章吗？')) return
  
  try {
    await articlesAPI.deleteArticle(articleId)
    articles.value = articles.value.filter(a => a.id !== articleId)
  } catch (error) {
    // For demo, just remove from local array
    articles.value = articles.value.filter(a => a.id !== articleId)
  }
}

const saveArticle = async () => {
  if (!articleForm.value.title || !articleForm.value.category || !articleForm.value.content) {
    alert('请填写必填字段')
    return
  }
  
  saving.value = true
  
  try {
    // Parse tags
    const tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    const articleData = {
      ...articleForm.value,
      tags
    }
    
    if (showEditModal.value && editingArticle.value) {
      // Update existing article
      await articlesAPI.updateArticle(editingArticle.value.id, articleData)
      const index = articles.value.findIndex(a => a.id === editingArticle.value.id)
      if (index !== -1) {
        articles.value[index] = { ...editingArticle.value, ...articleData }
      }
    } else {
      // Create new article
      const response = await articlesAPI.createArticle(articleData)
      const newArticle = {
        id: Date.now(), // Demo ID
        ...articleData,
        author: { id: 1, name: '当前用户' },
        date: new Date()
      }
      articles.value.unshift(newArticle)
    }
    
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    // For demo, still update locally
    if (showEditModal.value && editingArticle.value) {
      const index = articles.value.findIndex(a => a.id === editingArticle.value.id)
      if (index !== -1) {
        articles.value[index] = { 
          ...editingArticle.value, 
          ...articleForm.value,
          tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
      }
    } else {
      const newArticle = {
        id: Date.now(),
        ...articleForm.value,
        tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        author: { id: 1, name: '当前用户' },
        date: new Date()
      }
      articles.value.unshift(newArticle)
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingArticle.value = null
  articleForm.value = {
    title: '',
    category: '',
    status: 'draft',
    excerpt: '',
    content: '',
    tags: []
  }
  tagsInput.value = ''
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 1.8rem;
}

.articles-section {
  padding: 40px 0;
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.articles-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  background: #f8f9fa;
  border-bottom: 2px solid #e1e1e1;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-header .table-row {
  font-weight: 600;
  color: #333;
}

.table-body .table-row:hover {
  background: #f8f9fa;
}

.table-body .table-row:last-child {
  border-bottom: none;
}

.article-excerpt {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag.published {
  background: #d4edda;
  color: #155724;
}

.status-tag.draft {
  background: #fff3cd;
  color: #856404;
}

.status-tag.archived {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-action.edit {
  background: #007bff;
  color: white;
}

.btn-action.edit:hover {
  background: #0056b3;
}

.btn-action.delete {
  background: #dc3545;
  color: white;
}

.btn-action.delete:hover {
  background: #c82333;
}

.no-articles {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e1e1;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e1e1;
  border-radius: 5px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e1e1e1;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .table-cell {
    padding: 0.5rem 0;
  }
  
  .table-header {
    display: none;
  }
  
  .table-body .table-cell:before {
    content: attr(data-label);
    font-weight: 600;
    margin-right: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    justify-content: flex-start;
  }
}
</style>