const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  // Crear el usuario
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin (opcional, dependiendo de tu lógica de negocio)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}); // Busca todos los usuarios en la base de datos
    res.status(200).json(users); // Devuelve los usuarios en formato JSON
  } catch (error) {
    res.status(500);
    throw new Error('Error al obtener los usuarios');
  }
});

// @desc    Borrar todos los usuarios
// @route   DELETE /api/users
// @access  Private/Admin (recomendado para proteger esta acción)
const deleteAllUsers = asyncHandler(async (req, res) => {
    try {
      // Eliminar todos los usuarios
      await User.deleteMany({});
      res.status(200).json({ message: 'Todos los usuarios han sido eliminados' });
    } catch (error) {
      res.status(500);
      throw new Error('Error al eliminar los usuarios');
    }
  });

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por email
  const user = await User.findOne({ email });

  // Verificar si el usuario existe y la contraseña coincide
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email o contraseña inválidos');
  }
});

module.exports = { registerUser, loginUser, getAllUsers, deleteAllUsers }; // Exportación directa