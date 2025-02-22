const Booking = require('../models/booking');
const Property = require('../models/property');
const asyncHandler = require('express-async-handler');
const dayjs = require('dayjs');

// @desc    Borrar una reserva
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
  
    // Verificar si la reserva existe
    if (!booking) {
      res.status(404);
      throw new Error('Reserva no encontrada');
    }
  
    // Verificar que el usuario que intenta borrar la reserva sea el propietario
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('No autorizado para borrar esta reserva');
    }
  
    // Borrar la reserva usando findByIdAndDelete()
    await Booking.findByIdAndDelete(req.params.id);
  
    res.json({ message: 'Reserva borrada correctamente' });
  });

// @desc    Crear una nueva reserva
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, totalPrice } = req.body;

  // Verificar si la propiedad existe
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Propiedad no encontrada');
  }

  // Convertir las fechas a objetos Day.js
  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);
  const availableFromDate = dayjs(property.availableFrom);
  const availableToDate = dayjs(property.availableTo);

  // Validación 1: Verificar que checkIn sea menor que checkOut
  if (checkInDate.isAfter(checkOutDate)) {
    res.status(400);
    throw new Error('La fecha de check-in debe ser anterior a la fecha de check-out');
  }

  // Validación 2: Verificar que las fechas estén dentro del rango de disponibilidad de la propiedad
  if (
    checkInDate.isBefore(availableFromDate) ||
    checkOutDate.isAfter(availableToDate)
  ) {
    res.status(400);
    throw new Error('Las fechas seleccionadas no están dentro del rango de disponibilidad de la propiedad');
  }

  // Validación 3: Verificar si las fechas están disponibles
  const isAvailable = await Booking.findOne({
    property: propertyId,
    $or: [
      { checkIn: { $lte: checkOutDate.toDate() }, checkOut: { $gte: checkInDate.toDate() } }, // Solapamiento de fechas
    ],
  });

  if (isAvailable) {
    res.status(400);
    throw new Error('La propiedad no está disponible en las fechas seleccionadas');
  }

  // Crear la reserva
  const booking = await Booking.create({
    property: propertyId,
    user: req.user._id,
    checkIn: checkInDate.toDate(),
    checkOut: checkOutDate.toDate(),
    totalPrice,
  });

  res.status(201).json(booking);
});

// @desc    Verificar la disponibilidad de una propiedad
// @route   GET /api/properties/:id/availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  const propertyId = req.params.id;

  // Convertir las fechas a objetos Day.js
  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);

  // Validación: Verificar que checkIn sea menor que checkOut
  if (checkInDate.isAfter(checkOutDate)) {
    res.status(400);
    throw new Error('La fecha de check-in debe ser anterior a la fecha de check-out');
  }

  // Obtener todas las reservas de la propiedad que se solapen con las fechas consultadas
  const overlappingBookings = await Booking.find({
    property: propertyId,
    $or: [
      { checkIn: { $lte: checkOutDate.toDate() }, checkOut: { $gte: checkInDate.toDate() } }, // Solapamiento de fechas
    ],
  });

  // Si hay reservas que se solapan, la propiedad no está disponible
  if (overlappingBookings.length > 0) {
    res.json({ available: false, message: 'La propiedad no está disponible en las fechas seleccionadas' });
  } else {
    res.json({ available: true, message: 'La propiedad está disponible en las fechas seleccionadas' });
  }
});

// @desc    Obtener todas las reservas de un usuario
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('property', 'title location photo');
  res.json(bookings);
});

module.exports = { createBooking, checkAvailability, getUserBookings, deleteBooking };