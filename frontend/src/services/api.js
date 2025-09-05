import axios from 'axios'

// API base URL - adjust if backend runs on different port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData)
}

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
}

// Roles API
export const rolesAPI = {
  getRoles: () => api.get('/roles'),
  getRole: (id) => api.get(`/roles/${id}`),
  createRole: (roleData) => api.post('/roles', roleData),
  updateRole: (id, roleData) => api.put(`/roles/${id}`, roleData),
  deleteRole: (id) => api.delete(`/roles/${id}`)
}

// Articles API
export const articlesAPI = {
  getArticles: () => api.get('/articles'),
  getArticle: (id) => api.get(`/articles/${id}`),
  createArticle: (articleData) => api.post('/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/articles/${id}`)
}

// Projects API
export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`)
}

// Members API
export const membersAPI = {
  getMembers: () => api.get('/members'),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (memberData) => api.post('/members', memberData),
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  deleteMember: (id) => api.delete(`/members/${id}`)
}

// Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default api