const path = require('path');

// 上传文件
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未检测到上传文件' });
  }
  // 返回文件的访问路径
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
}; 