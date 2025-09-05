const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');

// Sample members data for demo
const sampleMembers = [
  {
    _id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    position: '前端开发工程师',
    department: 'Engineering',
    bio: '专注于Vue.js和现代前端技术的开发，拥有5年的前端开发经验。热爱探索新技术，致力于提升用户体验。',
    skills: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'CSS', 'Node.js'],
    avatar: 'member1.jpg',
    joinDate: new Date('2022-03-15'),
    isActive: true,
    social: {
      github: 'https://github.com/zhangsan',
      linkedin: 'https://linkedin.com/in/zhangsan',
      email: 'zhangsan@example.com'
    },
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: '李四',
    email: 'lisi@example.com',
    position: '后端开发工程师',
    department: 'Engineering',
    bio: '热爱Node.js和数据库设计，在后端架构和API设计方面有丰富经验。擅长微服务架构和云原生开发。',
    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Express', 'Docker', 'Kubernetes'],
    avatar: 'member2.jpg',
    joinDate: new Date('2022-06-01'),
    isActive: true,
    social: {
      github: 'https://github.com/lisi',
      email: 'lisi@example.com'
    },
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    position: 'UI/UX设计师',
    department: 'Design',
    bio: '专注于用户体验和界面设计，具有敏锐的设计直觉和良好的审美能力。致力于创造直观、美观的用户界面。',
    skills: ['UI设计', 'UX设计', 'Figma', 'Adobe XD', '原型设计', '用户研究'],
    avatar: 'member3.jpg',
    joinDate: new Date('2022-08-15'),
    isActive: true,
    social: {
      email: 'wangwu@example.com',
      behance: 'https://behance.net/wangwu'
    },
    createdAt: new Date('2022-08-15'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    position: '产品经理',
    department: 'Product',
    bio: '拥有丰富的产品管理经验，擅长需求分析和产品规划。善于协调各部门资源，推动产品持续优化和创新。',
    skills: ['产品规划', '需求分析', '项目管理', '数据分析', 'Agile', 'Scrum'],
    avatar: 'member4.jpg',
    joinDate: new Date('2022-01-10'),
    isActive: true,
    social: {
      email: 'zhaoliu@example.com',
      linkedin: 'https://linkedin.com/in/zhaoliu'
    },
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '5',
    name: '孙七',
    email: 'sunqi@example.com',
    position: 'DevOps工程师',
    department: 'Engineering',
    bio: '专注于DevOps和云基础设施建设，在CI/CD、容器化部署和监控方面有深入的理解和丰富的实践经验。',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Prometheus', 'Grafana'],
    avatar: 'member5.jpg',
    joinDate: new Date('2022-09-01'),
    isActive: true,
    social: {
      github: 'https://github.com/sunqi',
      email: 'sunqi@example.com'
    },
    createdAt: new Date('2022-09-01'),
    updatedAt: new Date('2024-01-12')
  }
];

// GET /api/members - 获取成员列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, department, isActive, search } = req.query;
    
    let filteredMembers = [...sampleMembers];
    
    // Filter by department
    if (department && department !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.department === department);
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      filteredMembers = filteredMembers.filter(member => member.isActive === activeStatus);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchLower) ||
        member.position.toLowerCase().includes(searchLower) ||
        member.department.toLowerCase().includes(searchLower) ||
        (member.bio && member.bio.toLowerCase().includes(searchLower)) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by join date (newest first)
    filteredMembers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedMembers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredMembers.length / limit),
        totalItems: filteredMembers.length,
        hasNext: endIndex < filteredMembers.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ success: false, message: '获取成员列表失败' });
  }
});

// GET /api/members/departments/list - 获取部门列表
router.get('/departments/list', async (req, res) => {
  try {
    const departments = [...new Set(sampleMembers.map(member => member.department))];
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: '获取部门列表失败' });
  }
});

// GET /api/members/stats - 获取成员统计信息
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: sampleMembers.length,
      active: sampleMembers.filter(m => m.isActive).length,
      inactive: sampleMembers.filter(m => !m.isActive).length,
      departments: {}
    };
    
    // Count members by department
    sampleMembers.forEach(member => {
      if (stats.departments[member.department]) {
        stats.departments[member.department]++;
      } else {
        stats.departments[member.department] = 1;
      }
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({ success: false, message: '获取成员统计失败' });
  }
});

// GET /api/members/:id - 获取单个成员
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = sampleMembers.find(member => member._id === id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: '成员不存在' });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ success: false, message: '获取成员详情失败' });
  }
});

// POST /api/members - 创建成员 (需要认证)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      position,
      department,
      bio,
      skills,
      avatar,
      joinDate,
      isActive = true,
      social
    } = req.body;
    
    if (!name || !email || !position) {
      return res.status(400).json({ success: false, message: '姓名、邮箱和职位不能为空' });
    }
    
    // Check if email already exists
    const existingMember = sampleMembers.find(member => member.email === email);
    if (existingMember) {
      return res.status(400).json({ success: false, message: '该邮箱已存在' });
    }
    
    const newMember = {
      _id: Date.now().toString(),
      name,
      email,
      position,
      department: department || 'Other',
      bio: bio || '',
      skills: skills || [],
      avatar: avatar || '',
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      isActive,
      social: social || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    sampleMembers.push(newMember);
    
    res.status(201).json({
      success: true,
      message: '成员添加成功',
      data: newMember
    });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ success: false, message: '添加成员失败' });
  }
});

// PUT /api/members/:id - 更新成员 (需要认证)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const memberIndex = sampleMembers.findIndex(member => member._id === id);
    
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: '成员不存在' });
    }
    
    const member = sampleMembers[memberIndex];
    
    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== member.email) {
      const existingMember = sampleMembers.find(m => m.email === updateData.email && m._id !== id);
      if (existingMember) {
        return res.status(400).json({ success: false, message: '该邮箱已存在' });
      }
    }
    
    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key === 'joinDate') {
        member[key] = updateData[key] ? new Date(updateData[key]) : member[key];
      } else if (key !== '_id' && key !== 'createdAt') {
        member[key] = updateData[key];
      }
    });
    
    member.updatedAt = new Date();
    
    res.json({
      success: true,
      message: '成员信息更新成功',
      data: member
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ success: false, message: '更新成员信息失败' });
  }
});

// DELETE /api/members/:id - 删除成员 (需要认证)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const memberIndex = sampleMembers.findIndex(member => member._id === id);
    
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: '成员不存在' });
    }
    
    sampleMembers.splice(memberIndex, 1);
    
    res.json({
      success: true,
      message: '成员删除成功'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ success: false, message: '删除成员失败' });
  }
});

module.exports = router;