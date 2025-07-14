import React, { useEffect, useState } from 'react';
import { getSiniestrosConResponsables, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';

const camposVisibles = [
  { clave: 'nmroAjste', label: 'Nro Ajuste' },
  { clave: 'codiRespnsble', label: 'Código Responsable' }, // Corregido: era 'codi_respnsble', ahora es 'codiRespnsble'
  { clave: 'nombreResponsable', label: 'Nombre Responsable' },
  { clave: 'codiAsgrdra', label: 'Aseguradora' },
  { clave: 'nmroSinstro', label: 'Nro Siniestro' },
  { clave: 'codWorkflow', label: 'Cod Workflow' },
  { clave: 'funcAsgrdra', label: 'Func. Aseguradora' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignación' },
  { clave: 'asgrBenfcro', label: 'Beneficiario' },
  { clave: 'tipoDucumento', label: 'Tipo Documento' },
  { clave: 'numDocumento', label: 'Nro Documento' },
  { clave: 'tipoPoliza', label: 'Tipo Póliza' },
  { clave: 'nmroPolza', label: 'Nro Póliza' },
  { clave: 'amprAfctdo', label: 'Amparo Afectado' },
  { clave: 'fchaSinstro', label: 'Fecha Siniestro' },
  { clave: 'descSinstro', label: 'Descripción Siniestro' },
  { clave: 'ciudadSiniestro', label: 'Ciudad Siniestro' },
  { clave: 'codiEstdo', label: 'Estado' },
  { clave: 'vlorResrva', label: 'Valor Reserva' },
  { clave: 'vlorReclmo', label: 'Valor Reclamo' },
  { clave: 'montoIndmzar', label: 'Monto Indemnizar' },
];

const ReporteComplex = () => {
  const [siniestros, setSiniestros] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('nmroSinstro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [editSiniestro, setEditSiniestro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerSiniestros();
    // eslint-disable-next-line
  }, []);

  const obtenerSiniestros = async () => {
    setLoading(true);
    try {
      const data = await getSiniestrosConResponsables({ page: 1, limit: 1000 });
      setSiniestros(data.siniestros || []);
    } catch (error) {
      console.error('Error al cargar siniestros:', error);
    }
    setLoading(false);
  };

  const handleEdit = (siniestro) => {
    setEditSiniestro(siniestro);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este siniestro?')) {
      try {
        await deleteSiniestro(id);
        alert('Siniestro eliminado correctamente');
        obtenerSiniestros();
      } catch (error) {
        console.error('Error al eliminar el siniestro:', error);
        alert('Error al eliminar el siniestro');
      }
    }
  };

  const handleSave = async (formData) => {
    if (!formData._id) return;
    setLoading(true);
    try {
      await updateSiniestro(formData._id, formData);
      setModalOpen(false);
      setEditSiniestro(null);
      obtenerSiniestros();
    } catch (error) {
      alert('Error al guardar los cambios');
    }
    setLoading(false);
  };

  const siniestrosFiltrados = siniestros.filter(s => {
    const valor = s[campoBusqueda]?.toString().toLowerCase() || '';
    return valor.includes(terminoBusqueda.toLowerCase());
  });

  const siniestrosOrdenados = [...siniestrosFiltrados].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';
    return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });

  const totalPaginas = Math.ceil(siniestrosOrdenados.length / elementosPorPagina);
  const siniestrosPaginados = siniestrosOrdenados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarOrden = campo => {
    setOrden(prev => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(siniestrosOrdenados.map(s => {
      const fila = {};
      camposVisibles.forEach(({ clave, label }) => {
        fila[label] = s[clave] || '';
      });
      return fila;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Siniestros');
    XLSX.writeFile(workbook, 'reporte_siniestros.xlsx');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Reporte de Siniestros</h2>

      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div>
          <label className="text-sm font-medium block">Buscar por</label>
          <select
            className="border px-2 py-1 rounded"
            value={campoBusqueda}
            onChange={e => setCampoBusqueda(e.target.value)}
          >
            {camposVisibles.map(c => (
              <option key={c.clave} value={c.clave}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block">Término</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={terminoBusqueda}
            onChange={e => setTerminoBusqueda(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={obtenerSiniestros}
        >
          🔍 Buscar
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={exportarExcel}
        >
          ⬇ Exportar Excel
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {camposVisibles.map(({ clave, label }) => (
                <th
                  key={clave}
                  onClick={() => cambiarOrden(clave)}
                  className="p-2 border-b cursor-pointer whitespace-nowrap hover:bg-gray-200 text-left"
                >
                  {label} {orden.campo === clave ? (orden.asc ? '↑' : '↓') : ''}
                </th>
              ))}
              <th className="p-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">Cargando...</td></tr>
            ) : siniestrosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              siniestrosPaginados.map((siniestro, index) => (
                <tr key={siniestro._id || index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave }) => (
                    <td key={clave} className="p-2 whitespace-nowrap">
                      {clave === 'nombreResponsable' 
                        ? (siniestro[clave] || 'Sin asignar')
                        : (siniestro[clave] || '')
                      }
                    </td>
                  ))}
                  <td className="p-2 whitespace-nowrap space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => handleEdit(siniestro)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => handleDelete(siniestro._id)}
                    >
                      🗑️ Borrar
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">
          Página {paginaActual} de {totalPaginas}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <button
            onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      </div>

      {/* Modal con FormularioCasoComplex */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxHeight: '90vh', overflowY: 'auto' }}>
            <FormularioCasoComplex
              initialData={editSiniestro}
              onSave={handleSave}
              onCancel={() => { setModalOpen(false); setEditSiniestro(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteComplex;
