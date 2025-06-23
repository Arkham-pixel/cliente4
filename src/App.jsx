import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Inicio from './components/Inicio';
import FormularioInspeccion from './components/FormularioInspeccion';
import Layout from './components/Layout';
import AgregarCaso from './components/AgregarCaso'; 
import ReporteComplex from './components/ReporteComplex';
import DashboardComplex from './components/DashboardComplex';
import AgregarCasoRiesgo from './components/SubcomponentesRiesgo/AgregarCasoRiesgo';
import RutaPrivada from "./components/RutaPrivada";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="formularioinspeccion" element={<FormularioInspeccion />} />
        <Route path="complex/agregar" element={<AgregarCaso />} />
        <Route path="complex/excel" element={<ReporteComplex />} />
        <Route path="complex/dashboard" element={<DashboardComplex />} />
        <Route path="editar-caso/:id" element={<AgregarCaso modoEdicion={true} />} />
        <Route path="riesgo/agregar" element={<AgregarCasoRiesgo />} />
        {/* Puedes agregar más rutas aquí según sea necesario */}
      </Route>

      <Route
        path="/inicio"
        element={
          <RutaPrivada>
            <Inicio />
          </RutaPrivada>
        }
      />

      {/* Ruta por defecto (catch-all) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
