// userRoutes.js
const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteAllUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware'); 
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getAllUsers); // ruta privada
router.delete('/', protect, admin, deleteAllUsers); // ruta orivada

module.exports = router;