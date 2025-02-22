const express = require('express');
const { registerUser, loginUser, getAllUsers, deleteAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.delete('/', deleteAllUsers);

module.exports = router;
