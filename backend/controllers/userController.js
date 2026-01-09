const User = require('../models/User');
const Role = require('../models/Role');

// 获取所有用户
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户失败' });
  }
};

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: '用户名或邮箱已存在' });
    const user = await User.create({ username, email, password, role, permissions });
    res.status(201).json({ _id: user._id, username: user.username, email: user.email, role: user.role, permissions: user.permissions });
  } catch (error) {
    res.status(500).json({ message: '创建用户失败' });
  }
};

// 更新用户（含分配角色、权限）
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, permissions, isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, { username, email, role, permissions, isActive }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '更新用户失败' });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json({ message: '用户已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除用户失败' });
  }
}; 