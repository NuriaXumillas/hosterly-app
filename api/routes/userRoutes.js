// userRoutes.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteAllUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware'); // Crear este middleware si no existe
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getAllUsers); // Solo admin
router.delete('/', protect, admin, deleteAllUsers); // Solo admin

module.exports = router;