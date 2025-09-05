// 所有可用权限
const ALL_PERMISSIONS = [
  'manage_articles',
  'manage_projects',
  'manage_members',
  'manage_users',
  'manage_roles',
  'manage_system',
  'view_analytics',
  'edit_profile',
  'upload_avatar'
];

exports.getPermissions = (req, res) => {
  res.json(ALL_PERMISSIONS);
}; 