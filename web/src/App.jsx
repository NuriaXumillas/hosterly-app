import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/ui/navbar/navbar";
import Home from "./assets/pages/home";
import { AuthProvider } from "./context/auth-context";
import "./App.css";
import PropertyDetail from "./assets/pages/propertyDetail";
import LoginForm from "./assets/pages/loginForm";

export default function App() {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties/:propertyId" element={<PropertyDetail />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
