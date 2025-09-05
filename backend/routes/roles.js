const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');

// 获取所有角色
router.get('/', protect, isAdmin, getRoles);
// 创建角色
router.post('/', protect, isAdmin, createRole);
// 更新角色
router.put('/:id', protect, isAdmin, updateRole);
// 删除角色
router.delete('/:id', protect, isAdmin, deleteRole);

module.exports = router; 