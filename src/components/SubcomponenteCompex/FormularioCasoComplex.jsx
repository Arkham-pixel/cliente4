import React, { useState, useEffect } from 'react';
import DatosGenerales from './DatosGenerales';
import ValoresPrestaciones from './ValoresPrestaciones';
import Trazabilidad from './Trazabilidad';
import Facturacion from './Facturacion';
import Honorarios from './Honorarios';
import Seguimiento from './Seguimiento';
import ObservacionesCliente from './ObservacionesCliente';
import { useDropzone } from 'react-dropzone';
// Importa aquí los demás subcomponentes cuando los crees

export default function FormularioCasoComplex({ initialData, onSave, onCancel }) {
  const [tabActiva, setTabActiva] = useState('datosGenerales');
  const [formData, setFormData] = useState({
    nmroAjste: '',
    nmroSinstro: '',
    nombIntermediario: '',
    codWorkflow: '',
    nmroPolza: '',
    codiRespnsble: '',
    nombreResponsable: '',
    codiAsgrdra: '',
    funcAsgrdra: '',
    nombreFuncionario: '',
    asgrBenfcro: '',
    tipoDucumento: '',
    numDocumento: '',
    tipoPoliza: '',
    ciudadSiniestro: '',
    amprAfctdo: '',
    descSinstro: '',
    causa_siniestro: '',
    estado: '',
    fchaAsgncion: '',
    fchaSinstro: '',
    fchaInspccion: '',
    fchaContIni: '',
    // ...otros campos existentes...
    historialDocs: [],
  });

  // Sincronizar historialDocs con initialData si existe (modo edición)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData, historialDocs: initialData.historialDocs || [] }));
    }
  }, [initialData]);

  // Estado local para historialDocs, sincronizado con formData
  const [historialDocs, setHistorialDocs] = useState([]);
  useEffect(() => {
    // Si cambia el formData (por edición), actualiza el historial local
    setHistorialDocs(formData.historialDocs || []);
  }, [formData.historialDocs]);
  useEffect(() => {
    // Si cambia el historial local, actualiza el formData global
    setFormData(prev => ({ ...prev, historialDocs }));
  }, [historialDocs]);

  // Handler de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estado' ? String(value) : value
    }));
  };

  // Handler para selects especiales (ejemplo: ciudad)
  const handleCiudadChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, ciudad_siniestro: selectedOption.value }));
  };

  // Handler para aseguradora
  const handleAseguradoraChange = (e) => {
    setFormData(prev => ({
      ...prev,
      aseguradora: e.target.value,
      funcionario_aseguradora: ''
    }));
  };

  // Estado para intermediarios
  const [intermediarios, setIntermediarios] = useState([
    "Intermediario A",
    "Intermediario B",
    "Intermediario C",
  ]);
  const [nuevoIntermediario, setNuevoIntermediario] = useState("");
  const agregarIntermediario = () => {
    if (
      nuevoIntermediario.trim() !== "" &&
      !intermediarios.includes(nuevoIntermediario)
    ) {
      setIntermediarios([...intermediarios, nuevoIntermediario]);
      setNuevoIntermediario("");
    }
  };

  // Dropzones para Trazabilidad
  const dropzonePropsContacto = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjuntos_contacto_inicial: files.join(',') }));
    }
  });
  const dropzonePropsInspeccion = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_acta_inspeccion: files.join(',') }));
    }
  });
  const dropzonePropsSolicitudDocs = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_solicitud_documento: files.join(',') }));
    }
  });
  const dropzonePropsInformePreliminar = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_informe_preliminar: files.join(',') }));
    }
  });
  const dropzonePropsInformeFinal = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_informe_final: files.join(',') }));
    }
  });
  const dropzonePropsUltimoDocumento = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_entrega_ultimo_documento: files.join(',') }));
    }
  });

  // Dropzone para Adjunto Factura
  const dropzonePropsFactura = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_factura: files.join(',') }));
    }
  });

  // Dropzone para Adjunto Honorarios
  const dropzonePropsHonorarios = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_honorarios: files.join(',') }));
    }
  });

  // Dropzone para Adjunto Observaciones del Cliente
  const dropzonePropsObservaciones = useDropzone({
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map(file => file.name);
      setFormData(prev => ({ ...prev, adjunto_observaciones_cliente: files.join(',') }));
    }
  });

  // Ejemplo de props para selects
  const [ciudades, setCiudades] = useState([]);
  const [aseguradoraOptions, setAseguradoraOptions] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [aseguradoraOptionsRaw, setAseguradoraOptionsRaw] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [estados, setEstados] = useState([]);

  // Fetch funcionarios cuando cambia la aseguradora
  useEffect(() => {
    if (formData.aseguradora) {
      // Buscar el cliente seleccionado para obtener su código
      const cliente = aseguradoraOptionsRaw.find(c => c.rzonSocial === formData.aseguradora);
      if (cliente && cliente.codiAsgrdra) {
        fetch(`http://13.59.106.174:3000/api/funcionarios-aseguradora?codiAsgrdra=${cliente.codiAsgrdra}`)
          .then(res => res.json())
          .then(data => {
            setFuncionarios(data.map(f => f.nmbrContcto));
          });
      } else {
        setFuncionarios([]);
      }
    } else {
      setFuncionarios([]);
    }
  }, [formData.aseguradora, aseguradoraOptionsRaw]);

  // Guardar los datos crudos de clientes para obtener el código
  useEffect(() => {
    fetch('http://13.59.106.174:3000/api/clientes')
      .then(res => res.json())
      .then(data => {
        setAseguradoraOptionsRaw(data);
        setAseguradoraOptions(data.map(c => c.rzonSocial));
      });
  }, []);

  useEffect(() => {
    fetch('http://13.59.106.174:3000/api/ciudades')
      .then(res => res.json())
      .then(data => {
        // Transformar para react-select: { value, label }
        setCiudades(data.map(c => ({
          value: c.descMunicipio,
          label: c.descMunicipio
        })));
        // console.log('Ciudades:', data);
      });
  }, []);

  useEffect(() => {
    fetch('http://13.59.106.174:3000/api/responsables')
      .then(res => res.json())
      .then(data => {
        setResponsables(data.map(r => r.nmbrRespnsble));
      });
  }, []);

  useEffect(() => {
    fetch('http://13.59.106.174:3000/api/estados')
      .then(res => res.json())
      .then(data => {
        const mapped = (data || [])
          .filter(e => typeof e.codiEstdo !== 'undefined' && e.codiEstdo !== null && typeof e.descEstdo !== 'undefined' && e.descEstdo !== null)
          .map(e => ({ value: String(e.codiEstdo), label: e.descEstdo }));
        setEstados(mapped);
      })
      .catch(err => {
        setEstados([]);
      });
  }, []);

  // Función para mapear los campos del frontend a los del backend
  function mapFormDataToBackend(formData) {
    return {
      numero_ajuste: formData.nmroAjste,
      codigo_workflow: formData.codWorkflow,
      numero_siniestro: formData.nmroSinstro,
      intermediario: formData.nombIntermediario,
      aseguradora: formData.aseguradora,
      funcionario_aseguradora: formData.funcionario_aseguradora,
      responsable: formData.codiRespnsble || formData.responsable,
      asegurado: formData.asgrBenfcro,
      tipo_documento: formData.tipoDucumento,
      numero_documento: formData.numDocumento,
      fecha_siniestro: formData.fchaSinstro,
      ciudad_siniestro: formData.ciudadSiniestro || formData.ciudad_siniestro,
      descripcion_siniestro: formData.descSinstro,
      estado: formData.estado,
      tipo_poliza: formData.tipoPoliza,
      causa_siniestro: formData.causa_siniestro,
      valor_reserva: formData.valor_reserva,
      valor_reclamo: formData.valor_reclamo,
      monto_indemnizar: formData.monto_indemnizar,
      fecha_contacto_inicial: formData.fchaContIni,
      observaciones_contacto_inicial: formData.observaciones_contacto_inicial,
      adjuntos_contacto_inicial: formData.adjuntos_contacto_inicial,
      fecha_inspeccion: formData.fchaInspccion,
      observacion_inspeccion: formData.observacion_inspeccion,
      adjunto_acta_inspeccion: formData.adjunto_acta_inspeccion,
      fecha_solicitud_documentos: formData.fecha_solicitud_documentos,
      observacion_solicitud_documento: formData.observacion_solicitud_documento,
      adjunto_solicitud_documento: formData.adjunto_solicitud_documento,
      fecha_informe_preliminar: formData.fecha_informe_preliminar,
      adjunto_informe_preliminar: formData.adjunto_informe_preliminar,
      observacion_informe_preliminar: formData.observacion_informe_preliminar,
      fecha_informe_final: formData.fecha_informe_final,
      adjunto_informe_final: formData.adjunto_informe_final,
      observacion_informe_final: formData.observacion_informe_final,
      fecha_ultimo_documento: formData.fecha_ultimo_documento,
      adjunto_entrega_ultimo_documento: formData.adjunto_entrega_ultimo_documento,
      numero_factura: formData.numero_factura,
      valor_servicio: formData.valor_servicio,
      valor_gastos: formData.valor_gastos,
      iva: formData.iva,
      reteiva: formData.reteiva,
      retefuente: formData.retefuente,
      reteica: formData.reteica,
      total_base: formData.total_base,
      total_factura: formData.total_factura,
      total_pagado: formData.total_pagado,
      fecha_factura: formData.fecha_factura,
      fecha_ultima_revision: formData.fecha_ultima_revision,
      observacion_compromisos: formData.observacion_compromisos,
      adjunto_factura: formData.adjunto_factura,
      fecha_ultimo_seguimiento: formData.fecha_ultimo_seguimiento,
      observacion_seguimiento_pendientes: formData.observacion_seguimiento_pendientes,
      adjunto_seguimientos_pendientes: formData.adjunto_seguimientos_pendientes,
      numero_poliza: formData.nmroPolza,
      fecha_asignacion: formData.fchaAsgncion,
      creado_en: formData.creado_en
      // Agrega aquí más campos si es necesario
    };
  }

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (onSave) onSave(mapFormDataToBackend(formData));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      {/* Menú de tabs */}
      <div className="flex border-b mb-4 bg-white rounded-t-lg shadow-sm">
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'datosGenerales'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('datosGenerales')}
        >
          Datos Generales
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'valores'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('valores')}
        >
          Valores y Prestaciones
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'trazabilidad'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('trazabilidad')}
        >
          Trazabilidad
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'facturacion'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('facturacion')}
        >
          Facturación
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'honorarios'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('honorarios')}
        >
          Honorarios
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'seguimiento'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('seguimiento')}
        >
          Seguimiento
        </button>
        <button
          className={`px-4 py-2 font-medium transition ${
            tabActiva === 'observaciones'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => setTabActiva('observaciones')}
        >
          Observaciones Clientes
        </button>
        {/* Agrega aquí más tabs según tus secciones */}
      </div>
      {/* Botones de acción SIEMPRE visibles, alineados a la derecha */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel ? onCancel : () => alert('Cancelar (sin acción definida)')}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onSave ? () => onSave(mapFormDataToBackend(formData)) : () => alert('Guardar (sin acción definida)')}
        >
          Guardar
        </button>
      </div>
      {/* Panel del tab activo */}
      <div className="mt-4">
        {tabActiva === 'datosGenerales' && (
      <DatosGenerales
        formData={formData}
        handleChange={handleChange}
            handleAseguradoraChange={handleAseguradoraChange}
            handleCiudadChange={handleCiudadChange}
            municipios={ciudades}
        aseguradoraOptions={aseguradoraOptions}
        funcionarios={funcionarios}
            responsables={responsables}
            estados={estados}
            hayResponsables={responsables && responsables.length > 0}
        intermediarios={intermediarios}
        nuevoIntermediario={nuevoIntermediario}
        setNuevoIntermediario={setNuevoIntermediario}
        agregarIntermediario={agregarIntermediario}
      />
        )}
        {tabActiva === 'valores' && (
          <ValoresPrestaciones
            formData={formData}
            handleChange={handleChange}
            // ...pasa aquí las props necesarias
          />
        )}
        {tabActiva === 'trazabilidad' && (
          <Trazabilidad
            formData={formData}
            handleChange={handleChange}
            getRootPropsContacto={dropzonePropsContacto.getRootProps}
            getInputPropsContacto={dropzonePropsContacto.getInputProps}
            isDragActiveContacto={dropzonePropsContacto.isDragActive}
            getRootPropsInspeccion={dropzonePropsInspeccion.getRootProps}
            getInputPropsInspeccion={dropzonePropsInspeccion.getInputProps}
            isDragActiveInspeccion={dropzonePropsInspeccion.isDragActive}
            getRootPropsSolicitudDocs={dropzonePropsSolicitudDocs.getRootProps}
            getInputPropsSolicitudDocs={dropzonePropsSolicitudDocs.getInputProps}
            isDragActiveSolicitudDocs={dropzonePropsSolicitudDocs.isDragActive}
            getRootPropsInformePreliminar={dropzonePropsInformePreliminar.getRootProps}
            getInputPropsInformePreliminar={dropzonePropsInformePreliminar.getInputProps}
            isDragActiveInformePreliminar={dropzonePropsInformePreliminar.isDragActive}
            getRootPropsInformeFinal={dropzonePropsInformeFinal.getRootProps}
            getInputPropsInformeFinal={dropzonePropsInformeFinal.getInputProps}
            isDragActiveInformeFinal={dropzonePropsInformeFinal.isDragActive}
            getRootPropsUltimoDocumento={dropzonePropsUltimoDocumento.getRootProps}
            getInputPropsUltimoDocumento={dropzonePropsUltimoDocumento.getInputProps}
            isDragActiveUltimoDocumento={dropzonePropsUltimoDocumento.isDragActive}
            historialDocs={historialDocs}
            setHistorialDocs={setHistorialDocs}
          />
        )}
        {tabActiva === 'facturacion' && (
          <Facturacion
            formData={formData}
            handleChange={handleChange}
            getRootPropsFactura={dropzonePropsFactura.getRootProps}
            getInputPropsFactura={dropzonePropsFactura.getInputProps}
            isDragActiveFactura={dropzonePropsFactura.isDragActive}
          />
        )}
        {tabActiva === 'honorarios' && (
          <Honorarios
            formData={formData}
            handleChange={handleChange}
            getRootPropsHonorarios={dropzonePropsHonorarios.getRootProps}
            getInputPropsHonorarios={dropzonePropsHonorarios.getInputProps}
            isDragActiveHonorarios={dropzonePropsHonorarios.isDragActive}
          />
        )}
        {tabActiva === 'seguimiento' && (
          <Seguimiento
            formData={formData}
            handleChange={handleChange}
          />
        )}
        {tabActiva === 'observaciones' && (
          <ObservacionesCliente
            formData={formData}
            handleChange={handleChange}
            getRootPropsObservaciones={dropzonePropsObservaciones.getRootProps}
            getInputPropsObservaciones={dropzonePropsObservaciones.getInputProps}
            isDragActiveObservaciones={dropzonePropsObservaciones.isDragActive}
          />
        )}
        {/* Agrega aquí el renderizado de los otros subcomponentes */}
      </div>
    </div>
  );
}
