<template>
  <div class="projects-manage-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>项目管理</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            + 新建项目
          </button>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <section class="projects-section">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载项目...</p>
        </div>
        
        <div v-else class="projects-grid">
          <div 
            v-for="project in projects" 
            :key="project.id" 
            class="project-card"
          >
            <div class="project-image">
              <img 
                :src="project.image || defaultImage" 
                :alt="project.name"
                @error="handleImageError"
              />
            </div>
            
            <div class="project-info">
              <div class="project-category">{{ getCategoryName(project.category) }}</div>
              <h3>{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-meta">
                <span :class="['status-tag', project.status]">
                  {{ getStatusName(project.status) }}
                </span>
                <span class="project-date">{{ formatDate(project.date) }}</span>
              </div>
              
              <div class="project-actions">
                <button @click="editProject(project)" class="btn-action edit">编辑</button>
                <button @click="deleteProject(project.id)" class="btn-action delete">删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && projects.length === 0" class="no-projects">
          <p>暂无项目，点击上方按钮创建第一个项目</p>
        </div>
      </div>
    </section>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑项目' : '新建项目' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProject">
            <div class="form-group">
              <label for="name">项目名称 *</label>
              <input
                id="name"
                v-model="projectForm.name"
                type="text"
                required
                placeholder="请输入项目名称"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">分类 *</label>
                <select id="category" v-model="projectForm.category" required>
                  <option value="">请选择分类</option>
                  <option value="web">Web应用</option>
                  <option value="mobile">移动应用</option>
                  <option value="cms">内容管理</option>
                  <option value="other">其他</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="status">状态 *</label>
                <select id="status" v-model="projectForm.status" required>
                  <option value="planning">计划中</option>
                  <option value="in-progress">进行中</option>
                  <option value="completed">已完成</option>
                  <option value="paused">暂停</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">项目描述 *</label>
              <textarea
                id="description"
                v-model="projectForm.description"
                rows="4"
                required
                placeholder="请输入项目描述"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="technologies">技术栈</label>
              <input
                id="technologies"
                v-model="technologiesInput"
                type="text"
                placeholder="输入技术栈，用逗号分隔"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="demoUrl">演示链接</label>
                <input
                  id="demoUrl"
                  v-model="projectForm.demoUrl"
                  type="url"
                  placeholder="请输入演示链接"
                />
              </div>
              
              <div class="form-group">
                <label for="githubUrl">GitHub 链接</label>
                <input
                  id="githubUrl"
                  v-model="projectForm.githubUrl"
                  type="url"
                  placeholder="请输入 GitHub 链接"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">取消</button>
          <button 
            @click="saveProject" 
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
import { ref, onMounted } from 'vue'
import { projectsAPI } from '../../services/api.js'

const projects = ref([])
const loading = ref(true)
const saving = ref(false)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingProject = ref(null)

const projectForm = ref({
  name: '',
  category: '',
  status: 'planning',
  description: '',
  technologies: [],
  demoUrl: '',
  githubUrl: ''
})

const technologiesInput = ref('')
const defaultImage = 'https://via.placeholder.com/300x200/007bff/ffffff?text=Project'

// Demo data
const demoProjects = [
  {
    id: 1,
    name: 'StudioCMS 官网',
    description: '基于 Vue 3 和 Node.js 的现代化内容管理系统',
    category: 'cms',
    status: 'completed',
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/example/cms',
    date: new Date('2024-01-15'),
    image: ''
  },
  {
    id: 2,
    name: '电商管理平台',
    description: '全功能电商后台管理系统',
    category: 'web',
    status: 'completed',
    technologies: ['React', 'TypeScript', 'Node.js'],
    demoUrl: 'https://example.com/ecommerce',
    githubUrl: 'https://github.com/example/ecommerce',
    date: new Date('2023-11-20'),
    image: ''
  }
]

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
    planning: '计划中',
    'in-progress': '进行中',
    completed: '已完成',
    paused: '暂停'
  }
  return statuses[status] || '未知'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
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
      projects.value = demoProjects
    }
  } catch (error) {
    console.log('使用演示数据')
    projects.value = demoProjects
  } finally {
    loading.value = false
  }
}

const editProject = (project) => {
  editingProject.value = project
  projectForm.value = {
    name: project.name,
    category: project.category,
    status: project.status,
    description: project.description,
    technologies: project.technologies || [],
    demoUrl: project.demoUrl || '',
    githubUrl: project.githubUrl || ''
  }
  technologiesInput.value = (project.technologies || []).join(', ')
  showEditModal.value = true
}

const deleteProject = async (projectId) => {
  if (!confirm('确定要删除这个项目吗？')) return
  
  try {
    await projectsAPI.deleteProject(projectId)
    projects.value = projects.value.filter(p => p.id !== projectId)
  } catch (error) {
    projects.value = projects.value.filter(p => p.id !== projectId)
  }
}

const saveProject = async () => {
  if (!projectForm.value.name || !projectForm.value.category || !projectForm.value.description) {
    alert('请填写必填字段')
    return
  }
  
  saving.value = true
  
  try {
    const technologies = technologiesInput.value
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0)
    
    const projectData = {
      ...projectForm.value,
      technologies
    }
    
    if (showEditModal.value && editingProject.value) {
      await projectsAPI.updateProject(editingProject.value.id, projectData)
      const index = projects.value.findIndex(p => p.id === editingProject.value.id)
      if (index !== -1) {
        projects.value[index] = { ...editingProject.value, ...projectData }
      }
    } else {
      const newProject = {
        id: Date.now(),
        ...projectData,
        date: new Date(),
        image: ''
      }
      projects.value.unshift(newProject)
    }
    
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    // For demo, still update locally
    if (showEditModal.value && editingProject.value) {
      const index = projects.value.findIndex(p => p.id === editingProject.value.id)
      if (index !== -1) {
        projects.value[index] = { 
          ...editingProject.value, 
          ...projectForm.value,
          technologies: technologiesInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
        }
      }
    } else {
      const newProject = {
        id: Date.now(),
        ...projectForm.value,
        technologies: technologiesInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0),
        date: new Date(),
        image: ''
      }
      projects.value.unshift(newProject)
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingProject.value = null
  projectForm.value = {
    name: '',
    category: '',
    status: 'planning',
    description: '',
    technologies: [],
    demoUrl: '',
    githubUrl: ''
  }
  technologiesInput.value = ''
}

onMounted(() => {
  loadProjects()
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

.projects-section {
  padding: 40px 0;
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
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  margin: 0 0 1rem 0;
  color: #333;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag.completed {
  background: #d4edda;
  color: #155724;
}

.status-tag.in-progress {
  background: #fff3cd;
  color: #856404;
}

.status-tag.planning {
  background: #cce5ff;
  color: #004085;
}

.status-tag.paused {
  background: #f8d7da;
  color: #721c24;
}

.project-date {
  color: #999;
  font-size: 0.9rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
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

.no-projects {
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
  max-width: 600px;
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
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .project-actions {
    flex-direction: column;
  }
}
</style>