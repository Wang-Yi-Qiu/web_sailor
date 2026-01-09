const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role; 