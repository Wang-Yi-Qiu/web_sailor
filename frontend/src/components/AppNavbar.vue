<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">StudioCMS</router-link>
      </div>
      
      <div class="navbar-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/members" class="nav-link">团队成员</router-link>
        <router-link to="/projects" class="nav-link">项目展示</router-link>
        <router-link to="/blog" class="nav-link">技术博客</router-link>
        <router-link to="/contact" class="nav-link">联系我们</router-link>
        
        <div v-if="!isAuthenticated" class="nav-auth">
          <router-link to="/login" class="nav-link">登录</router-link>
        </div>
        
        <div v-else class="nav-user">
          <div class="dropdown">
            <button @click="toggleDropdown" class="user-btn">
              {{ user?.username || '用户' }} ▼
            </button>
            <div v-show="showDropdown" class="dropdown-menu">
              <router-link to="/admin/dashboard" class="dropdown-item" v-if="isAdmin">管理后台</router-link>
              <button @click="logout" class="dropdown-item">退出登录</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <button @click="toggleMobileMenu" class="mobile-menu-btn">☰</button>
    </div>
    
    <!-- Mobile menu -->
    <div v-show="showMobileMenu" class="mobile-menu">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
      <router-link to="/members" class="mobile-nav-link" @click="closeMobileMenu">团队成员</router-link>
      <router-link to="/projects" class="mobile-nav-link" @click="closeMobileMenu">项目展示</router-link>
      <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">技术博客</router-link>
      <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">联系我们</router-link>
      
      <div v-if="!isAuthenticated">
        <router-link to="/login" class="mobile-nav-link" @click="closeMobileMenu">登录</router-link>
      </div>
      
      <div v-else>
        <router-link to="/admin/dashboard" class="mobile-nav-link" v-if="isAdmin" @click="closeMobileMenu">管理后台</router-link>
        <button @click="logout" class="mobile-nav-link">退出登录</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const showMobileMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const logout = () => {
  authStore.logout()
  showDropdown.value = false
  showMobileMenu.value = false
  router.push('/')
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    showDropdown.value = false
  }
})
</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
}

.navbar-brand .logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #007bff;
}

.nav-auth,
.nav-user {
  margin-left: 1rem;
}

.dropdown {
  position: relative;
}

.user-btn {
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.user-btn:hover {
  background-color: #f8f9fa;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 150px;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  background: white;
  border-top: 1px solid #ddd;
  padding: 1rem 20px;
}

.mobile-nav-link {
  display: block;
  padding: 10px 0;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #007bff;
}

@media (max-width: 768px) {
  .navbar-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
}
</style>