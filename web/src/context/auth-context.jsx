import { createContext, useState, useEffect, useContext } from "react";
import { profile, login, logout } from "../services/api-service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await profile();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };

    checkUser();
  }, []);

 
const handleLogin = async (userData) => {
  try {
    const response = await login(userData); 
    setUser(response.user);
    localStorage.setItem('session', JSON.stringify(response.session));
  } catch (error) {
      console.error("Error logging in:", error);
      throw error;  
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: handleLogin,
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Añade este hook para consumir el contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  
  return context;
};