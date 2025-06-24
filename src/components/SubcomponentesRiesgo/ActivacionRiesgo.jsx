import React from "react";
import Select from "react-select";
import ciudadesData from "../../data/colombia.json";

const clasificaciones = [
  { value: "ADMINISTRACIÓN DE RIESGOS", label: "ADMINISTRACIÓN DE RIESGOS" },
  { value: "COPROPIEDADES", label: "COPROPIEDADES" },
  { value: "HOGAR", label: "HOGAR" },
  { value: "HOSPITALES", label: "HOSPITALES" },
  { value: "INDUSTRIALES", label: "INDUSTRIALES" },
  { value: "MAQUINARIA AMARILLA", label: "MAQUINARIA AMARILLA" },
  { value: "PYME", label: "PYME" },
  { value: "PYME COMERCIAL", label: "PYME COMERCIAL" },
  { value: "PYME INDUSTRIAL", label: "PYME INDUSTRIAL" },
  { value: "TRC", label: "TRC" }
];

const solicitantes = [
  { value: "ADRIANA RAMÍREZ ORTIZ", label: "ADRIANA RAMÍREZ ORTIZ" },
  { value: "ANDERSON VICENTE RAMIREZ", label: "ANDERSON VICENTE RAMIREZ" },
  { value: "ÁNGEL ALBERTO RODRÍGUEZ LOPEZ", label: "ÁNGEL ALBERTO RODRÍGUEZ LOPEZ" },
  { value: "ANGELICA MARIA PEÑA", label: "ANGELICA MARIA PEÑA" },
  { value: "BELLA ENITH BONILLA BONILLA", label: "BELLA ENITH BONILLA BONILLA" },
  { value: "DIEGO ALEJANDRO MOYANO FIOLE", label: "DIEGO ALEJANDRO MOYANO FIOLE" },
  { value: "JOSÉ DANILO OVIEDO DURÁN", label: "JOSÉ DANILO OVIEDO DURÁN" },
  { value: "KARELLY SILVERA", label: "KARELLY SILVERA" },
  { value: "MAURICIO ALEXANDER LASSO BUSTOS", label: "MAURICIO ALEXANDER LASSO BUSTOS" },
  { value: "OSCAR ATARA", label: "OSCAR ATARA" },
  { value: "RAMONA BELKIS HERNANDEZ", label: "RAMONA BELKIS HERNANDEZ" },
  { value: "WILLIAM NUÑEZ", label: "WILLIAM NUÑEZ" },
  { value: "ESMERALDA DEL RIO ROA", label: "ESMERALDA DEL RIO ROA" },
  { value: "GABRIEL ANDRÉS MARTINEZ LESMES", label: "GABRIEL ANDRÉS MARTINEZ LESMES" },
  { value: "HEBERT ANDRÉS BAUTISTA NOVOA", label: "HEBERT ANDRÉS BAUTISTA NOVOA" }
];

// Construir opciones para react-select
const ciudadesColombia = ciudadesData.flatMap(dep =>
  dep.ciudades.map(ciudad => ({
    value: ciudad,
    label: `${ciudad} - ${dep.departamento}`,
    departamento: dep.departamento
  }))
);

const ActivacionRiesgo = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClasificacionChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      clasificacion: selectedOption
    }));
  };

  const handleSolicitaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      quienSolicita: selectedOption
    }));
  };

  const handleCiudadChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      ciudad: selectedOption
    }));
  };

  return (
    <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Iniciar Inspección</h2>
      <form>
        <div className="grid grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Aseguradora</label>
              <select
                name="aseguradora"
                value={formData.aseguradora}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Selecciona una aseguradora</option>
                <option value="PORTO & COMPAÑIA LTDA">PORTO & COMPAÑIA LTDA</option>
                <option value="UNISEG RIESGOS Y SEGUROS">UNISEG RIESGOS Y SEGUROS</option>
                <option value="ALIANZ SEGURO S.A.">ALIANZ SEGURO S.A.</option>
                <option value="ASEGURADORA SOLIDARIA DE COLOMBIA">ASEGURADORA SOLIDARIA DE COLOMBIA</option>
                <option value="AXA COLPATRIA SEGUROS S.A.">AXA COLPATRIA SEGUROS S.A.</option>
                <option value="BBVA SEGUROS COLOMBIA S.A.">BBVA SEGUROS COLOMBIA S.A.</option>
                <option value="CD ASESORES DE SEGUROS">CD ASESORES DE SEGUROS</option>
                <option value="CORPORACION DE VOLQUETEROS CORPORAVOL">CORPORACION DE VOLQUETEROS CORPORAVOL</option>
                <option value="CRAWFORD COLOMBIA S.A.S.">CRAWFORD COLOMBIA S.A.S.</option>
                <option value="ECOEQUIPOS COLOMBIA S.A.S">ECOEQUIPOS COLOMBIA S.A.S</option>
                <option value="EGON SEGUROS LTDA">EGON SEGUROS LTDA</option>
                <option value="EUROSEGUROS SU AGENCIA LTDA">EUROSEGUROS SU AGENCIA LTDA</option>
                <option value="ITAÚ CORREDOR DE SEGUROS">ITAÚ CORREDOR DE SEGUROS</option>
                <option value="JANNA SEGUROS LTDA.">JANNA SEGUROS LTDA.</option>
                <option value="LA EQUIDAD SEGUROS">LA EQUIDAD SEGUROS</option>
                <option value="LA PREVISORA S.A.">LA PREVISORA S.A.</option>
                <option value="LIBERTY SEGUROS S.A.">LIBERTY SEGUROS S.A.</option>
                <option value="MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.">MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.</option>
                <option value="MCA SEGUROS INTEGRLES LTDA">MCA SEGUROS INTEGRLES LTDA</option>
                <option value="PROSER AJUSTES SAS">PROSER AJUSTES SAS</option>
                <option value="SBS SEGUROS COLOMBIA S.A.">SBS SEGUROS COLOMBIA S.A.</option>
                <option value="SEGUROS ALFA S.A.">SEGUROS ALFA S.A.</option>
                <option value="SEGUTOS BOLÍVAR">SEGUTOS BOLÍVAR</option>
                <option value="SEGUROS CONFIANZA S.A.">SEGUROS CONFIANZA S.A.</option>
                <option value="SEGUROS DEL ESTADO">SEGUROS DEL ESTADO</option>
                <option value="SEGUROS GENERALES SURAMERICANA S.A.">SEGUROS GENERALES SURAMERICANA S.A.</option>
                <option value="ZÚRICH COLOMBIA SEGUROS S.A.">ZÚRICH COLOMBIA SEGUROS S.A.</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Clasificación *</label>
              <Select
                options={clasificaciones}
                value={formData.clasificacion}
                onChange={handleClasificacionChange}
                placeholder="Selecciona o busca una clasificación"
                isClearable
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Ciudad de Inspección *</label>
              <Select
                options={ciudadesColombia}
                value={formData.ciudad}
                onChange={handleCiudadChange}
                placeholder="Selecciona o busca ciudad y departamento"
                isClearable
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Asegurado *</label>
              <input
                type="text"
                name="asegurado"
                value={formData.asegurado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha de Inspección *</label>
              <input
                type="date"
                name="fechaInspeccion"
                value={formData.fechaInspeccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          {/* Columna 2 */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Inspector *</label>
              <select
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="border px-2 py-2 w-full rounded"
              >
                <option value="">Seleccionar...</option>
                {[
                  "Alexander Escalante",
                  "Alfonso Marquez",
                  "Andrés Mejía",
                  "Armando Fontalvo",
                  "Arnaldo Andrés Tapia Gutierrez",
                  "Bernardo Sojo Guzmán",
                  "Byron Leon",
                  "Dario Mayo",
                  "Elkin Gabriel Tapia Gutierrez",
                  "Gabriel Moreno",
                  "Guillermo Segundo Mangonez Arcia",
                  "Iskharly José Tapia Gutierrez",
                  "Ladys Andrea Escalante Bossio",
                  "Luis Enrique Truyol",
                  "María Fernanda Sanín",
                  "Maria Garcias",
                  "Mario Alberto Pinilla de la Torre",
                  "Milagro Navarro",
                  "Orlando Quijano"
                ].map((responsable, idx) => (
                  <option key={idx} value={responsable}>{responsable}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quien Solicita *</label>
              <Select
                options={solicitantes}
                value={formData.quienSolicita}
                onChange={handleSolicitaChange}
                placeholder="Selecciona o busca quien solicita"
                isClearable
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Dirección de inspección"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fecha de Asignación *</label>
              <input
                type="date"
                name="fechaAsignacion"
                value={formData.fechaAsignacion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Observaciones Inspección</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Observaciones de la inspección"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Estado *</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Selecciona estado</option>
            <option value="Asignado">Asignado</option>
            <option value="En proceso">En proceso</option>
            <option value="Facturado">Facturado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default ActivacionRiesgo;
