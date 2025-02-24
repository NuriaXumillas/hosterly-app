import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; 

import Home from './pages/home';
import Properties from './pages/Properties';

function App() {
  return (
    <div>
      <Navbar /> {/* Usar el componente Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
      </Routes>
    </div>
  );
}

export default App;