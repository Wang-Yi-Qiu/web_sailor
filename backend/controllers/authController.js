const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: '用户名或邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      role: 'user',
      permissions: ['edit_profile', 'upload_avatar']
    });

    // 生成令牌
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      return res.status(401).json({ message: '账户已被禁用' });
    }

    // 更新最后登录时间
    await user.updateLastLogin();

    // 生成令牌
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, skills, phone, location } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.profile = {
        ...user.profile,
        fullName: fullName || user.profile.fullName,
        bio: bio || user.profile.bio,
        skills: skills || user.profile.skills,
        phone: phone || user.profile.phone,
        location: location || user.profile.location
      };

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新密码
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: '当前密码错误' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: '密码更新成功' });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // 只允许图片和常见文档
    const allowed = [
      'image/png', 'image/jpeg', 'image/gif',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('不支持的文件类型'))
  }
}) 