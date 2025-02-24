import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProperties } from '../api';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        // Modificar la API para aceptar el parámetro de búsqueda
        const data = await getProperties(searchQuery);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          {searchQuery ? `Resultados para "${searchQuery}"` : 'Todas las propiedades'}
        </h2>
        
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando propiedades...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600">No se encontraron propiedades.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default Properties;