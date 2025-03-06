const createError = require("http-errors");
const User = require("../models/user.model");

module.exports.loadSessionUser = (req, res, next) => {
  const { userId } = req.session;
  
  if (!userId) {
    req.user = null;  
    next();
  } else {
    User.findById(userId)
      .then((user) => {
        if (user) {
          req.user = user;
        } else {
          req.user = null;  
        }
        next();
      })
      .catch((error) => next(error)); 
  }
}

module.exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();  // Si hay un usuario, sigue el flujo
  } else {
    next(createError(401, 'Unauthorized, missing credentials')); 
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();  // Si es admin, sigue el flujo
  } else {
    next(createError(403, 'Forbidden, insufficient access level')); 
  }
}
