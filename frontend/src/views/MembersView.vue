<template>
  <div class="members-page">
    <!-- Header Section -->
    <section class="members-header">
      <div class="container">
        <h1>团队成员</h1>
        <p>认识我们的专业团队，他们是项目成功的关键</p>
      </div>
    </section>

    <!-- Members Grid Section -->
    <section class="members-content">
      <div class="container">
        <div v-if="loading" class="loading">
          <p>正在加载团队成员...</p>
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
              
              <div class="member-skills" v-if="member.skills && member.skills.length">
                <span 
                  v-for="skill in member.skills" 
                  :key="skill" 
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
              
              <div class="member-social" v-if="member.social">
                <a 
                  v-if="member.social.github" 
                  :href="member.social.github" 
                  target="_blank"
                  class="social-link"
                  title="GitHub"
                >
                  🐙
                </a>
                <a 
                  v-if="member.social.linkedin" 
                  :href="member.social.linkedin" 
                  target="_blank"
                  class="social-link"
                  title="LinkedIn"
                >
                  💼
                </a>
                <a 
                  v-if="member.social.email" 
                  :href="`mailto:${member.social.email}`"
                  class="social-link"
                  title="Email"
                >
                  📧
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && members.length === 0" class="no-members">
          <p>暂无团队成员信息</p>
        </div>
      </div>
    </section>

    <!-- Join Team Section -->
    <section class="join-team">
      <div class="container">
        <div class="join-content">
          <h2>加入我们的团队</h2>
          <p>我们正在寻找有才华的开发者加入我们的团队。如果您对我们的项目感兴趣，欢迎与我们联系。</p>
          <router-link to="/contact" class="btn btn-primary">联系我们</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { membersAPI } from '../services/api.js'

const members = ref([])
const loading = ref(true)
const defaultAvatar = 'https://via.placeholder.com/200x200/007bff/ffffff?text=Member'

// Default demo data
const demoMembers = [
  {
    id: 1,
    name: '张三',
    role: '项目经理',
    description: '拥有5年项目管理经验，专注于团队协作和项目交付。',
    avatar: '',
    skills: ['项目管理', 'Scrum', '团队协作', '产品规划'],
    social: {
      email: 'zhangsan@studiocms.com',
      github: 'https://github.com/zhangsan',
      linkedin: 'https://linkedin.com/in/zhangsan'
    }
  },
  {
    id: 2,
    name: '李四',
    role: '前端工程师',
    description: '热爱前端技术，专注于用户体验和界面设计。',
    avatar: '',
    skills: ['Vue.js', 'React', 'TypeScript', 'CSS3', 'UI设计'],
    social: {
      email: 'lisi@studiocms.com',
      github: 'https://github.com/lisi'
    }
  },
  {
    id: 3,
    name: '王五',
    role: '后端工程师',
    description: '专注于服务器端开发和数据库设计，确保系统稳定运行。',
    avatar: '',
    skills: ['Node.js', 'Python', 'MongoDB', 'Docker', 'AWS'],
    social: {
      email: 'wangwu@studiocms.com',
      github: 'https://github.com/wangwu',
      linkedin: 'https://linkedin.com/in/wangwu'
    }
  },
  {
    id: 4,
    name: '赵六',
    role: '设计师',
    description: '创意设计师，负责品牌形象和用户界面设计。',
    avatar: '',
    skills: ['UI设计', 'UX设计', 'Figma', 'Adobe Creative Suite', '品牌设计'],
    social: {
      email: 'zhaoliu@studiocms.com'
    }
  },
  {
    id: 5,
    name: '孙七',
    role: '全栈工程师',
    description: '全栈开发工程师，同时具备前端和后端开发能力。',
    avatar: '',
    skills: ['JavaScript', 'Vue.js', 'Node.js', 'MySQL', 'DevOps'],
    social: {
      email: 'sunqi@studiocms.com',
      github: 'https://github.com/sunqi'
    }
  },
  {
    id: 6,
    name: '周八',
    role: '测试工程师',
    description: '专业的软件测试工程师，确保产品质量和稳定性。',
    avatar: '',
    skills: ['自动化测试', 'Jest', 'Cypress', '性能测试', '质量保证'],
    social: {
      email: 'zhouba@studiocms.com'
    }
  }
]

const loadMembers = async () => {
  try {
    const response = await membersAPI.getMembers()
    if (response.data && response.data.length > 0) {
      members.value = response.data
    } else {
      // Use demo data if no members from API
      members.value = demoMembers
    }
  } catch (error) {
    console.log('使用演示数据显示团队成员')
    // Use demo data if API call fails
    members.value = demoMembers
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = defaultAvatar
}

onMounted(() => {
  loadMembers()
})
</script>

<style scoped>
.members-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.members-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.members-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.members-content {
  padding: 80px 0;
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.member-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.member-avatar {
  margin-bottom: 1.5rem;
}

.member-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f8f9fa;
  transition: border-color 0.3s;
}

.member-card:hover .member-avatar img {
  border-color: #007bff;
}

.member-info h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.member-role {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.member-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.skill-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.member-social {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-link {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  transition: background-color 0.3s, transform 0.3s;
}

.social-link:hover {
  background: #007bff;
  transform: scale(1.1);
}

.no-members {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.join-team {
  background: #f8f9fa;
  padding: 60px 0;
}

.join-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.join-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.join-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .members-header h1 {
    font-size: 2rem;
  }
  
  .members-content {
    padding: 40px 0;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .member-card {
    padding: 1.5rem;
  }
  
  .member-avatar img {
    width: 100px;
    height: 100px;
  }
  
  .join-content h2 {
    font-size: 1.5rem;
  }
}
</style>