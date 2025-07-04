import React, { useState, useRef } from "react";
import colombia from "../../data/colombia.json";

// Genera un array plano de todas las ciudades
const todasLasCiudades = colombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    nombre: ciudad,
    departamento: dep.departamento,
  }))
);

function DropZone({ onFile, label }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed rounded px-4 py-8 text-center cursor-pointer text-gray-500 hover:border-blue-400 transition"
      style={{ minHeight: 80 }}
    >
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])}
      />
      <div>
        <span role="img" aria-label="upload">
          📁
        </span>
        <div>{label}</div>
        <div className="text-xs text-gray-400">
          Arrastra un archivo o haz clic aquí
        </div>
      </div>
    </div>
  );
}

export default function SeguimientoRiesgo() {
  const [ciudad, setCiudad] = useState("");
  const [consecutivo, setConsecutivo] = useState("");
  const [obsAsignacion, setObsAsignacion] = useState("");
  const [adjuntoInspeccion, setAdjuntoInspeccion] = useState(null);
  const [adjuntoAsignacion, setAdjuntoAsignacion] = useState(null);
  const [fechaInforme, setFechaInforme] = useState("");
  const [adjuntoFinal, setAdjuntoFinal] = useState(null);
  const [obsFinal, setObsFinal] = useState("");

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-blue-800">
        Seguimiento de Riesgo
      </h2>

      {/* Solo el select de ciudad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">
            Ciudad Sucursal Aseguradora
          </label>
          <select
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Seleccione...</option>
            {todasLasCiudades.map((c, idx) => (
              <option key={idx} value={c.nombre}>
                {c.nombre} ({c.departamento})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Consecutivo Aseguradora
          </label>
          <input
            type="text"
            value={consecutivo}
            onChange={(e) => setConsecutivo(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Adjuntos y observaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">Adjunto Inspección</label>
          <DropZone onFile={setAdjuntoInspeccion} label="Adjunta inspección" />
          {adjuntoInspeccion && (
            <div className="text-xs mt-1">{adjuntoInspeccion.name}</div>
          )}
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Observaciones Asignación
          </label>
          <textarea
            value={obsAsignacion}
            onChange={(e) => setObsAsignacion(e.target.value)}
            className="w-full border rounded px-2 py-1 min-h-[80px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="font-semibold block mb-1">Adjunto Asignación</label>
          <DropZone onFile={setAdjuntoAsignacion} label="Adjunta asignación" />
          {adjuntoAsignacion && (
            <div className="text-xs mt-1">{adjuntoAsignacion.name}</div>
          )}
        </div>
        <div>
          <label className="font-semibold block mb-1">Fecha de Informe</label>
          <input
            type="date"
            value={fechaInforme}
            onChange={(e) => setFechaInforme(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold block mb-1">Adjunto Informe Final</label>
          <DropZone onFile={setAdjuntoFinal} label="Adjunta informe final" />
          {adjuntoFinal && <div className="text-xs mt-1">{adjuntoFinal.name}</div>}
        </div>
        <div>
          <label className="font-semibold block mb-1">
            Observaciones Informe Final
          </label>
          <textarea
            value={obsFinal}
            onChange={(e) => setObsFinal(e.target.value)}
            className="w-full border rounded px-2 py-1 min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}