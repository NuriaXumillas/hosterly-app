const Booking = require('../models/booking');
const Property = require('../models/property');
const asyncHandler = require('express-async-handler');
const dayjs = require('dayjs');

// @desc    Borrar una reserva
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
  
    if (!booking) {
      res.status(404).json({ success: false, message: 'Reserva no encontrada' });
      return;
    }
  
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'No tienes permiso para esta acción' });
      return;
    }
  
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Reserva eliminada correctamente',
      deletedId: req.params.id
    });
});

// @desc    Crear una nueva reserva
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, totalPrice } = req.body;

  // Validaciones básicas
  if (!propertyId || !checkIn || !checkOut || !totalPrice) {
    res.status(400).json({ 
      success: false,
      message: 'Faltan campos requeridos en la solicitud'
    });
    return;
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404).json({ 
      success: false,
      message: 'Propiedad no encontrada'
    });
    return;
  }

  if (totalPrice !== (property.price * nights)) {
    res.status(400).json({
      success: false,
      message: 'El precio total no coincide con el cálculo del servidor'
    });
    return;
  }

  await Property.findByIdAndUpdate(propertyId, {
    $addToSet: { bookings: newBooking._id }
  });
  

  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);
  const now = dayjs();
  const availableFrom = dayjs(property.availableFrom);
  const availableTo = dayjs(property.availableTo);

  // Validación de fechas contra disponibilidad de la propiedad
  if (
    checkInDate.isBefore(availableFrom) || 
    checkOutDate.isAfter(availableTo)
  ) {
    res.status(400).json({
      success: false,
      message: 'Las fechas seleccionadas están fuera del rango disponible de la propiedad'
    });
    return;
  }

  // Validación de orden de fechas
  if (checkInDate.isAfter(checkOutDate)) {
    res.status(400).json({
      success: false,
      message: 'La fecha de check-in debe ser anterior al check-out'
    });
    return;
  }

  if (checkInDate.isBefore(now)) {
    res.status(400).json({
      success: false,
      message: 'No se pueden reservar fechas pasadas'
    });
    return;
  }

  // Verificar disponibilidad contra otras reservas
  const overlappingBookings = await Booking.find({
    property: propertyId,
    $or: [
      { 
        checkIn: { $lte: checkOutDate.toDate() }, 
        checkOut: { $gte: checkInDate.toDate() } 
      }
    ]
  });

  if (overlappingBookings.length > 0) {
    res.status(409).json({
      success: false,
      message: 'La propiedad no está disponible en las fechas seleccionadas'
    });
    return;
  }

  // Crear reserva
  const newBooking = await Booking.create({
    property: propertyId,
    user: req.user._id,
    checkIn: checkInDate.toDate(),
    checkOut: checkOutDate.toDate(),
    totalPrice
  });

  const populatedBooking = await Booking.findById(newBooking._id)
    .populate('property', 'title location photo');

  res.status(201).json({
    success: true,
    message: 'Reserva creada exitosamente',
    booking: populatedBooking
  });
});

// @desc    Verificar disponibilidad
// @route   GET /api/properties/:id/availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  const propertyId = req.params.id;

  if (!checkIn || !checkOut) {
    res.status(400).json({
      success: false,
      message: 'Se requieren ambas fechas para la consulta'
    });
    return;
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404).json({
      success: false,
      message: 'Propiedad no encontrada'
    });
    return;
  }

  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);
  const availableFrom = dayjs(property.availableFrom);
  const availableTo = dayjs(property.availableTo);

  // Validación de rango de fechas de la propiedad
  if (
    checkInDate.isBefore(availableFrom) || 
    checkOutDate.isAfter(availableTo)
  ) {
    return res.json({
      success: true,
      available: false,
      message: 'Fuera del rango disponible de la propiedad'
    });
  }

  // Validación de orden de fechas
  if (checkInDate.isAfter(checkOutDate)) {
    res.status(400).json({
      success: false,
      message: 'Rango de fechas inválido'
    });
    return;
  }

  // Verificar solapamiento con otras reservas
  const overlappingBookings = await Booking.find({
    property: propertyId,
    $or: [
      { 
        checkIn: { $lte: checkOutDate.toDate() }, 
        checkOut: { $gte: checkInDate.toDate() } 
      }
    ]
  });

  const isAvailable = overlappingBookings.length === 0;

  res.json({
    success: true,
    available: isAvailable,
    message: isAvailable 
      ? 'Disponible para reservar' 
      : 'Fechas no disponibles'
  });
});

// @desc    Obtener reservas del usuario
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
  .populate({
    path: 'property',
    select: 'title location photo availableFrom availableTo',
    model: 'Property'
  })
  .sort({ checkIn: -1 });

  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
});

module.exports = { 
  createBooking, 
  checkAvailability, 
  getUserBookings, 
  deleteBooking 
};