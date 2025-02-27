const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const createError = require("http-errors");
const properties = require("../controllers/propertyController");
const bookings = require("../controllers/bookingController");
const users = require("../controllers/userController");
const session = require("../controllers/sessionController"); 
const auth = require("../middlewares/session.middleware");
const storage = require("../config/storage.config");

// Booking Routes
router.get("/bookings", auth.isAuthenticated, bookings.getUserBookings);
router.post("/bookings", auth.isAuthenticated, bookings.createBooking);
router.get("/bookings/:id/availability", bookings.checkAvailability);
router.delete("/bookings/:id", auth.isAuthenticated, bookings.deleteBooking);

// Property Routes
router.get("/properties", properties.getProperties);
router.post("/properties", auth.isAuthenticated, storage.single("photo"), properties.createProperty);
router.get("/properties/:id", properties.getPropertyById);
router.put("/properties/:id", auth.isAuthenticated, storage.single("photo"), properties.updateProperty);
router.get("/properties/:id/availability", properties.checkAvailability);

// User Routes
router.post("/register", users.registerUser);
router.post("/login", users.loginUser);
router.get("/users", auth.isAuthenticated, auth.isAdmin, users.getAllUsers);
router.delete("/users", auth.isAuthenticated, auth.isAdmin, users.deleteAllUsers);


// Session Routes
router.post("/sessions", session.create);
router.delete("/sessions", auth.isAuthenticated, session.destroy);

// Errores
router.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

router.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.CastError && error.message.includes("_id"))
    error = createError(404, "Resource not found");
  else if (error instanceof mongoose.Error.ValidationError)
    error = createError(400, error);
  else if (!error.status) error = createError(500, error.message);

  console.error(error);
  const data = { message: error.message };
  if (error.errors) {
    data.errors = Object.keys(error.errors).reduce((errors, errorKey) => {
      errors[errorKey] = error.errors[errorKey]?.message || error.errors[errorKey];
      return errors;
    }, {});
  }
  res.status(error.status).json(data);
});


module.exports = router;
