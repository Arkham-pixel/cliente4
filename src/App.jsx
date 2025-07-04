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
import { CasosRiesgoProvider } from "./context/CasosRiesgoContext";
import Dashboard from './components/SubcomponenteRiesgoDash/Dashboard';
import ReporteRiesgo from './components/SubcompoeneteRiesgoExport/ReporteRiesgo';
import Cuenta from './components/SubcomponenteCuenta/Cuenta';
import MiCuenta from './components/SubcomponenteCuenta/miCuenta';
import FormularioMaquinaria from './components/SubcomponenteMaquinaria/FormularioMaquinaria';

export default function App() {
  return (
    <CasosRiesgoProvider>
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
          <Route path="riesgos/agregar" element={<AgregarCasoRiesgo />} /> 
          <Route path="riesgos/dashboard" element={<Dashboard />} />
          <Route path="riesgos/exportar" element={<ReporteRiesgo/>} />
          <Route path="riesgos/editar/:id" element={<AgregarCasoRiesgo />} />
          <Route path="cuenta" element={<Cuenta />} />
          <Route path="micuenta" element={<MiCuenta />} />
          <Route path="formulario-maquinaria" element={<FormularioMaquinaria />} /> 

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
    </CasosRiesgoProvider>
  );
}
