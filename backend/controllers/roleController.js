const Role = require('../models/Role');

// 获取所有角色
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: '获取角色失败' });
  }
};

// 创建角色
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const exists = await Role.findOne({ name });
    if (exists) return res.status(400).json({ message: '角色名已存在' });
    const role = await Role.create({ name, description, permissions });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: '创建角色失败' });
  }
};

// 更新角色
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(id, { name, description, permissions }, { new: true });
    if (!role) return res.status(404).json({ message: '角色不存在' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: '更新角色失败' });
  }
};

// 删除角色
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ message: '角色不存在' });
    res.json({ message: '角色已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除角色失败' });
  }
}; 