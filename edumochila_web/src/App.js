// src/App.js
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Catalogo from './components/Catalogo';
import Nosotros from './components/Nosotros';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import AgregarProducto from './components/AgregarProducto';
import EditarProducto from './components/EditarProducto';
import Checkout from './components/Checkout';
import CompraExitosa from "./components/CompraExitosa";
import MaestroHome from "./components/MaestroHome";
import MaestroSalon from "./MaestroSalon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/home" element={<Home />} />
         <Route path="/catalogo" element={<Catalogo />} />
         <Route path="/nosotros" element={<Nosotros />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/productos" element={<Productos />} />
         <Route path="/agregarproducto" element={<AgregarProducto />} />
         <Route path="/editarproducto/:id" element={<EditarProducto />} />
         <Route path="/checkout/:id_pr" element={<Checkout />} />
         <Route path="/compra-exitosa" element={<CompraExitosa />} />
         <Route path="/maestro" element={<MaestroHome />} />
         <Route path="/maestro/grupos" element={<MaestroSalon />} />

      </Routes>
    </Router>
  );
}

export default App;
