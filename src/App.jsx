import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Layout from './components/Layout';
import Inicio from './components/Inicio';
import FormularioInspeccion from './components/FormularioInspeccion';
import AgregarCaso from './components/AgregarCaso';
import ReporteComplex from './components/ReporteComplex';
import DashboardComplex from './components/DashboardComplex';
import AgregarCasoRiesgo from './components/SubcomponentesRiesgo/AgregarCasoRiesgo';
import Dashboard from './components/SubcomponenteRiesgoDash/Dashboard';
import ReporteRiesgo from './components/SubcompoeneteRiesgoExport/ReporteRiesgo';
import Cuenta from './components/SubcomponenteCuenta/Cuenta';
import MiCuenta from './components/SubcomponenteCuenta/miCuenta';
import FormularioMaquinaria from './components/SubcomponenteMaquinaria/FormularioMaquinaria';
import { CasosRiesgoProvider } from './context/CasosRiesgoContext';

// Helper para saber si está autenticado (puedes cambiar la lógica si usas contexto)
const isAuthenticated = () => !!localStorage.getItem('token');

// Componente wrapper para login que redirige si ya está autenticado
function LoginRedirect() {
  return isAuthenticated() ? <Navigate to="/inicio" replace /> : <Login />;
}

export default function App() {
  return (
    <CasosRiesgoProvider>
      <Routes>
        {/* Redirige raíz a /inicio */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas principales con Layout (menú siempre visible) */}
        <Route element={<Layout />}>
          <Route path="inicio" element={<Inicio />} />
          <Route path="formularioinspeccion" element={<FormularioInspeccion />} />
          <Route path="complex/agregar" element={<AgregarCaso />} />
          <Route path="complex/excel" element={<ReporteComplex />} />
          <Route path="complex/dashboard" element={<DashboardComplex />} />
          <Route path="editar-caso/:id" element={<AgregarCaso modoEdicion />} />
          <Route path="riesgos/agregar" element={<AgregarCasoRiesgo />} />
          <Route path="riesgos/dashboard" element={<Dashboard />} />
          <Route path="riesgos/exportar" element={<ReporteRiesgo />} />
          <Route path="riesgos/editar/:id" element={<AgregarCasoRiesgo />} />
          <Route path="cuenta" element={<Cuenta />} />
          <Route path="micuenta" element={<MiCuenta />} />
          <Route path="formulario-maquinaria" element={<FormularioMaquinaria />} />
        </Route>

        {/* Ruta catch-all: si no coincide, vuelve a /inicio */}
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </CasosRiesgoProvider>
  );
}
