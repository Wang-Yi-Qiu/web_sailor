import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ContactView from '../views/ContactView.vue'
import MembersView from '../views/MembersView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import BlogView from '../views/BlogView.vue'

// Admin views
import DashboardView from '../views/admin/DashboardView.vue'
import ArticlesView from '../views/admin/ArticlesView.vue'
import MembersManageView from '../views/admin/MembersManageView.vue'
import ProjectsManageView from '../views/admin/ProjectsManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/members',
      name: 'members',
      component: MembersView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/articles',
      name: 'admin-articles',
      component: ArticlesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/members',
      name: 'admin-members',
      component: MembersManageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/projects',
      name: 'admin-projects',
      component: ProjectsManageView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router