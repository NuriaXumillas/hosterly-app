require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/property.model');
const properties = require('../data/properties.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Eliminar datos existentes
    await Property.deleteMany();
    console.log('Propiedades existentes eliminadas');

    // Insertar nuevas propiedades
    const createdProperties = await Property.insertMany(properties);
    console.log(`${createdProperties.length} propiedades insertadas correctamente`);

    process.exit(0);
  } catch (error) {
    console.error('Error en el seeding:', error);
    process.exit(1);
  }
};

seedDatabase();