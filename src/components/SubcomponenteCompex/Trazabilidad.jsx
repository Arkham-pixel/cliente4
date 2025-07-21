import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const tiposSolicitud = [
  { value: 'anexo_solicitud_documento', label: 'Anexo de la Solicitud de Documento' },
  { value: 'acta_inspeccion', label: 'Acta de Inspección' },
  { value: 'informe_preliminar', label: 'Informe Preliminar' },
  { value: 'informe_final', label: 'Informe Final' },
  { value: 'adjunto_contacto_inicial', label: 'Adjuntos Contacto Inicial' },
  { value: 'adjunto_ultimo_documento', label: 'Adjunto Entrega Último Documento' },
  { value: 'observaciones_contacto_inicial', label: 'Observaciones Contacto Inicial' },
  { value: 'observacion_inspeccion', label: 'Observaciones de la Inspección' },
  { value: 'observacion_solicitud_documento', label: 'Observaciones Solicitud de Documentos' },
  { value: 'observacion_informe_preliminar', label: 'Observaciones Informe Preliminar' },
  { value: 'observacion_informe_final', label: 'Observaciones Informe Final' },
  { value: 'fecha_contacto_inicial', label: 'Fecha Contacto Inicial' },
  { value: 'fecha_inspeccion', label: 'Fecha de Inspección' },
  { value: 'fecha_solicitud_documentos', label: 'Fecha Solicitud de Documentos' },
  { value: 'fecha_informe_preliminar', label: 'Fecha Informe Preliminar' },
  { value: 'fecha_informe_final', label: 'Fecha Informe Final' },
  { value: 'fecha_ultimo_documento', label: 'Fecha Último Documento' },
  { value: 'fecha_ultimo_seguimiento', label: 'Fecha Último Seguimiento' },
  { value: 'observacion_seguimiento_pendientes', label: 'Observación de Seguimiento y Pendientes' },
  // Agrega aquí más tipos si lo necesitas
];

export default function Trazabilidad({
  formData,
  handleChange,
  getRootPropsContacto,
  getInputPropsContacto,
  isDragActiveContacto,
  getRootPropsInspeccion,
  getInputPropsInspeccion,
  isDragActiveInspeccion,
  getRootPropsSolicitudDocs,
  getInputPropsSolicitudDocs,
  isDragActiveSolicitudDocs,
  getRootPropsInformePreliminar,
  getInputPropsInformePreliminar,
  isDragActiveInformePreliminar,
  getRootPropsInformeFinal,
  getInputPropsInformeFinal,
  isDragActiveInformeFinal,
  getRootPropsUltimoDocumento,
  getInputPropsUltimoDocumento,
  isDragActiveUltimoDocumento,
  historialDocs,
  setHistorialDocs
}) {
  // Estado para modal y documentos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [busquedaTipo, setBusquedaTipo] = useState('');
  const [comentario, setComentario] = useState('');
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false);

  // Abrir/cerrar modal
  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => {
    setModalAbierto(false);
    setTipoSeleccionado('');
    setArchivoSeleccionado(null);
    setBusquedaTipo('');
    setComentario('');
    setMostrarListaCompleta(false);
  };

  // Manejar selección de tipo
  const handleTipoChange = (e) => setTipoSeleccionado(e.target.value);

  // Manejar selección de archivo
  const handleArchivoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoSeleccionado(e.target.files[0]);
    }
  };

  // Filtrar tipos de solicitud basado en la búsqueda
  const tiposFiltrados = tiposSolicitud.filter(tipo =>
    tipo.label.toLowerCase().includes(busquedaTipo.toLowerCase())
  );

  // Manejar carga de documento
  const handleCargarDocumento = () => {
    if (!tipoSeleccionado || !archivoSeleccionado) return;
    const fecha = new Date().toISOString().split('T')[0];
    setHistorialDocs(prev => [
      ...prev,
      {
        tipo: tiposSolicitud.find(t => t.value === tipoSeleccionado)?.label || tipoSeleccionado,
        nombre: archivoSeleccionado.name,
        fecha,
        comentario: comentario || 'Sin comentarios'
      }
    ]);
    cerrarModal();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Trazabilidad</h2>
      {/* Botón para cargar solicitud */}
      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          onClick={abrirModal}
        >
          Cargar Solicitud
        </button>
      </div>

      {/* Modal de carga de solicitud */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={cerrarModal}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">Cargar Solicitud de Documento</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
              <div className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={busquedaTipo}
                    onChange={(e) => {
                      setBusquedaTipo(e.target.value);
                      setMostrarListaCompleta(true);
                    }}
                    placeholder="Buscar y seleccionar tipo de documento..."
                    className="flex-1 border rounded-l px-3 py-2"
                    onFocus={() => setMostrarListaCompleta(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarListaCompleta(!mostrarListaCompleta)}
                    className="border border-l-0 rounded-r px-3 py-2 bg-gray-50 hover:bg-gray-100"
                  >
                    ▼
                  </button>
                </div>
                {mostrarListaCompleta && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {(busquedaTipo ? tiposFiltrados : tiposSolicitud).length > 0 ? (
                      (busquedaTipo ? tiposFiltrados : tiposSolicitud).map(tipo => (
                        <div
                          key={tipo.value}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setTipoSeleccionado(tipo.value);
                            setBusquedaTipo(tipo.label);
                            setMostrarListaCompleta(false);
                          }}
                        >
                          {tipo.label}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No se encontraron resultados</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Archivo</label>
              <input
                type="file"
                onChange={handleArchivoChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Barra de comentarios */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comentarios</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agregar comentarios sobre el documento..."
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              onClick={handleCargarDocumento}
              disabled={!tipoSeleccionado || !archivoSeleccionado}
            >
              Cargar
            </button>
          </div>
        </div>
      )}

      {/* Historial de documentos subidos */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Historial de Documentos Subidos</h4>
        {historialDocs.length === 0 ? (
          <p className="text-gray-500">No hay documentos subidos aún.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Comentarios</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {historialDocs.map((doc, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{doc.tipo}</td>
                  <td className="p-2 border">{doc.nombre}</td>
                  <td className="p-2 border">{doc.fecha}</td>
                  <td className="p-2 border">{doc.comentario}</td>
                  <td className="p-2 border text-center">
                    <button className="text-blue-600 hover:underline" disabled>
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
