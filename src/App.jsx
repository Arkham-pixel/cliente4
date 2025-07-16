// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/login'
import Register from './components/Register'
import ResetPassword from './components/ResetPassword'
import Layout from './components/Layout'
import Inicio from './components/Inicio'
import FormularioInspeccion from './components/FormularioInspeccion'
import AgregarCaso from './components/AgregarCaso'
import ReporteComplex from './components/ReporteComplex'
import DashboardComplex from './components/DashboardComplex'
import AgregarCasoRiesgo from './components/SubcomponentesRiesgo/AgregarCasoRiesgo'
import Dashboard from './components/SubcomponenteRiesgoDash/Dashboard'
import ReporteRiesgo from './components/SubcompoeneteRiesgoExport/ReporteRiesgo'
import Cuenta from './components/SubcomponenteCuenta/Cuenta'
import MiCuenta from './components/SubcomponenteCuenta/miCuenta'
import FormularioMaquinaria from './components/SubcomponenteMaquinaria/FormularioMaquinaria'
import FormularioCasoComplex from './components/SubcomponenteCompex/FormularioCasoComplex'
import SiniestrosList from "./components/SiniestrosList";

import { CasosRiesgoProvider } from './context/CasosRiesgoContext'
import RequireAuth from './components/RequireAuth'

// Comprueba si tenemos un token en localStorage
const isAuthenticated = () => !!localStorage.getItem('token')

// Para redirigir al dashboard si ya estás logueado
function LoginRedirect() {
  return isAuthenticated()
    ? <Navigate to="/inicio" replace />
    : <Login />
}

// Función para guardar el caso complex
const guardarCasoComplex = async (formData) => {
  try {
    const response = await fetch('http://13.59.106.174:3000/api/complex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('¡Guardado exitoso!');
    } else {
      alert('Error al guardar');
    }
  } catch (error) {
    alert('Error de red');
  }
};

export default function App() {
  return (
    <CasosRiesgoProvider>
      <Routes>
        {/* Ruta raíz: si estás, vas a /inicio, si no, a /login */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/inicio" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas privadas protegidas por RequireAuth */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="inicio" element={<Inicio />} />
          <Route
            path="complex/formulario"
            element={<FormularioCasoComplex onSave={guardarCasoComplex} />}
          />
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
          <Route path="siniestros" element={<SiniestrosList />} />
        </Route>

        {/* Cualquier otra ruta redirige a la raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CasosRiesgoProvider>
  )
}
