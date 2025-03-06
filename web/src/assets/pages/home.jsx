import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../../services/api-service';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-rose-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            Encuentra tu alojamiento perfecto
          </h1>
          <p className="text-xl mb-8">
            Explora una amplia variedad de propiedades en las mejores ubicaciones.
          </p>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Propiedades destacadas
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando propiedades...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600">No hay propiedades disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <img
                  src={property.photo || '/default-property.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-rose-500">
                      {property.price}€ / noche
                    </span>
                    <Link
                      to={`/properties/${property._id}`}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                    >
                      Reservar
                    </Link>
                  </div>
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
