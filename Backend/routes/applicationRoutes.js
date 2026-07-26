const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, applicationController.getUserApplications);
router.post('/', verifyToken, applicationController.applyOrSaveScheme);

module.exports = router;
