import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../api';

function Home() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Encuentra tu alojamiento perfecto
          </h1>
          <p className="text-xl mb-8">
            Explora una amplia variedad de propiedades en las mejores ubicaciones.
          </p>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Propiedades destacadas
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando propiedades...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600">No hay propiedades disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src={property.photo || '/default-property.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <Link
                    to={`/properties/${property._id}`}
                    className="text-blue-600 hover:text-blue-500 font-semibold"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;