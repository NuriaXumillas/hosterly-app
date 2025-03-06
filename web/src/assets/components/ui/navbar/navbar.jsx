import { useAuthContext } from "../../../../context/auth-context";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-rose-500">Hosterly</Link>
      
      {user ? (
        <div className="relative flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-gray-700">{user.name}</span>
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-rose-300 transition"
            />
          </div>
          
          {/* Menú desplegable */}
          {isOpen && (
            <div 
              className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50"
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="p-2">
                <Link
                  to="/bookings"
                  className="block px-4 py-2 text-gray-700 hover:bg-rose-50 rounded-md transition"
                  onClick={() => setIsOpen(false)}
                >
                  Ver mis reservas
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50 rounded-md transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link 
          to="/login" 
          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
        >
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;