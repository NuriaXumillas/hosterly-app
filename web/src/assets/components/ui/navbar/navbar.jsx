import { useAuthContext } from "../../../../context/auth-context";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, login, logout } = useAuthContext();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-rose-500">Hosterly</Link>
      
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name}</span>
          <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border border-gray-300" />
          <button onClick={logout} className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600">
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600">
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
