import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../../services/api-service";

function PropertyDetail() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (isLoading) {
    return <p className="text-center text-gray-600">Cargando detalles...</p>;
  }

  if (!property) {
    return <p className="text-center text-rose-500">No se encontró la propiedad.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to="/" className="text-rose-600 hover:text-rose-500 mb-4 inline-block">
        ← Volver a propiedades
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sección Izquierda - Detalles de la Propiedad */}
        <div className="space-y-4">
          <img 
            src={property.photo || "/web/public/default.jpg"} 
            alt={property.title} 
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold text-gray-800">📍 Ubicación</p>
            <p className="text-gray-600">{property.location}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold text-gray-800">📖 Descripción</p>
            <p className="text-gray-600 mt-2">{property.description}</p>
          </div>
        </div>

        {/* Sección Derecha - Reserva */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Reservar propiedad</h2>

          {/* Dueño */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Anfitrión</h3>
            <div className="flex items-center">
              <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-rose-600 font-medium">
                  {property.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{property.user?.name || 'Anfitrión'}</p>
                <p className="text-sm text-gray-500">{property.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-rose-600">{property.price}€</span>
              <span className="text-gray-500">por noche</span>
            </div>
          </div>

          {/* Botón de Reserva */}
          <button className="w-full py-3 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors">
            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
