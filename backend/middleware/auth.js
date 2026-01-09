const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证JWT令牌
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 获取令牌
      token = req.headers.authorization.split(' ')[1];

      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // 获取用户信息
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: '未授权，令牌无效' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，没有令牌' });
  }
};

// 验证角色权限
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `角色 ${req.user.role} 无权访问此资源`
      });
    }
    next();
  };
};

// 验证具体权限
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: `没有 ${permission} 权限`
      });
    }
    next();
  };
};

// 验证是否为超级管理员
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      message: '需要超级管理员权限'
    });
  }
  next();
};

// 验证是否为管理员（包括超级管理员）
exports.isAdmin = (req, res, next) => {
  if (!['super_admin', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      message: '需要管理员权限'
    });
  }
  next();
}; 