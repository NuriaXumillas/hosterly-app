import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/auth-context';
import { getUserBookings, deleteBooking } from '../../services/api-service';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import dayjs from 'dayjs';

const BookingsPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadBookings = async () => {
      try {
        const response = await getUserBookings();
        
        // Transformar datos del backend al formato necesario
        const transformedBookings = response.bookings.map(booking => ({
          id: booking._id,
          checkIn: dayjs(booking.checkIn).format('YYYY-MM-DD'),
          checkOut: dayjs(booking.checkOut).format('YYYY-MM-DD'),
          price: booking.price,
          property: {
            id: booking.property._id,
            title: booking.property.title,
            location: booking.property.location,
            photo: booking.property.photo,
            availableFrom: booking.property.availableFrom,
            availableTo: booking.property.availableTo
          },
          createdAt: booking.createdAt
        }));
        
        setBookings(transformedBookings);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error cargando reservas');
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const handleDelete = async (bookingId) => {
    if (window.confirm('¿Estás seguro de querer cancelar esta reserva?')) {
      try {
        await deleteBooking(bookingId);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } catch (err) {
        setError('Error cancelando la reserva');
      }
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    return dayjs(checkOut).diff(dayjs(checkIn), 'day');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-rose-100 p-6 rounded-lg max-w-md text-center">
          <p className="text-rose-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Reservas</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tienes reservas activas</p>
            <Link 
              to="/properties" 
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Ver propiedades disponibles →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map(booking => (
              <div 
                key={booking.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img 
                  src={booking.property.photo} 
                  alt={booking.property.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.property.title}
                    </h3>
                    <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                      {calculateNights(booking.checkIn, booking.checkOut)} noches
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ubicación:</span>
                      <span className="text-gray-700">{booking.property.location}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check-in:</span>
                      <span className="text-gray-700">
                        {dayjs(booking.checkIn).format('DD/MM/YYYY')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check-out:</span>
                      <span className="text-gray-700">
                        {dayjs(booking.checkOut).format('DD/MM/YYYY')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div>
                      <p className="text-xl font-bold text-rose-600">
                        {booking.price}€
                      </p>
                      <p className="text-xs text-gray-500">
                        Reservado el {dayjs(booking.createdAt).format('DD/MM/YYYY')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-rose-500 hover:text-rose-600 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;