const express = require('express');
const { createBooking, getUserBookings, checkAvailability, deleteBooking } = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createBooking) // Crear una reserva
  .get(protect, getUserBookings); // Obtener reservas del usuario

router.route('/:id/availability')
  .get(checkAvailability); // Verificar disponibilidad de una propiedad

router.route('/:id')
  .delete(protect, deleteBooking); // Borrar una reserva

module.exports = router;