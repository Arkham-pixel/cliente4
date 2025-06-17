import React, { useEffect, useState } from 'react';
import { obtenerCasosComplex, crearCasoComplex, deleteCasoComplex } from '../services/complexService';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom'; // 👉 para poder navegar al editar



const ReporteComplex = () => {
  const [casos, setCasos] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('numero_siniestro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const navigate = useNavigate(); // 👉

  useEffect(() => {
    obtenerCasos();
  }, []);

  const obtenerCasos = async () => {
    try {
      const data = await obtenerCasosComplex();
      setCasos(data);
    } catch (error) {
      console.error('Error al cargar casos:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/complex/edit/${id}`); // navegar a la ruta de edición
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este caso?')) {
      try {
        await deleteCasoComplex(id);
        alert('Caso eliminado correctamente');
        obtenerCasos(); // refrescar lista
      } catch (error) {
        console.error('Error al eliminar el caso:', error);
        alert('Error al eliminar el caso');
      }
    }
  };


  
  const camposVisibles = [
    { clave: 'numero_ajuste', label: 'No. Ajuste' },
    { clave: 'numero_siniestro', label: 'No. de Siniestro' },
    { clave: 'intermediario', label: 'Intermediario' },
    { clave: 'codigo_workflow', label: 'Cod Workflow' },
    { clave: 'numero_poliza', label: 'No. de Póliza' },
    { clave: 'responsable', label: 'Responsable' },
    { clave: 'aseguradora', label: 'Aseguradora' },
    { clave: 'asegurado', label: 'Asegurado o Beneficiario' },
    { clave: 'fecha_asignacion', label: 'Fecha Asignación' },
    { clave: 'fecha_inspeccion', label: 'Fecha de Inspección' },
    { clave: 'fecha_informe_final', label: 'Fecha del Informe Final' },
    { clave: 'estado', label: 'Estado del Siniestro' }, // corregido (antes tenías estado_siniestro)
    { clave: 'funcionario_aseguradora', label: 'Funcionario Aseguradora' },
    { clave: 'fecha_ultima_revision', label: 'Fecha Última Revisión' }, // mostrar directamente la fecha
    { clave: 'observacion_seguimiento_pendientes', label: 'Observaciones Seguimiento' },
  ];

  const casosFiltrados = casos.filter(caso => {
    const valor = caso[campoBusqueda]?.toString().toLowerCase() || '';
    return valor.includes(terminoBusqueda.toLowerCase());
  });

  const casosOrdenados = [...casosFiltrados].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    const valorA = a[campo]?.toString().toLowerCase() || '';
    const valorB = b[campo]?.toString().toLowerCase() || '';
    return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });

  const totalPaginas = Math.ceil(casosOrdenados.length / elementosPorPagina);
  const casosPaginados = casosOrdenados.slice(
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
    const worksheet = XLSX.utils.json_to_sheet(casosOrdenados.map(caso => {
      const fila = {};
      camposVisibles.forEach(({ clave, label }) => {
        fila[label] = caso[clave] || '';
      });
      return fila;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Casos');
    XLSX.writeFile(workbook, 'reporte_complex.xlsx');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Reporte de Casos Complex</h2>

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
          onClick={obtenerCasos}
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
              <th className="p-2 border-b text-left">Acciones</th> {/* columna acciones */}
            </tr>
          </thead>
          <tbody>
            {casosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              casosPaginados.map((caso, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave }) => (
                    <td key={clave} className="p-2 whitespace-nowrap">{caso[clave] || ''}</td>
                  ))}
                  <td className="p-2 whitespace-nowrap space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => handleEdit(caso.id_complex)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => handleDelete(caso.id_complex)}
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

      <div>
        <table>
          <tbody>
            {casos.map(caso => (
              <tr key={caso.id_complex}>
                <td>{caso.nombre}</td>
                <td>{caso.valor}</td>
              </tr>
            ))}
            <tr>
              <td>Dato 1</td>
              <td>Dato 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteComplex;
