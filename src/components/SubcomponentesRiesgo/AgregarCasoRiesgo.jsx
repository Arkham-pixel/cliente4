import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ActivacionRiesgo from "./ActivacionRiesgo.jsx";
import SeguimientoRiesgo from "./SeguimientoRiesgo.jsx";
import FacturacionRiesgo from "./FacturacionRiesgo.jsx";
import ListaCasosRiesgo from "./ListaCasosRiesgo";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";
import ciudadesColombia from "../../data/colombia.json"; // si usas react-select

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
  const [editando, setEditando] = useState(false);
  const [casoEditadoIndex, setCasoEditadoIndex] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const { agregarCaso, editarCaso, casos } = useCasosRiesgo();
  const navigate = useNavigate();
  const { id } = useParams();

  const onEditarCaso = (caso, idx) => {
    setFormData({
      ...caso,
      ciudad: ciudadesColombia.find(c => c.label === caso.ciudad) || null,
      clasificacion: { label: caso.clasificacion, value: caso.clasificacion },
      quienSolicita: { label: caso.quienSolicita, value: caso.quienSolicita },
    });
    setEditando(true);
    setCasoEditadoIndex(idx);
    setPestanaActiva('activacion');
  };

  const guardarCaso = () => {
    const nuevoCaso = {
      ...formData,
      ciudad: formData.ciudad ? formData.ciudad.label : "",
      quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : "",
      clasificacion: formData.clasificacion ? formData.clasificacion.label : "",
    };
    if (editando && casoEditadoIndex !== null) {
      editarCaso(casoEditadoIndex, nuevoCaso);
      setEditando(false);
      setCasoEditadoIndex(null);
    } else {
      agregarCaso(nuevoCaso);
    }
    setFormData(initialFormData);
  };

  const nuevoCaso = () => {
    setFormData(initialFormData);
  };

  const iniciarInspeccion = () => {
    navigate('/formularioinspeccion', {
      state: {
        ...formData,
        nombreCliente: formData.asegurado,
        ciudad_siniestro: formData.ciudad && typeof formData.ciudad.label === "string" ? formData.ciudad.label : "",
        departamento_siniestro: formData.ciudad && typeof formData.ciudad.departamento === "string" ? formData.ciudad.departamento : "",
        quienSolicita: formData.quienSolicita ? formData.quienSolicita.label : "",
        clasificacion: formData.clasificacion ? formData.clasificacion.label : "",
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

  // Función para saber si hay coincidencia en algún campo
  const hayCoincidencia = (valor) => {
    if (!busqueda.trim()) return false;
    if (!valor) return false;
    return valor.toString().toLowerCase().includes(busqueda.toLowerCase());
  };

  // Ejemplo usando fetch (puedes usar axios si prefieres)
  useEffect(() => {
    if (busqueda.trim() === "") return; // No buscar si está vacío

    fetch(`/api/casos?busqueda=${encodeURIComponent(busqueda)}`)
      .then(res => res.json())
      .then(data => {
        // Aquí actualizas tu lista de casos con los resultados del backend
        // setCasos(data);
      });
  }, [busqueda]);

  useEffect(() => {
    if (id && casos.length > 0) {
      const idx = casos.findIndex(c => c.id_riesgo?.toString() === id || c.id?.toString() === id);
      if (idx !== -1) {
        onEditarCaso(casos[idx], idx);
      }
    }
    // eslint-disable-next-line
  }, [id, casos]);

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
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar en el formulario..."
          className="border px-3 py-2 rounded w-full max-w-lg"
        />
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
      <ListaCasosRiesgo onEditarCaso={onEditarCaso} />
      <p>
        {formData.ciudad && formData.ciudad.label
          ? formData.ciudad.label.split("/")[0]
          : ""}
      </p>
      <p>
        {formData.ciudad_siniestro ? formData.ciudad_siniestro.split("/")[0] : "_________"}
      </p>
    </div>
  );
};

export default AgregarCasoRiesgo;
