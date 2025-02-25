
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());

// // Conexión a MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Conectado a MongoDB'))
//   .catch(err => console.error('Error de conexión a MongoDB:', err));

// // Rutas
// app.use('/api/users', userRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Manejo de errores
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Algo salió mal!' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor ejecutándose en puerto ${PORT}`);
// });