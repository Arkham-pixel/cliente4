import React, { useEffect, useState } from 'react';
import { obtenerCasosRiesgo, deleteCasoRiesgo } from '../../services/riesgoService'; // Ajusta la ruta si es necesario
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import AgregarCasoRiesgo from '../SubcomponentesRiesgo/AgregarCasoRiesgo';

const getCiudadNombre = (codigo, ciudades) => {
  if (!ciudades) return codigo;
  const ciudad = ciudades.find(c => c.value === codigo || c.codiMunicipio === codigo);
  return ciudad ? ciudad.label : codigo;
};

const getEstadoNombre = (codigo, estados) => {
  if (!estados) return codigo;
  const estado = estados.find(e => String(e.codiEstdo) === String(codigo));
  return estado ? estado.descEstdo : codigo;
};

// Lista completa de columnas posibles (puedes agregar más si tu base tiene más campos)
const todasLasColumnas = [
  { clave: 'nmroRiesgo', label: 'N° Riesgo' },
  { clave: 'asgrBenfcro', label: 'Asegurado' },
  { clave: 'codiAsgrdra', label: 'Cód. Aseguradora' },
  { clave: 'ciudadSucursal', label: 'Ciudad' },
  { clave: 'codiEstdo', label: 'Estado' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignación' },
  { clave: 'fchaInspccion', label: 'Fecha Inspección' },
  { clave: 'fchaInforme', label: 'Fecha Informe Final' },
  { clave: 'codiIspector', label: 'Inspector' },
  { clave: 'observInspeccion', label: 'Observaciones Inspección' },
  { clave: 'observAsignacion', label: 'Observaciones Asignación' },
  { clave: 'vlorTarifaAseguradora', label: 'Tarifa Aseguradora' },
  { clave: 'vlorHonorarios', label: 'Honorarios' },
  { clave: 'vlorGastos', label: 'Gastos' },
  { clave: 'totalPagado', label: 'Total Pagado' },
  { clave: 'nmroConsecutivo', label: 'Consecutivo' },
  { clave: 'adjuntoAsignacion', label: 'Adjunto Asignación' },
  { clave: 'adjuntoInspeccion', label: 'Adjunto Inspección' },
  { clave: 'anxoInfoFnal', label: 'Adjunto Informe Final' },
  { clave: 'anxoFactra', label: 'Adjunto Factura' },
  { clave: 'fchaFactra', label: 'Fecha Factura' },
  { clave: 'nmroFactra', label: 'Número Factura' },
  { clave: 'funcSolicita', label: 'Quien Solicita' },
  { clave: 'codDireccion', label: 'Dirección' },
  { clave: 'codigoPoblado', label: 'Código Poblado' },
  // ...agrega más si tu base tiene más campos
];

const ReporteRiesgo = ({ ciudades, estados }) => {
  const [casos, setCasos] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('numero_siniestro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casoParaEditar, setCasoParaEditar] = useState(null);
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([
    'nmroRiesgo', 'asgrBenfcro', 'codiAsgrdra', 'ciudadSucursal', 'codiEstdo',
    'fchaAsgncion', 'fchaInspccion', 'fchaInforme', 'codiIspector',
    'observInspeccion', 'observAsignacion', 'vlorTarifaAseguradora',
    'vlorHonorarios', 'vlorGastos', 'totalPagado'
  ]);
  const [modalColumnas, setModalColumnas] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    obtenerCasos();
  }, []);

  const obtenerCasos = async () => {
    try {
      const data = await obtenerCasosRiesgo();
      setCasos(data);
    } catch (error) {
      console.error('Error al cargar casos:', error);
    }
  };

  const handleEdit = (id) => {
    const caso = casos.find(c => c._id?.toString() === id?.toString() || c.id_riesgo?.toString() === id?.toString() || c.id?.toString() === id?.toString());
    if (caso) {
      setCasoParaEditar(caso);
      setModalAbierto(true);
    }
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    setCasoParaEditar(null);
    obtenerCasos(); // Recarga la lista tras editar
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este caso?')) {
      try {
        await deleteCasoRiesgo(id);
        alert('Caso eliminado correctamente');
        obtenerCasos();
      } catch (error) {
        console.error('Error al eliminar el caso:', error);
        alert('Error al eliminar el caso');
      }
    }
  };

  // Ajusta los campos visibles según tu modelo de riesgos real
  const camposVisibles = todasLasColumnas.filter(col => columnasSeleccionadas.includes(col.clave));

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
        if (clave === 'ciudadSucursal') {
          fila[label] = getCiudadNombre(caso[clave], ciudades);
        } else if (clave === 'codiEstdo') {
          fila[label] = getEstadoNombre(caso[clave], estados);
        } else if (clave === 'fchaAsgncion' || clave === 'fchaInspccion' || clave === 'fchaInforme' || clave === 'fchaFactra') {
          fila[label] = caso[clave] ? new Date(caso[clave]).toLocaleDateString() : '';
        } else {
          fila[label] = caso[clave] || '';
        }
      });
      return fila;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CasosRiesgo');
    XLSX.writeFile(workbook, 'reporte_riesgo.xlsx');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Reporte de Casos de Riesgo</h2>

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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setModalColumnas(true)}
        >
          🗂️ Columnas
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
            {casosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 1} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              casosPaginados.map((caso, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave, label }) => (
                    <td key={clave} className="p-2 whitespace-nowrap">
                      {clave === 'ciudadSucursal'
                        ? getCiudadNombre(caso[clave], ciudades)
                        : clave === 'codiEstdo'
                          ? getEstadoNombre(caso[clave], estados)
                          : (clave === 'fchaAsgncion' || clave === 'fchaInspccion' || clave === 'fchaInforme' || clave === 'fchaFactra')
                            ? (caso[clave] ? new Date(caso[clave]).toLocaleDateString() : '')
                            : caso[clave] || ''}
                    </td>
                  ))}
                  <td className="p-2 whitespace-nowrap space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => handleEdit(caso._id || caso.id_riesgo)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                      onClick={() => handleDelete(caso._id || caso.id_riesgo)}
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
      {/* Modal de edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={handleCloseModal}
              title="Cerrar"
            >
              ×
            </button>
            <AgregarCasoRiesgo casoInicial={casoParaEditar} onClose={handleCloseModal} />
          </div>
        </div>
      )}
      {/* Modal de selección de columnas */}
      {modalColumnas && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setModalColumnas(false)}
              title="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Selecciona columnas a exportar</h3>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {todasLasColumnas.map(col => (
                <label key={col.clave} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={columnasSeleccionadas.includes(col.clave)}
                    onChange={e => {
                      if (e.target.checked) {
                        setColumnasSeleccionadas(prev => [...prev, col.clave]);
                      } else {
                        setColumnasSeleccionadas(prev => prev.filter(c => c !== col.clave));
                      }
                    }}
                  />
                  {col.label}
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setModalColumnas(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteRiesgo;