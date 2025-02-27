const createError = require("http-errors");
const User = require("../models/user.model");
const bcrypt = require('bcryptjs');


// Registrar un nuevo usuario (función "registerUser")
module.exports.registerUser = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(
          createError(400, {
            message: "User email already taken",
            errors: { email: "Already exists" },
          })
        );
      } else {
        return User.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          avatar: req.file?.path,
        }).then((user) => {
        

          res.status(201).json(user);
        });
      }
    })
    .catch((error) => next(error));
};


// Login de usuario (función "loginUser")
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return next(createError(400, "Email y contraseña son requeridos"));
  }

  try {
    // Buscar usuario por email 
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!user) {
      return next(createError(401, "Credenciales inválidas")); 
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(401, "Credenciales inválidas contraseña")); // quitar luego eñ contraseñas
    }

    // Autenticación exitosa (crear sesión/JWT)
    req.session.userId = user._id;
    res.status(200).json({ user: user.toJSON() });

  } catch (err) {
    next(createError(500, "Error en el servidor"));
  }
};


// Obtener todos los usuarios (solo admin) 
module.exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.json(users))
    .catch(next);
};

// Eliminar todos los usuarios (solo admin) 
module.exports.deleteAllUsers = (req, res, next) => {
  User.deleteMany()  // Eliminar todos los usuarios
    .then(() => res.status(204).send())  // Responder con un status 204 (sin contenido)
    .catch(next);
};

// Obtener perfil del usuario (función "profile")
module.exports.profile = (req, res, next) => {
  res.json(req.user);  
};
