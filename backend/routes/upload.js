const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { uploadFile } = require('../controllers/uploadController');

// 设置 multer 存储位置和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

// 通用上传接口，所有登录用户可用
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router; 