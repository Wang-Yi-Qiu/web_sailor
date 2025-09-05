const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Sample projects data for demo
const sampleProjects = [
  {
    _id: '1',
    title: 'StudioCMS 内容管理系统',
    description: '一个基于 Vue.js 和 Node.js 的现代化内容管理系统',
    content: '这是一个功能完整的CMS系统，包含用户管理、文章管理、项目展示等功能...',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
    category: 'web',
    status: 'completed',
    featured: true,
    githubUrl: 'https://github.com/example/studiocms',
    demoUrl: 'https://studiocms-demo.com',
    images: ['project1-1.jpg', 'project1-2.jpg'],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    _id: '2',
    title: 'Vue 组件库',
    description: '一套基于 Vue 3 的企业级组件库',
    content: '包含丰富的UI组件，支持主题定制，提供完整的设计规范...',
    technologies: ['Vue.js', 'TypeScript', 'Vite', 'Sass'],
    category: 'library',
    status: 'in-progress',
    featured: true,
    githubUrl: 'https://github.com/example/vue-components',
    demoUrl: 'https://vue-components-demo.com',
    images: ['project2-1.jpg'],
    startDate: new Date('2024-02-01'),
    endDate: null,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-20')
  },
  {
    _id: '3',
    title: '移动端应用',
    description: '跨平台移动应用开发解决方案',
    content: '使用React Native开发的跨平台移动应用，支持iOS和Android...',
    technologies: ['React Native', 'Redux', 'Firebase', 'TypeScript'],
    category: 'mobile',
    status: 'completed',
    featured: false,
    githubUrl: 'https://github.com/example/mobile-app',
    demoUrl: null,
    images: ['project3-1.jpg', 'project3-2.jpg', 'project3-3.jpg'],
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-15'),
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '4',
    title: '数据可视化平台',
    description: '企业级数据分析和可视化平台',
    content: '提供强大的数据分析工具和丰富的图表组件...',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI'],
    category: 'data',
    status: 'planning',
    featured: false,
    githubUrl: null,
    demoUrl: null,
    images: [],
    startDate: new Date('2024-03-01'),
    endDate: null,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25')
  }
];

// GET /api/projects - 获取项目列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search, featured } = req.query;
    
    let filteredProjects = [...sampleProjects];
    
    // Filter by category
    if (category && category !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    // Filter by featured
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(project => project.featured);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by creation date (newest first)
    filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProjects.length / limit),
        totalItems: filteredProjects.length,
        hasNext: endIndex < filteredProjects.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: '获取项目列表失败' });
  }
});

// GET /api/projects/featured - 获取推荐项目
router.get('/featured', async (req, res) => {
  try {
    const featuredProjects = sampleProjects.filter(project => project.featured);
    
    res.json({
      success: true,
      data: featuredProjects
    });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ success: false, message: '获取推荐项目失败' });
  }
});

// GET /api/projects/categories/list - 获取项目分类列表
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [...new Set(sampleProjects.map(project => project.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get project categories error:', error);
    res.status(500).json({ success: false, message: '获取项目分类失败' });
  }
});

// GET /api/projects/stats - 获取项目统计信息
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: sampleProjects.length,
      completed: sampleProjects.filter(p => p.status === 'completed').length,
      inProgress: sampleProjects.filter(p => p.status === 'in-progress').length,
      planning: sampleProjects.filter(p => p.status === 'planning').length,
      featured: sampleProjects.filter(p => p.featured).length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ success: false, message: '获取项目统计失败' });
  }
});

// GET /api/projects/:id - 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = sampleProjects.find(project => project._id === id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: '获取项目详情失败' });
  }
});

// POST /api/projects - 创建项目 (需要认证)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      technologies,
      category,
      status = 'planning',
      featured = false,
      githubUrl,
      demoUrl,
      images,
      startDate,
      endDate
    } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: '标题和描述不能为空' });
    }
    
    const newProject = {
      _id: Date.now().toString(),
      title,
      description,
      content: content || '',
      technologies: technologies || [],
      category: category || 'other',
      status,
      featured,
      githubUrl,
      demoUrl,
      images: images || [],
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    sampleProjects.push(newProject);
    
    res.status(201).json({
      success: true,
      message: '项目创建成功',
      data: newProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: '创建项目失败' });
  }
});

// PUT /api/projects/:id - 更新项目 (需要认证)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const projectIndex = sampleProjects.findIndex(project => project._id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    
    const project = sampleProjects[projectIndex];
    
    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key === 'startDate' || key === 'endDate') {
        project[key] = updateData[key] ? new Date(updateData[key]) : null;
      } else if (key !== '_id' && key !== 'createdAt') {
        project[key] = updateData[key];
      }
    });
    
    project.updatedAt = new Date();
    
    res.json({
      success: true,
      message: '项目更新成功',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: '更新项目失败' });
  }
});

// DELETE /api/projects/:id - 删除项目 (需要认证)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const projectIndex = sampleProjects.findIndex(project => project._id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }
    
    sampleProjects.splice(projectIndex, 1);
    
    res.json({
      success: true,
      message: '项目删除成功'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: '删除项目失败' });
  }
});

module.exports = router;