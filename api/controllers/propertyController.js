const Property = require('../models/property');
const asyncHandler = require('express-async-handler');
const upload = require('../config/cloudinary.config');
const Booking = require('../models/booking');
const dayjs = require('dayjs');

// @desc    Obtener todas las propiedades (filtradas por lugar y fecha)
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { location, date } = req.query;

  // Crear un objeto de filtro vacío
  const filter = {};

  // Filtrar por lugar (si se proporciona)
  if (location) {
    filter.location = { $regex: location, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
  }

  // Filtrar por fecha (si se proporciona)
  if (date) {
    const selectedDate = dayjs(date); // Convertir la fecha a objeto Day.js
    filter.availableFrom = { $lte: selectedDate.toDate() }; // Disponible desde <= fecha seleccionada
    filter.availableTo = { $gte: selectedDate.toDate() }; // Disponible hasta >= fecha seleccionada
  }

  // Obtener las propiedades filtradas
  const properties = await Property.find(filter).populate('user', 'name email');
  res.json(properties);
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

// @desc    Crear una nueva propiedad
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
  const { title, description, location, availableFrom, availableTo } = req.body;

  // Verificar si se subió una imagen
  if (!req.file) {
    res.status(400);
    throw new Error('Por favor, sube una imagen');
  }

  const property = await Property.create({
    title,
    description,
    location,
    photo: req.file.path, // URL de la imagen en Cloudinary
    availableFrom,
    availableTo,
    user: req.user._id,
  });

  res.status(201).json(property);
});

// @desc    Actualizar una propiedad
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
  const { title, description, location, availableFrom, availableTo } = req.body;

  const property = await Property.findById(req.params.id);

  if (property) {
    property.title = title || property.title;
    property.description = description || property.description;
    property.location = location || property.location;
    property.availableFrom = availableFrom || property.availableFrom;
    property.availableTo = availableTo || property.availableTo;

    // Si se sube una nueva imagen, actualiza el campo photo
    if (req.file) {
      property.photo = req.file.path;
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } else {
    res.status(404);
    throw new Error('Propiedad no encontrada');
  }
});

module.exports = { getProperties, createProperty, updateProperty, checkAvailability };