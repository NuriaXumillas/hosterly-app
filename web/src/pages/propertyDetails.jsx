import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, checkAvailability, createBooking } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/authContext';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular noches y precio total
  const nights = checkIn && checkOut ? 
    Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = property ? nights * property.price : 0;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        setError('Error cargando la propiedad');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBooking = async () => {
    setIsProcessing(true);
    setError('');
    setSuccessMessage('¡Reserva realizada con éxito! Redirigiendo...');
    setTimeout(() => navigate('/bookings', { replace: true }), 1500);

    try {
      // Validaciones básicas
      if (!user) {
        navigate('/login');
        return;
      }

      if (!checkIn || !checkOut) {
        setError('Por favor selecciona ambas fechas');
        return;
      }

      // Verificar disponibilidad
      const availabilityResult = await checkAvailability(
        id,
        checkIn.toISOString(),
        checkOut.toISOString()
      );

      if (!availabilityResult.available) {
        setError('La propiedad no está disponible en estas fechas');
        return;
      }

      // Crear reserva
      await createBooking({
        propertyId: id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        totalPrice
      });

      setSuccessMessage('¡Reserva realizada con éxito! Redirigiendo...');
      setTimeout(() => navigate('/bookings'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la reserva');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (!property) return <div className="text-center py-8">Propiedad no encontrada</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to="/" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
        ← Volver a propiedades
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sección Izquierda - Detalles de la Propiedad */}
        <div className="space-y-4">
          <img 
            src={property.photo} 
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
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {property.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{property.user?.name || 'Anfitrión'}</p>
                <p className="text-sm text-gray-500">{property.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Precio y fechas */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">{property.price}€</span>
              <span className="text-gray-500">por noche</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={date => setCheckIn(date)}
                  minDate={new Date(property.availableFrom)}
                  maxDate={new Date(property.availableTo)}
                  className="w-full p-2 border rounded-lg"
                  placeholderText="Seleccionar fecha"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={date => setCheckOut(date)}
                  minDate={checkIn || new Date(property.availableFrom)}
                  maxDate={new Date(property.availableTo)}
                  className="w-full p-2 border rounded-lg"
                  placeholderText="Seleccionar fecha"
                />
              </div>
            </div>
          </div>

          {/* Botón y total */}
          <div className="mt-6">
            <div className="flex justify-between mb-4 font-medium">
              <span>Total:</span>
              <span>{totalPrice}€</span>
            </div>

            <button
              className={`w-full py-3 rounded-lg transition-colors ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : error.includes('disponible') 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={handleBooking}
              disabled={isProcessing || !checkIn || !checkOut}
            >
              {isProcessing ? 'Procesando...' : error.includes('disponible') ? 'No disponible' : 'Reservar ahora'}
            </button>

            {successMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            {error && !successMessage && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;