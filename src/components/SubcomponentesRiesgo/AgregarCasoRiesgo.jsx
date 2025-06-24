import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ActivacionRiesgo from "./ActivacionRiesgo.jsx";
import SeguimientoRiesgo from "./SeguimientoRiesgo.jsx";
import FacturacionRiesgo from "./FacturacionRiesgo.jsx";
import ListaCasosRiesgo from "./ListaCasosRiesgo";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";

const initialFormData = {
  aseguradora: '',
  direccion: '',
  ciudad: null,
  asegurado: '',
  fechaAsignacion: '',
  fechaInspeccion: '',
  observaciones: '',
  estado: '',
  responsable: '',
  clasificacion: null,
  quienSolicita: null,
};

const AgregarCasoRiesgo = () => {
  const [pestanaActiva, setPestanaActiva] = useState('activacion');
  const [formData, setFormData] = useState(initialFormData);
  const { agregarCaso } = useCasosRiesgo();
  const navigate = useNavigate();

  const guardarCaso = () => {
    agregarCaso({
      ...formData,
      ciudad: formData.ciudad ? formData.ciudad.label : "",
      quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : "",
      clasificacion: formData.clasificacion ? formData.clasificacion.label : "",
    });
    // Opcional: limpiar el formulario
    setFormData(initialFormData);
  };

  const nuevoCaso = () => {
    setFormData(initialFormData);
  };

  const iniciarInspeccion = () => {
    const { ciudad, ...rest } = formData;
    navigate('/formularioinspeccion', {
      state: {
        ...rest,
        nombreCliente: formData.asegurado, // <-- Aquí el mapeo correcto
        quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : "",
        clasificacion: formData.clasificacion ? formData.clasificacion.label : "",
        // No se envía ciudad ni departamento
      }
    });
  };

  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'activacion':
        return <ActivacionRiesgo formData={formData} setFormData={setFormData} />;
      case 'seguimiento':
        return <SeguimientoRiesgo formData={formData} setFormData={setFormData} />;
      case 'facturacion':
        return <FacturacionRiesgo formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'activacion'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('activacion')}
        >
          Activación
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'seguimiento'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('seguimiento')}
        >
          Seguimiento
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            pestanaActiva === 'facturacion'
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          onClick={() => setPestanaActiva('facturacion')}
        >
          Facturación
        </button>
      </div>
      {renderizarContenido()}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          type="button"
          onClick={guardarCaso}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
        >
          GUARDAR
        </button>
        <button
          type="button"
          onClick={nuevoCaso}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold"
        >
          NUEVO CASO
        </button>
        <button
          type="button"
          onClick={iniciarInspeccion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
        >
          INICIAR INSPECCIÓN
        </button>
      </div>
      <ListaCasosRiesgo />
    </div>
  );
};

export default AgregarCasoRiesgo;
