const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');

router.get('/', schemeController.getAllSchemes);
router.get('/:id', schemeController.getSchemeById);

module.exports = router;
