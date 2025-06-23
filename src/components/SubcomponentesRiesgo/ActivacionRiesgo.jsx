import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActivacionRiesgo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aseguradora: '',
    direccion: '',
    ciudad: '',
    asegurado: '',
    fechaInspeccion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const iniciarInspeccion = () => {
    navigate('/formularioinspeccion', { state: formData });
  };

  return (
    <div className="p-4">
      <button onClick={iniciarInspeccion}>Iniciar Inspección</button>

      {/* Aquí vienen los campos, ejemplo: */}
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Aseguradora</label>
          <select
            name="aseguradora"
            value={formData.aseguradora}
            onChange={(e) => setFormData({ ...formData, aseguradora: e.target.value })}
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
        <div>
          <label className="block font-medium">Inspector *</label>
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
        {/* ... agregar más campos igual que estos */}
      </div>
      <button
        onClick={iniciarInspeccion}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        INICIAR INSPECCIÓN
      </button>

    </div>
  );
};

export default ActivacionRiesgo;
