import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; 
import Home from './pages/home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/propertyDetails';
import { AuthProvider } from './context/authContext';
import Bookings from './pages/bookings'; 
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <AuthProvider>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;

