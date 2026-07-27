const express = require('express');
const router = express.Router();
const autoFillController = require('../controllers/autoFillController');

router.get('/autofill/:schemeId', autoFillController.getAutoFillData);
router.post('/submit', autoFillController.submitApplication);

module.exports = router;
