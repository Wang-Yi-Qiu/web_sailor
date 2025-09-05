import { defineStore } from 'pinia'
import { authAPI } from '../services/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'super_admin'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authAPI.login(credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authAPI.register(userData)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || '注册失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getProfile() {
      this.loading = true
      this.error = null
      
      try {
        const response = await authAPI.getProfile()
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || '获取用户信息失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateProfile(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authAPI.updateProfile(userData)
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || '更新用户信息失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})