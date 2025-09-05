const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Sample articles data for demo
const sampleArticles = [
  {
    _id: '1',
    title: 'Vue 3 入门指南',
    content: '这是一篇关于 Vue 3 的详细入门指南...',
    excerpt: '学习 Vue 3 的基础概念和核心特性',
    author: { name: '张三', _id: 'user1' },
    category: 'frontend',
    tags: ['Vue.js', 'JavaScript', '前端开发'],
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    featured: true
  },
  {
    _id: '2', 
    title: 'Node.js 最佳实践',
    content: '分享一些 Node.js 开发中的最佳实践...',
    excerpt: 'Node.js 开发中需要注意的关键点',
    author: { name: '李四', _id: 'user2' },
    category: 'backend',
    tags: ['Node.js', '后端开发', '最佳实践'],
    status: 'published', 
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    featured: false
  },
  {
    _id: '3',
    title: 'MongoDB 数据建模',
    content: '深入了解 MongoDB 的数据建模技巧...',
    excerpt: 'MongoDB 数据库设计的核心原则',
    author: { name: '王五', _id: 'user3' },
    category: 'database',
    tags: ['MongoDB', '数据库', '数据建模'],
    status: 'published',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    featured: false
  }
];

// GET /api/articles - 获取文章列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, status = 'published' } = req.query;
    
    let filteredArticles = sampleArticles.filter(article => article.status === status);
    
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by creation date (newest first)
    filteredArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedArticles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredArticles.length / limit),
        totalItems: filteredArticles.length,
        hasNext: endIndex < filteredArticles.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ success: false, message: '获取文章列表失败' });
  }
});

// GET /api/articles/featured - 获取推荐文章
router.get('/featured', async (req, res) => {
  try {
    const featuredArticles = sampleArticles.filter(article => 
      article.featured && article.status === 'published'
    );
    
    res.json({
      success: true,
      data: featuredArticles
    });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({ success: false, message: '获取推荐文章失败' });
  }
});

// GET /api/articles/categories/list - 获取分类列表
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [...new Set(sampleArticles.map(article => article.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: '获取分类列表失败' });
  }
});

// GET /api/articles/:id - 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = sampleArticles.find(article => article._id === id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ success: false, message: '获取文章详情失败' });
  }
});

// POST /api/articles - 创建文章 (需要认证)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status = 'draft', featured = false } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: '标题和内容不能为空' });
    }
    
    const newArticle = {
      _id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 100) + '...',
      author: { name: req.user.username, _id: req.user.id },
      category: category || 'general',
      tags: tags || [],
      status,
      featured,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    sampleArticles.push(newArticle);
    
    res.status(201).json({
      success: true,
      message: '文章创建成功',
      data: newArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ success: false, message: '创建文章失败' });
  }
});

// PUT /api/articles/:id - 更新文章 (需要认证)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, status, featured } = req.body;
    
    const articleIndex = sampleArticles.findIndex(article => article._id === id);
    
    if (articleIndex === -1) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }
    
    const article = sampleArticles[articleIndex];
    
    // Update fields
    if (title) article.title = title;
    if (content) article.content = content;
    if (excerpt) article.excerpt = excerpt;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (status) article.status = status;
    if (featured !== undefined) article.featured = featured;
    article.updatedAt = new Date();
    
    res.json({
      success: true,
      message: '文章更新成功',
      data: article
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ success: false, message: '更新文章失败' });
  }
});

// DELETE /api/articles/:id - 删除文章 (需要认证)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const articleIndex = sampleArticles.findIndex(article => article._id === id);
    
    if (articleIndex === -1) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }
    
    sampleArticles.splice(articleIndex, 1);
    
    res.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ success: false, message: '删除文章失败' });
  }
});

module.exports = router;