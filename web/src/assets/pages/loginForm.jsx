import { useForm } from "react-hook-form";
import { login as apiLogin } from "../../services/api-service"; 
import { useAuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (userData) => {
    try {
      await login(userData);
      navigate("/");
    } catch (error) {
      // Corregimos el manejo de errores
      if (error.response?.status === 401) {
        const backendErrors = error.response.data?.errors || {}; // <-- Usa un objeto vacío si no hay errores
        
        // Mapea los errores del backend a los nombres de los campos del formulario
        const fieldMappings = {
          email: "email",
          password: "password",
        };

        Object.keys(backendErrors).forEach((backendKey) => {
          const fieldName = fieldMappings[backendKey] || backendKey;
          setError(fieldName, { message: backendErrors[backendKey] });
        });
      } else {
        console.error("Error no controlado:", error);
      }
    }
  };

  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-700">Email</label>
            <input type="email"
              className={`w-full p-2 border ${errors.email ? "border-rose-500" : "border-black-300"} rounded-md`} 
              placeholder="user@example.org" 
              {...register("email", { required: "Introduce un email" })} />
            {errors.email && <p className="text-rose-500 text-sm">{errors.email.message}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-rose-700">Password</label>
            <input type="password"
              className={`w-full p-2 border ${errors.password ? "border-rose-500" : "border-black-300"} rounded-md`} 
              placeholder="****" 
              {...register("password", { required: "Introduce una contraseña" })} />
            {errors.password && <p className="text-rose-500 text-sm">{errors.password.message}</p>}
          </div>
  
          <button className="w-full bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );  
}

export default LoginForm;
