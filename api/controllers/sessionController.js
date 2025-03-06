const User = require("../models/user.model");
const createError = require("http-errors");

// Crear sesión 
module.exports.create = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(createError(401, "Credenciales inválidas"));
      }

      return user.checkPassword(password).then((match) => {
        if (!match) {
          throw createError(401, "Credenciales inválidas");
        }

        // Guarda el userId en la sesión
        req.session.userId = user._id; 
        user.active = true;
        return user.save().then(() => res.json(user));
      });
    })
    .catch(next);
};

// Destruir sesión 
module.exports.destroy = (req, res, next) => {
  User.findByIdAndUpdate(
    req.session.userId,
    { active: false },
    { new: true }
  )
    .then(() => {
      req.session.destroy(); 
      res.status(204).send();
    })
    .catch(next);
};