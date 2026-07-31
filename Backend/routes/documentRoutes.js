const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protect all Smart Vault routes with JWT authentication
router.use(verifyToken);

router.get('/', documentController.getDocuments);
router.post('/upload', documentController.uploadDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
