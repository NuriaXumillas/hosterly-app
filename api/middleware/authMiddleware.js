const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// Middleware de protección para rutas privadas
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el encabezado Authorization contiene el token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del encabezado Authorization
      token = req.headers.authorization.split(' ')[1];

      // Si el token es válido, decodificarlo y obtener el ID del usuario
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario por el ID decodificado y adjuntarlo a req.user
      req.user = await User.findById(decoded.id).select('-password'); // Excluir la contraseña

      next();
    } catch (error) {
      console.error('Error en la verificación del token:', error);
      res.status(401);
      throw new Error('No autorizado, token inválido');
    }
  }

  // Si no se proporcionó un token
  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no se proporcionó token');
  }
});

module.exports = protect;
