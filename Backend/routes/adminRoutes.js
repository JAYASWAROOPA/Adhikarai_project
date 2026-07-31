const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Enforce strict Admin authentication & RBAC authorization
router.use(verifyToken);
router.use(requireRole('admin'));

router.post('/officers', adminController.createOfficer);
router.get('/officers', adminController.getOfficers);
router.get('/analytics', adminController.getAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
