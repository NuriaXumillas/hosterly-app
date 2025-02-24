import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Hosterly
          </Link>
          
          {/* Menú derecho */}
          <div className="flex items-center space-x-4 relative">
            {user ? (
              <>
                <button 
                  onClick={toggleMenu}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </button>

                {/* Menú desplegable */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg py-2 w-48 z-50">
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Reservas
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-blue-600">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;