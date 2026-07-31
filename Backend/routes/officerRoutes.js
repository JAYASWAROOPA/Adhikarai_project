const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Enforce strict Officer authentication & RBAC authorization
router.use(verifyToken);
router.use(requireRole('officer', 'admin'));

router.get('/applications', officerController.getAssignedApplications);
router.post('/applications/:appId/action', officerController.updateApplicationAction);

module.exports = router;
