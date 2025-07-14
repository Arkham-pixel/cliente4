import React, { useState } from 'react';
import DatosGenerales from './DatosGenerales';
import ValoresPrestaciones from './ValoresPrestaciones';
import Trazabilidad from './Trazabilidad';
import Facturacion from './Facturacion';
import Honorarios from './Honorarios';
import Seguimiento from './Seguimiento';
import ObservacionesCliente from './ObservacionesCliente';
import { useDropzone } from 'react-dropzone';
// Importa aquí los demás subcomponentes cuando los crees

export default function FormularioCasoComplex() {
  const [tabActiva, setTabActiva] = useState('datosGenerales');
  const [formData, setFormData] = useState({
    responsable: '',
    aseguradora: '',
    funcionario_aseguradora: '',
    numero_siniestro: '',
    codigo_workflow: '',
    intermediario: '',
    numero_poliza: '',
    asegurado: '',
    tipo_documento: '',
    numero_documento: '',
    fecha_asignacion: '',
    fecha_siniestro: '',
    ciudad_siniestro: '',
    tipo_poliza: '',
    causa_siniestro: '',
    estado: '',
    descripcion_siniestro: '',
    // ...agrega aquí los demás campos que uses
  });

  // Handler de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  const municipios = []; // tu array real de municipios
  const aseguradoraOptions = []; // tu array real de aseguradoras
  const funcionarios = []; // tu array real de funcionarios
  const intermediarios = []; // tu array real de intermediarios
  const nuevoIntermediario = '';
  const setNuevoIntermediario = () => {};
  const agregarIntermediario = () => {};

  return (
    <div>
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

      {/* Panel del tab activo */}
      <div className="mt-4">
        {tabActiva === 'datosGenerales' && (
          <DatosGenerales
            formData={formData}
            handleChange={handleChange}
            handleAseguradoraChange={handleAseguradoraChange}
            handleCiudadChange={handleCiudadChange}
            municipios={municipios}
            aseguradoraOptions={aseguradoraOptions}
            funcionarios={funcionarios}
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
