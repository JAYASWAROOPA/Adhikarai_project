const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, profileController.getProfile);
router.post('/', verifyToken, profileController.updateProfile);

module.exports = router;
