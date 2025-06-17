import React, { useState } from 'react';
import ActivacionRiesgo from "./ActivacionRiesgo.jsx";
// import SeguimientoRiesgo from "./AgregarCasoRiesgo/SeguimientoRiesgo.jsx";
// import FacturacionRiesgo from "./AgregarCasoRiesgo/FacturacionRiesgo.jsx";

const AgregarCasoRiesgo = () => {
  const [pestanaActiva, setPestanaActiva] = useState('activacion');

  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case 'activacion':
        return <ActivacionRiesgo />;
      case 'seguimiento':
        return <div>Seguimiento (pendiente)</div>; // <SeguimientoRiesgo />
      case 'facturacion':
        return <div>Facturación (pendiente)</div>; // <FacturacionRiesgo />
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${pestanaActiva === 'activacion' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPestanaActiva('activacion')}
        >
          Activación
        </button>
        <button
          className={`px-4 py-2 rounded ${pestanaActiva === 'seguimiento' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPestanaActiva('seguimiento')}
        >
          Seguimiento
        </button>
        <button
          className={`px-4 py-2 rounded ${pestanaActiva === 'facturacion' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPestanaActiva('facturacion')}
        >
          Facturación
        </button>
      </div>
      {renderizarContenido()}
    </div>
  );
};

export default AgregarCasoRiesgo;
