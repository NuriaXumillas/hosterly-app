const asyncHandler = require('express-async-handler');

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Acceso denegado. Se requieren privilegios de administrador');
  }
});

module.exports = admin;