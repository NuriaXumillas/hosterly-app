// src/pages/Bookings.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../api';
import { useAuth } from '../context/AuthContext';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchBookings();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mis reservas</h1>
      
      {loading ? (
        <p>Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <p>No tienes reservas. <Link to="/" className="text-blue-600">Buscar propiedades</Link></p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{booking.property.title}</h3>
                  <p className="text-gray-600">{booking.property.location}</p>
                  <p className="text-sm">
                    {new Date(booking.checkIn).toLocaleDateString()} - 
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-lg font-bold">{booking.totalPrice}€</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;