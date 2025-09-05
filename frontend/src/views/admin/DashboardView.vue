<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="container">
        <h1>管理后台</h1>
        <p>欢迎回来，{{ user?.username }}！</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">👥</div>
            <div class="stat-content">
              <h3>{{ stats.users }}</h3>
              <p>注册用户</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon articles">📝</div>
            <div class="stat-content">
              <h3>{{ stats.articles }}</h3>
              <p>文章数量</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon projects">🚀</div>
            <div class="stat-content">
              <h3>{{ stats.projects }}</h3>
              <p>项目数量</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon members">👨‍💻</div>
            <div class="stat-content">
              <h3>{{ stats.members }}</h3>
              <p>团队成员</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="actions-section">
      <div class="container">
        <h2>快速操作</h2>
        <div class="actions-grid">
          <router-link to="/admin/articles" class="action-card">
            <div class="action-icon">📝</div>
            <h3>管理文章</h3>
            <p>创建、编辑和管理博客文章</p>
          </router-link>
          
          <router-link to="/admin/projects" class="action-card">
            <div class="action-icon">🚀</div>
            <h3>管理项目</h3>
            <p>添加和管理项目展示</p>
          </router-link>
          
          <router-link to="/admin/members" class="action-card">
            <div class="action-icon">👥</div>
            <h3>管理成员</h3>
            <p>管理团队成员信息</p>
          </router-link>
          
          <div class="action-card" @click="showUploadModal = true">
            <div class="action-icon">📁</div>
            <h3>文件上传</h3>
            <p>上传图片和文档</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="activity-section">
      <div class="container">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ formatDate(activity.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- System Info -->
    <section class="system-section">
      <div class="container">
        <div class="system-grid">
          <div class="system-card">
            <h3>系统状态</h3>
            <div class="system-status">
              <div class="status-item">
                <span class="status-label">API 服务</span>
                <span class="status-value online">正常</span>
              </div>
              <div class="status-item">
                <span class="status-label">数据库</span>
                <span class="status-value online">正常</span>
              </div>
              <div class="status-item">
                <span class="status-label">存储空间</span>
                <span class="status-value">75% 已使用</span>
              </div>
            </div>
          </div>
          
          <div class="system-card">
            <h3>版本信息</h3>
            <div class="version-info">
              <div class="version-item">
                <span class="version-label">系统版本</span>
                <span class="version-value">v1.0.0</span>
              </div>
              <div class="version-item">
                <span class="version-label">Vue.js</span>
                <span class="version-value">v3.5.18</span>
              </div>
              <div class="version-item">
                <span class="version-label">Node.js</span>
                <span class="version-value">v20.x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>文件上传</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area" @dragover.prevent @drop="handleDrop">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              @change="handleFileSelect"
              style="display: none"
            />
            <div class="upload-content">
              <div class="upload-icon">📁</div>
              <p>拖拽文件到此处或 <button @click="selectFiles" class="upload-btn">选择文件</button></p>
              <p class="upload-hint">支持图片、PDF、Word 文档</p>
            </div>
          </div>
          
          <div v-if="uploadFiles.length > 0" class="file-list">
            <div v-for="(file, index) in uploadFiles" :key="index" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button @click="removeFile(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">取消</button>
          <button 
            @click="handleUpload" 
            class="btn btn-primary"
            :disabled="uploadFiles.length === 0 || uploading"
          >
            {{ uploading ? '上传中...' : '上传' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { usersAPI, articlesAPI, projectsAPI, membersAPI, uploadAPI } from '../../services/api.js'

const authStore = useAuthStore()

const stats = ref({
  users: 0,
  articles: 0,
  projects: 0,
  members: 0
})

const recentActivities = ref([
  {
    id: 1,
    icon: '📝',
    description: '发布了新文章《Vue 3 最佳实践》',
    date: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    icon: '🚀',
    description: '添加了新项目《电商平台》',
    date: new Date(Date.now() - 7200000)
  },
  {
    id: 3,
    icon: '👥',
    description: '新用户 李小明 注册',
    date: new Date(Date.now() - 10800000)
  },
  {
    id: 4,
    icon: '📁',
    description: '上传了项目截图',
    date: new Date(Date.now() - 14400000)
  }
])

const showUploadModal = ref(false)
const uploadFiles = ref([])
const uploading = ref(false)
const fileInput = ref(null)

const user = computed(() => authStore.user)

const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `${minutes} 分钟前`
  } else if (hours < 24) {
    return `${hours} 小时前`
  } else {
    return `${days} 天前`
  }
}

const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const loadStats = async () => {
  try {
    const [usersRes, articlesRes, projectsRes, membersRes] = await Promise.allSettled([
      usersAPI.getUsers(),
      articlesAPI.getArticles(),
      projectsAPI.getProjects(),
      membersAPI.getMembers()
    ])

    if (usersRes.status === 'fulfilled') {
      stats.value.users = usersRes.value.data.length
    }
    
    if (articlesRes.status === 'fulfilled') {
      stats.value.articles = articlesRes.value.data.length
    }
    
    if (projectsRes.status === 'fulfilled') {
      stats.value.projects = projectsRes.value.data.length
    }
    
    if (membersRes.status === 'fulfilled') {
      stats.value.members = membersRes.value.data.length
    }
  } catch (error) {
    console.log('使用模拟数据显示统计信息')
    // Use demo stats if API calls fail
    stats.value = {
      users: 15,
      articles: 25,
      projects: 12,
      members: 8
    }
  }
}

const selectFiles = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  uploadFiles.value.push(...files)
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  uploadFiles.value.push(...files)
}

const removeFile = (index) => {
  uploadFiles.value.splice(index, 1)
}

const handleUpload = async () => {
  if (uploadFiles.value.length === 0) return
  
  uploading.value = true
  
  try {
    for (const file of uploadFiles.value) {
      await uploadAPI.uploadFile(file)
    }
    
    uploadFiles.value = []
    showUploadModal.value = false
    
    // Refresh activities
    recentActivities.value.unshift({
      id: Date.now(),
      icon: '📁',
      description: `上传了 ${uploadFiles.value.length} 个文件`,
      date: new Date()
    })
  } catch (error) {
    console.error('Upload failed:', error)
    alert('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

const closeModal = () => {
  showUploadModal.value = false
  uploadFiles.value = []
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  opacity: 0.9;
}

.stats-section {
  padding: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.users { background: #e3f2fd; }
.stat-icon.articles { background: #f3e5f5; }
.stat-icon.projects { background: #e8f5e8; }
.stat-icon.members { background: #fff3e0; }

.stat-content h3 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
}

.actions-section,
.activity-section,
.system-section {
  padding: 40px 0;
}

.actions-section h2,
.activity-section h2,
.system-section h2 {
  margin-bottom: 2rem;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.action-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.action-card p {
  margin: 0;
  color: #666;
}

.activity-list {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-content p {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.activity-time {
  font-size: 0.9rem;
  color: #999;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.system-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.system-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.status-item,
.version-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.status-item:last-child,
.version-item:last-child {
  margin-bottom: 0;
}

.status-label,
.version-label {
  color: #666;
}

.status-value,
.version-value {
  font-weight: 500;
  color: #333;
}

.status-value.online {
  color: #28a745;
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
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
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

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 3rem;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #007bff;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.upload-hint {
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
}

.file-list {
  margin-top: 1.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.file-size {
  font-size: 0.9rem;
  color: #666;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e1e1e1;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .system-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .upload-area {
    padding: 2rem 1rem;
  }
}
</style>