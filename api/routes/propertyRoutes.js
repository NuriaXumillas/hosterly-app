const express = require('express');
const { 
  getProperties,
  getPropertyById, 
  createProperty,
  updateProperty,
  checkAvailability 
} = require('../controllers/propertyController');
const protect = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary.config');
const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, upload.single('photo'), createProperty);

router.route('/:id')
  .get(getPropertyById) // ← Ruta nueva
  .put(protect, upload.single('photo'), updateProperty);

router.route('/:id/availability')
  .get(checkAvailability);

module.exports = router;