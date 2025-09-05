<template>
  <div class="login-page">
    <div class="container">
      <div class="login-form-container">
        <div class="login-header">
          <h1>用户登录</h1>
          <p>登录到 StudioCMS 管理系统</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="请输入密码"
              :disabled="loading"
            />
          </div>
          
          <div v-if="error" class="error">
            {{ error }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p>默认管理员账号：admin / 123456</p>
          <p>还没有账号？请联系管理员注册</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    return
  }
  
  const result = await authStore.login({
    username: form.value.username,
    password: form.value.password
  })
  
  if (result.success) {
    // Redirect to admin dashboard if user is admin, otherwise to home
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.login-form-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
}

.login-header {
  background: #007bff;
  color: white;
  padding: 2rem;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
}

.login-form {
  padding: 2rem;
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 1rem;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.login-footer {
  background-color: #f8f9fa;
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid #e1e1e1;
}

.login-footer p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .login-form-container {
    margin: 0 15px;
  }
  
  .login-header,
  .login-form,
  .login-footer {
    padding: 1.5rem;
  }
}
</style>