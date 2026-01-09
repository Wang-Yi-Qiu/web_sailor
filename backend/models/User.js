const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'user'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  profile: {
    fullName: String,
    bio: String,
    skills: [String],
    joinDate: {
      type: Date,
      default: Date.now
    },
    phone: String,
    location: String
  },
  permissions: [{
    type: String,
    enum: [
      'manage_articles',
      'manage_projects',
      'manage_members',
      'manage_users',
      'manage_roles',
      'manage_system',
      'view_analytics',
      'edit_profile',
      'upload_avatar'
    ]
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 验证密码方法
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 更新最后登录时间
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 