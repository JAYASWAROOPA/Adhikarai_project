const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');

router.get('/nearby', officeController.getNearbyOffices);
router.get('/categories', officeController.getCategories);
router.get('/scheme/:id', officeController.getOfficesForScheme);
router.get('/:id', officeController.getOfficeById);

module.exports = router;
