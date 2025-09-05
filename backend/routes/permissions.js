const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getPermissions } = require('../controllers/permissionController');

router.get('/', protect, isAdmin, getPermissions);

module.exports = router; 