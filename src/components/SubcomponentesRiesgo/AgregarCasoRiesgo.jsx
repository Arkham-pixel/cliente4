import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import ActivacionRiesgo from "./ActivacionRiesgo.jsx";
import SeguimientoRiesgo from "./SeguimientoRiesgo.jsx";
import FacturacionRiesgo from "./FacturacionRiesgo.jsx";
import ListaCasosRiesgo from "./ListaCasosRiesgo";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";
import ciudadesColombia from "../../data/colombia.json"; // si usas react-select
import axios from 'axios';

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
  const [estados, setEstados] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);

  useEffect(() => {
    axios.get('http://13.59.106.174:3000/api/estados/estados-riesgos')
      .then(res => setEstados(res.data))
      .catch(() => setEstados([]));
  }, []);

  useEffect(() => {
    axios.get('http://13.59.106.174:3000/api/clientes')
      .then(res => {
        // Extraer aseguradoras únicas por codiAsgrdra
        const mapa = new Map();
        res.data.forEach(c => {
          if (c.codiAsgrdra && c.rzonSocial) {
            mapa.set(c.codiAsgrdra, c.rzonSocial);
          }
        });
        setAseguradoras(Array.from(mapa, ([codiAsgrdra, rzonSocial]) => ({ codiAsgrdra, rzonSocial })));
      })
      .catch(() => setAseguradoras([]));
  }, []);

  useEffect(() => {
    axios.get('http://13.59.106.174:3000/api/responsables')
      .then(res => {
        setResponsables(res.data.map(r => ({ codiRespnsble: r.codiRespnsble, nmbrRespnsble: r.nmbrRespnsble })));
      })
      .catch(() => setResponsables([]));
  }, []);

  useEffect(() => {
    axios.get('http://13.59.106.174:3000/api/estados/clasificaciones-riesgo')
      .then(res => {
        setClasificaciones(res.data.map(c => ({ codIdentificador: c.codIdentificador, rzonDescripcion: c.rzonDescripcion })));
      })
      .catch(() => setClasificaciones([]));
  }, []);

  const onEditarCaso = (caso, idx) => {
    // Mapeo robusto para todos los campos relacionales
    // Aseguradora
    let aseguradoraValue = '';
    if (caso.codiAsgrdra) {
      aseguradoraValue = String(caso.codiAsgrdra);
    } else if (caso.aseguradora) {
      const found = aseguradoras.find(a => a.rzonSocial === caso.aseguradora);
      aseguradoraValue = found ? String(found.codiAsgrdra) : '';
    }
    // Responsable (inspector) - prioriza codiIspector
    let responsableValue = '';
    if (caso.codiIspector) {
      responsableValue = String(caso.codiIspector);
    } else if (caso.codiRespnsble) {
      responsableValue = String(caso.codiRespnsble);
    } else if (caso.responsable) {
      const found = responsables.find(r => r.nmbrRespnsble === caso.responsable);
      responsableValue = found ? String(found.codiRespnsble) : '';
    } else if (caso.funcSolicita) {
      const found = responsables.find(r => r.nmbrRespnsble === caso.funcSolicita);
      responsableValue = found ? String(found.codiRespnsble) : '';
    }
    // Estado
    let estadoValue = '';
    if (caso.codiEstdo) {
      estadoValue = String(caso.codiEstdo);
    } else if (caso.estado) {
      const found = estados.find(e => e.descEstdo === caso.estado);
      estadoValue = found ? String(found.codiEstdo) : '';
    }
    // Ciudad
    let ciudadValue = null;
    if (typeof caso.ciudadSucursal === 'string' && caso.ciudadSucursal) {
      ciudadValue = ciudadesColombia.find(c => typeof c.label === 'string' && c.label.startsWith(caso.ciudadSucursal));
    } else if (typeof caso.ciudad === 'string' && caso.ciudad) {
      ciudadValue = ciudadesColombia.find(c => c.label === caso.ciudad);
    }
    // Clasificación
    let clasificacionValue = null;
    if (caso.codiClasificacion) {
      clasificacionValue = { label: caso.codiClasificacion, value: caso.codiClasificacion };
    } else if (caso.clasificacion) {
      clasificacionValue = { label: caso.clasificacion, value: caso.clasificacion };
    }
    // Quien Solicita
    let quienSolicitaValue = null;
    if (caso.funcSolicita) {
      quienSolicitaValue = { label: caso.funcSolicita, value: caso.funcSolicita };
    } else if (caso.quienSolicita) {
      quienSolicitaValue = { label: caso.quienSolicita, value: caso.quienSolicita };
    }
    setFormData({
      nmroRiesgo: caso.nmroRiesgo || '',
      aseguradora: aseguradoraValue,
      responsable: responsableValue,
      codiEstdo: estadoValue,
      ciudad: ciudadValue,
      clasificacion: clasificacionValue,
      quienSolicita: quienSolicitaValue,
      // ...otros campos normales...
      codiIspector: caso.codiIspector || '',
      codiAsgrdra: caso.codiAsgrdra || '',
      asgrBenfcro: caso.asgrBenfcro || '',
      nmroConsecutivo: caso.nmroConsecutivo || '',
      fchaAsgncion: caso.fchaAsgncion ? new Date(caso.fchaAsgncion).toISOString().slice(0,10) : '',
      observAsignacion: caso.observAsignacion || '',
      adjuntoAsignacion: caso.adjuntoAsignacion || null,
      fchaInspccion: caso.fchaInspccion ? new Date(caso.fchaInspccion).toISOString().slice(0,10) : '',
      observInspeccion: caso.observInspeccion || '',
      adjuntoInspeccion: caso.adjuntoInspeccion || null,
      fchaInforme: caso.fchaInforme ? new Date(caso.fchaInforme).toISOString().slice(0,10) : '',
      anxoInfoFnal: caso.anxoInfoFnal || null,
      observInforme: caso.observInforme || '',
      codDireccion: caso.codDireccion || '',
      funcSolicita: caso.funcSolicita || '',
      codigoPoblado: caso.codigoPoblado || '',
      ciudadSucursal: caso.ciudadSucursal || '',
      vlorTarifaAseguradora: caso.vlorTarifaAseguradora || '',
      vlorHonorarios: caso.vlorHonorarios || '',
      vlorGastos: caso.vlorGastos || '',
      nmroFactra: caso.nmroFactra || '',
      fchaFactra: caso.fchaFactra ? new Date(caso.fchaFactra).toISOString().slice(0,10) : '',
      totalPagado: caso.totalPagado || '',
      anxoFactra: caso.anxoFactra || null,
      asegurado: caso.asgrBenfcro || caso.asegurado || '',
      direccion: caso.codDireccion || caso.direccion || '',
      fechaAsignacion: caso.fchaAsgncion ? new Date(caso.fchaAsgncion).toISOString().slice(0,10) : '',
      fechaInspeccion: caso.fchaInspccion ? new Date(caso.fchaInspccion).toISOString().slice(0,10) : '',
      observaciones: caso.observInspeccion || '',
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
        return <ActivacionRiesgo formData={formData} setFormData={setFormData} estados={estados} aseguradoras={aseguradoras} responsables={responsables} clasificaciones={clasificaciones} />;
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

  // Efecto para auto-seleccionar responsable cuando la lista esté lista y estés editando
  useEffect(() => {
    if (editando && responsables.length > 0 && casoEditadoIndex !== null) {
      const caso = casos[casoEditadoIndex];
      if (caso && (!formData.responsable || formData.responsable === '')) {
        setFormData(prev => ({
          ...prev,
          responsable: caso.codiRespnsble ? String(caso.codiRespnsble) : (caso.responsable || ''),
        }));
      }
    }
    // eslint-disable-next-line
  }, [responsables, editando, casoEditadoIndex]);

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
      {formData.nmroRiesgo && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ color: 'red', fontSize: '2rem', fontWeight: 'bold' }}>
            N° Riesgo: {formData.nmroRiesgo}
          </span>
        </div>
      )}
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
      {/* Select de Estado conectado a la lista real */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Estado *</label>
        <select
          value={formData.codiEstdo ? String(formData.codiEstdo) : ''}
          onChange={e => setFormData({ ...formData, codiEstdo: e.target.value })}
          className="border px-3 py-2 rounded w-full"
          required
        >
          <option value="">Selecciona estado</option>
          {estados.map(est => (
            <option key={est.codiEstdo} value={String(est.codiEstdo)}>
              {est.descEstdo}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AgregarCasoRiesgo;
