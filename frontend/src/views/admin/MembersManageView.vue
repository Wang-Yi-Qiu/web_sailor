<template>
  <div class="members-manage-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>成员管理</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            + 添加成员
          </button>
        </div>
      </div>
    </div>

    <!-- Members Grid -->
    <section class="members-section">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载成员信息...</p>
        </div>
        
        <div v-else class="members-grid">
          <div 
            v-for="member in members" 
            :key="member.id" 
            class="member-card"
          >
            <div class="member-avatar">
              <img 
                :src="member.avatar || defaultAvatar" 
                :alt="member.name"
                @error="handleImageError"
              />
            </div>
            
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-description">{{ member.description }}</p>
              
              <div class="member-actions">
                <button @click="editMember(member)" class="btn-action edit">编辑</button>
                <button @click="deleteMember(member.id)" class="btn-action delete">删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && members.length === 0" class="no-members">
          <p>暂无团队成员，点击上方按钮添加第一个成员</p>
        </div>
      </div>
    </section>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑成员' : '添加成员' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveMember">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input
                id="name"
                v-model="memberForm.name"
                type="text"
                required
                placeholder="请输入姓名"
              />
            </div>
            
            <div class="form-group">
              <label for="role">职位 *</label>
              <input
                id="role"
                v-model="memberForm.role"
                type="text"
                required
                placeholder="请输入职位"
              />
            </div>
            
            <div class="form-group">
              <label for="description">个人简介</label>
              <textarea
                id="description"
                v-model="memberForm.description"
                rows="4"
                placeholder="请输入个人简介"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="skills">技能</label>
              <input
                id="skills"
                v-model="skillsInput"
                type="text"
                placeholder="输入技能，用逗号分隔"
              />
            </div>
            
            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                id="email"
                v-model="memberForm.email"
                type="email"
                placeholder="请输入邮箱地址"
              />
            </div>
            
            <div class="form-group">
              <label for="github">GitHub</label>
              <input
                id="github"
                v-model="memberForm.github"
                type="url"
                placeholder="请输入 GitHub 链接"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">取消</button>
          <button 
            @click="saveMember" 
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
import { membersAPI } from '../../services/api.js'

const members = ref([])
const loading = ref(true)
const saving = ref(false)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingMember = ref(null)

const memberForm = ref({
  name: '',
  role: '',
  description: '',
  skills: [],
  email: '',
  github: ''
})

const skillsInput = ref('')
const defaultAvatar = 'https://via.placeholder.com/120x120/007bff/ffffff?text=Member'

// Demo data
const demoMembers = [
  {
    id: 1,
    name: '张三',
    role: '项目经理',
    description: '拥有5年项目管理经验，专注于团队协作和项目交付。',
    skills: ['项目管理', 'Scrum', '团队协作'],
    email: 'zhangsan@example.com',
    github: 'https://github.com/zhangsan',
    avatar: ''
  },
  {
    id: 2,
    name: '李四',
    role: '前端工程师',
    description: '热爱前端技术，专注于用户体验和界面设计。',
    skills: ['Vue.js', 'React', 'TypeScript'],
    email: 'lisi@example.com',
    github: 'https://github.com/lisi',
    avatar: ''
  }
]

const handleImageError = (event) => {
  event.target.src = defaultAvatar
}

const loadMembers = async () => {
  try {
    const response = await membersAPI.getMembers()
    if (response.data && response.data.length > 0) {
      members.value = response.data
    } else {
      members.value = demoMembers
    }
  } catch (error) {
    console.log('使用演示数据')
    members.value = demoMembers
  } finally {
    loading.value = false
  }
}

const editMember = (member) => {
  editingMember.value = member
  memberForm.value = {
    name: member.name,
    role: member.role,
    description: member.description || '',
    skills: member.skills || [],
    email: member.email || '',
    github: member.github || ''
  }
  skillsInput.value = (member.skills || []).join(', ')
  showEditModal.value = true
}

const deleteMember = async (memberId) => {
  if (!confirm('确定要删除这个成员吗？')) return
  
  try {
    await membersAPI.deleteMember(memberId)
    members.value = members.value.filter(m => m.id !== memberId)
  } catch (error) {
    members.value = members.value.filter(m => m.id !== memberId)
  }
}

const saveMember = async () => {
  if (!memberForm.value.name || !memberForm.value.role) {
    alert('请填写必填字段')
    return
  }
  
  saving.value = true
  
  try {
    const skills = skillsInput.value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
    
    const memberData = {
      ...memberForm.value,
      skills
    }
    
    if (showEditModal.value && editingMember.value) {
      await membersAPI.updateMember(editingMember.value.id, memberData)
      const index = members.value.findIndex(m => m.id === editingMember.value.id)
      if (index !== -1) {
        members.value[index] = { ...editingMember.value, ...memberData }
      }
    } else {
      const newMember = {
        id: Date.now(),
        ...memberData,
        avatar: ''
      }
      members.value.unshift(newMember)
    }
    
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    // For demo, still update locally
    if (showEditModal.value && editingMember.value) {
      const index = members.value.findIndex(m => m.id === editingMember.value.id)
      if (index !== -1) {
        members.value[index] = { 
          ...editingMember.value, 
          ...memberForm.value,
          skills: skillsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
        }
      }
    } else {
      const newMember = {
        id: Date.now(),
        ...memberForm.value,
        skills: skillsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0),
        avatar: ''
      }
      members.value.unshift(newMember)
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingMember.value = null
  memberForm.value = {
    name: '',
    role: '',
    description: '',
    skills: [],
    email: '',
    github: ''
  }
  skillsInput.value = ''
}

onMounted(() => {
  loadMembers()
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

.members-section {
  padding: 40px 0;
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.member-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s;
}

.member-card:hover {
  transform: translateY(-5px);
}

.member-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.member-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.member-role {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
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

.no-members {
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
  max-width: 500px;
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
  
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>