import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import RutaPrivada from './components/RutaPrivada';
import { CasosRiesgoProvider } from './context/CasosRiesgoContext';

/**
 * App.jsx: un único BrowserRouter en el entry-point envuelve esta App.
 * Aquí definimos rutas públicas primero, redirigiendo "/" a "/login".
 * Luego envolvemos rutas protegidas (sin path) con RutaPrivada + Layout.
 */
export default function App() {
  return (
    <CasosRiesgoProvider>
      <Routes>
        {/* Redirige raíz a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas: cualquier ruta aquí requiere autenticación */}
        <Route
          element={
            <RutaPrivada>
              <Layout />
            </RutaPrivada>
          }
        >
          {/* Ahora todas estas rutas se renderizan dentro de Layout */}
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

        {/* Ruta catch-all: si no coincide, vuelve a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </CasosRiesgoProvider>
  );
}
