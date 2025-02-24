import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Hosterly
          </Link>

          {/* SearchBar integrada */}
          <div className="w-full md:max-w-xl px-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Buscar por ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Menú de navegación */}
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-800 hover:text-blue-600 transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-blue-600 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;