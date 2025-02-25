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
  .get(getProperties) // Obtener todas las propiedades
  .post(protect, upload.single('photo'), createProperty); // Crear una propiedad

router.route('/:id')
  .get(getPropertyById) // Obtener una propiedad por ID
  .put(protect, upload.single('photo'), updateProperty); // Actualizar una propiedad

router.route('/:id/availability')
  .get(checkAvailability); // Comprobar disponibilidad

module.exports = router;