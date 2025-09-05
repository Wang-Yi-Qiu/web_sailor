<template>
  <div class="contact-page">
    <!-- Header Section -->
    <section class="contact-header">
      <div class="container">
        <h1>联系我们</h1>
        <p>我们期待与您建立联系，为您提供最优质的服务</p>
      </div>
    </section>

    <!-- Contact Info and Form Section -->
    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Information -->
          <div class="contact-info">
            <h2>联系信息</h2>
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-content">
                <h3>邮箱地址</h3>
                <p>{{ contactInfo.email }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📞</div>
              <div class="info-content">
                <h3>联系电话</h3>
                <p>{{ contactInfo.phone }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-content">
                <h3>办公地址</h3>
                <p>{{ contactInfo.address }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">🕒</div>
              <div class="info-content">
                <h3>工作时间</h3>
                <p>周一至周五 9:00-18:00</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-section">
            <h2>发送消息</h2>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">姓名 *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="请输入您的姓名"
                  />
                </div>
                
                <div class="form-group">
                  <label for="email">邮箱 *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="请输入您的邮箱"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="subject">主题 *</label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="请输入消息主题"
                />
              </div>
              
              <div class="form-group">
                <label for="message">消息内容 *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="6"
                  placeholder="请输入您要发送的消息内容..."
                ></textarea>
              </div>
              
              <div v-if="submitStatus.message" :class="submitStatus.type">
                {{ submitStatus.message }}
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary submit-btn"
                :disabled="submitting"
              >
                {{ submitting ? '发送中...' : '发送消息' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section (placeholder) -->
    <section class="map-section">
      <div class="container">
        <h2>我们的位置</h2>
        <div class="map-placeholder">
          <p>🗺️ 地图位置</p>
          <p>{{ contactInfo.address }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Contact information - can be updated as needed
const contactInfo = reactive({
  email: 'contact@studiocms.com',
  phone: '+86 123 4567 8900',
  address: '北京市朝阳区创意大厦 888 号'
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const submitStatus = ref({
  type: '',
  message: ''
})

const handleSubmit = async () => {
  submitting.value = true
  submitStatus.value = { type: '', message: '' }
  
  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real implementation, you would send this to your backend
    console.log('Contact form submitted:', form.value)
    
    submitStatus.value = {
      type: 'success',
      message: '消息发送成功！我们会尽快回复您。'
    }
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    submitStatus.value = {
      type: 'error',
      message: '发送失败，请稍后重试。'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.contact-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.contact-content {
  padding: 80px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;
}

.contact-info h2,
.contact-form-section h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-top: 0.25rem;
}

.info-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.info-content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  background-color: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.map-section {
  background-color: #f8f9fa;
  padding: 60px 0;
}

.map-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.map-placeholder {
  background: white;
  border-radius: 10px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.map-placeholder p:first-child {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.map-placeholder p:last-child {
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .contact-header h1 {
    font-size: 2rem;
  }
  
  .contact-content {
    padding: 40px 0;
  }
  
  .contact-form {
    padding: 1.5rem;
  }
}
</style>