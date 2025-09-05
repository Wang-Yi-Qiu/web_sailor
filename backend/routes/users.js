const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// 获取所有用户
router.get('/', protect, isAdmin, getUsers);
// 创建用户
router.post('/', protect, isAdmin, createUser);
// 更新用户
router.put('/:id', protect, isAdmin, updateUser);
// 删除用户
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router; 