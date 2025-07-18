import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';
// Elimina la importación de antd

const todosLosCampos = [
  { clave: 'nmroAjste', label: 'No. Ajuste' },
  { clave: 'nmroSinstro', label: 'No. de Siniestro' },
  { clave: 'nombIntermediario', label: 'Intermediario' },
  { clave: 'codWorkflow', label: 'Cod Workflow' },
  { clave: 'nmroPolza', label: 'No. de Poliza' },
  { clave: 'codiRespnsble', label: 'Código Responsable' },
  { clave: 'nombreResponsable', label: 'Responsable' },
  { clave: 'codiAsgrdra', label: 'Aseguradora' },
  { clave: 'funcAsgrdra', label: 'Código Funcionario Aseguradora' },
  { clave: 'nombreFuncionario', label: 'Funcionario Aseguradora' },
  { clave: 'asgrBenfcro', label: 'Asegurado o Beneficiario' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignacion' },
  { clave: 'fchaInspccion', label: 'Fecha de Inspeccion' },
  { clave: 'fchaUltDoc', label: 'Fecha Ultimo Documento' },
  { clave: 'fchaInfoFnal', label: 'Fecha del Informme Final' },
  { clave: 'amprAfctdo', label: 'Amparo Afectado' },
  { clave: 'tipoDucumento', label: 'Tipo de Documento' },
  { clave: 'numDocumento', label: 'Número de Documento' },
  { clave: 'tipoPoliza', label: 'Tipo de Póliza' },
  { clave: 'descSinstro', label: 'Descripción Siniestro' },
  { clave: 'ciudadSiniestro', label: 'Ciudad Siniestro' },
  { clave: 'fchaSinstro', label: 'Fecha Siniestro' },
  { clave: 'fchaContIni', label: 'Fecha Cont. Inicial' },
  { clave: 'obseContIni', label: 'Obs. Cont. Inicial' },
  { clave: 'anexContIni', label: 'Anexo Cont. Inicial' },
  { clave: 'obseInspccion', label: 'Obs. Inspección' },
  { clave: 'fchaSoliDocu', label: 'Fecha Solicitud Documento' },
  { clave: 'anexActaInspccion', label: 'Anexo Acta Inspección' },
  { clave: 'anexSolDoc', label: 'Anexo Solicitud Documento' },
  { clave: 'obseSoliDocu', label: 'Obs. Solicitud Documento' },
  { clave: 'fchaInfoPrelm', label: 'Fecha Informe Preliminar' },
  { clave: 'obseInfoPrelm', label: 'Obs. Informe Preliminar' },
  { clave: 'anxoInfPrelim', label: 'Anexo Informe Preliminar' },
  { clave: 'obseInfoFnal', label: 'Obs. Informe Final' },
  { clave: 'anxoInfoFnal', label: 'Anexo Informe Final' },
  { clave: 'fchaRepoActi', label: 'Fecha Reporte Actividad' },
  { clave: 'obseRepoActi', label: 'Obs. Reporte Actividad' },
  { clave: 'anxoRepoActi', label: 'Anexo Reporte Actividad' },
  { clave: 'fchaUltSegui', label: 'Fecha Último Seguimiento' },
  { clave: 'fchaActSegui', label: 'Fecha Actualización Seguimiento' },
  { clave: 'diasTranscrrdo', label: 'Días Transcurridos' },
  { clave: 'obseSegmnto', label: 'Observaciones de Seguimiento' },
  { clave: 'vlorResrva', label: 'Valor Reserva' },
  { clave: 'vlorReclmo', label: 'Valor Reclamo' },
  { clave: 'montoIndmzar', label: 'Monto a Indemnizar' },
  { clave: 'fchaFinqtoIndem', label: 'Fecha Fin Qto Indemnización' },
  { clave: 'nmroFactra', label: 'Número Factura' },
  { clave: 'vlorServcios', label: 'Valor Servicios' },
  { clave: 'vlorGastos', label: 'Valor Gastos' },
  { clave: 'total', label: 'Total' },
  { clave: 'totalGeneral', label: 'Total General' },
  { clave: 'totalPagado', label: 'Total Pagado' },
  { clave: 'iva', label: 'IVA' },
  { clave: 'reteiva', label: 'ReteIVA' },
  { clave: 'retefuente', label: 'ReteFuente' },
  { clave: 'reteica', label: 'ReteICA' },
  { clave: 'porcIva', label: '% IVA' },
  { clave: 'porcReteiva', label: '% ReteIVA' },
  { clave: 'porcRetefuente', label: '% ReteFuente' },
  { clave: 'porcReteica', label: '% ReteICA' },
  { clave: 'fchaFactra', label: 'Fecha Factura' },
  { clave: 'anxoFactra', label: 'Anexo Factura' },
  { clave: 'anxoHonorarios', label: 'Anexo Honorarios' },
  { clave: 'anxoHonorariosdefinit', label: 'Anexo Honorarios Definitivos' },
  { clave: 'anxoAutorizacion', label: 'Anexo Autorización' },
  { clave: 'fchaUltRevi', label: 'Fecha Última Revisión' },
  { clave: 'obseComprmsi', label: 'Obs. Compromiso' },
  { clave: 'amparo_afectado', label: 'Amparo Afectado' },
  { clave: 'fecha_fin_quito_indemnizacion', label: 'Fecha Fin Qto Indemnización' },
  { clave: 'anexo_honorarios', label: 'Anexo Honorarios' },
  { clave: 'anexo_honorarios_definitivo', label: 'Anexo Honorarios Definitivo' },
  { clave: 'anexo_autorizacion', label: 'Anexo Autorización' },
  { clave: 'porcentaje_iva', label: '% IVA' },
  { clave: 'porcentaje_reteiva', label: '% ReteIVA' },
  { clave: 'porcentaje_retefuente', label: '% ReteFuente' },
  { clave: 'porcentaje_reteica', label: '% ReteICA' },
  // ...otros campos del formulario si es necesario
];

const columnasIniciales = [
  'nmroAjste',
  'nmroSinstro',
  'intermediario',
  'codWorkflow',
  'nmroPolza',
  'nombreResponsable',
  'codiAsgrdra',
  'asgrBenfcro',
  'fchaAsgncion',
  'fchaInspccion',
  'fchaUltDoc',
  'fchaInfoFnal',
  'codi_estdo',
  'nombreFuncionario',
  'diasUltRev',
  'obseSegmnto'
];

// Función para convertir fechas ISO a yyyy-MM-dd para inputs tipo date
function toDateInputValue(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const off = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - off);
  return d.toISOString().slice(0, 10);
}

// Función para mapear TODOS los campos del siniestro al formulario
const mapSiniestroToForm = (siniestro) => ({
  nmroAjste: siniestro.nmroAjste || '',
  nmroSinstro: siniestro.nmroSinstro || '',
  nombIntermediario: siniestro.nombIntermediario || '',
  codWorkflow: siniestro.codWorkflow || '',
  nmroPolza: siniestro.nmroPolza || '',
  codiRespnsble: siniestro.codiRespnsble || '',
  nombreResponsable: siniestro.nombreResponsable || '',
  codiAsgrdra: siniestro.codiAsgrdra || '',
  funcAsgrdra: siniestro.funcAsgrdra || '',
  nombreFuncionario: siniestro.nombreFuncionario || '',
  asgrBenfcro: siniestro.asgrBenfcro || '',
  fchaAsgncion: toDateInputValue(siniestro.fchaAsgncion),
  fchaInspccion: toDateInputValue(siniestro.fchaInspccion),
  fchaUltDoc: toDateInputValue(siniestro.fchaUltDoc),
  fchaInfoFnal: toDateInputValue(siniestro.fchaInfoFnal),
  amprAfctdo: siniestro.amprAfctdo || '',
  tipoDucumento: siniestro.tipoDucumento || '',
  numDocumento: siniestro.numDocumento || '',
  tipoPoliza: siniestro.tipoPoliza || '',
  descSinstro: siniestro.descSinstro || '',
  ciudadSiniestro: siniestro.ciudadSiniestro || '',
  fchaSinstro: toDateInputValue(siniestro.fchaSinstro),
  fchaContIni: toDateInputValue(siniestro.fchaContIni),
  obseContIni: siniestro.obseContIni || '',
  anexContIni: siniestro.anexContIni || '',
  obseInspccion: siniestro.obseInspccion || '',
  fchaSoliDocu: toDateInputValue(siniestro.fchaSoliDocu),
  anexActaInspccion: siniestro.anexActaInspccion || '',
  anexSolDoc: siniestro.anexSolDoc || '',
  obseSoliDocu: siniestro.obseSoliDocu || '',
  fchaInfoPrelm: toDateInputValue(siniestro.fchaInfoPrelm),
  obseInfoPrelm: siniestro.obseInfoPrelm || '',
  anxoInfPrelim: siniestro.anxoInfPrelim || '',
  obseInfoFnal: siniestro.obseInfoFnal || '',
  anxoInfoFnal: siniestro.anxoInfoFnal || '',
  fchaRepoActi: toDateInputValue(siniestro.fchaRepoActi),
  obseRepoActi: siniestro.obseRepoActi || '',
  anxoRepoActi: siniestro.anxoRepoActi || '',
  fchaUltSegui: toDateInputValue(siniestro.fchaUltSegui),
  fchaActSegui: toDateInputValue(siniestro.fchaActSegui),
  diasTranscrrdo: siniestro.diasTranscrrdo || '',
  obseSegmnto: siniestro.obseSegmnto || '',
  vlorResrva: siniestro.vlorResrva || '',
  vlorReclmo: siniestro.vlorReclmo || '',
  montoIndmzar: siniestro.montoIndmzar || '',
  fchaFinqtoIndem: toDateInputValue(siniestro.fchaFinqtoIndem),
  nmroFactra: siniestro.nmroFactra || '',
  vlorServcios: siniestro.vlorServcios || '',
  vlorGastos: siniestro.vlorGastos || '',
  total: siniestro.total || '',
  totalGeneral: siniestro.totalGeneral || '',
  totalPagado: siniestro.totalPagado || '',
  iva: siniestro.iva || '',
  reteiva: siniestro.reteiva || '',
  retefuente: siniestro.retefuente || '',
  reteica: siniestro.reteica || '',
  porcIva: siniestro.porcIva || '',
  porcReteiva: siniestro.porcReteiva || '',
  porcRetefuente: siniestro.porcRetefuente || '',
  porcReteica: siniestro.porcReteica || '',
  fchaFactra: toDateInputValue(siniestro.fchaFactra),
  anxoFactra: siniestro.anxoFactra || '',
  anxoHonorarios: siniestro.anxoHonorarios || '',
  anxoHonorariosdefinit: siniestro.anxoHonorariosdefinit || '',
  anxoAutorizacion: siniestro.anxoAutorizacion || '',
  fchaUltRevi: toDateInputValue(siniestro.fchaUltRevi),
  obseComprmsi: siniestro.obseComprmsi || '',
  amparo_afectado: siniestro.amparo_afectado || '',
  fecha_fin_quito_indemnizacion: toDateInputValue(siniestro.fecha_fin_quito_indemnizacion),
  anexo_honorarios: siniestro.anexo_honorarios || '',
  anexo_honorarios_definitivo: siniestro.anexo_honorarios_definitivo || '',
  anexo_autorizacion: siniestro.anexo_autorizacion || '',
  porcentaje_iva: siniestro.porcentaje_iva || '',
  porcentaje_reteiva: siniestro.porcentaje_reteiva || '',
  porcentaje_retefuente: siniestro.porcentaje_retefuente || '',
  porcentaje_reteica: siniestro.porcentaje_reteica || '',
});

const ReporteComplex = () => {
  // Mover todos los hooks aquí dentro
  const [camposVisibles, setCamposVisibles] = useState(
    todosLosCampos.filter(c => columnasIniciales.includes(c.clave))
  );
  const [modalColumnasOpen, setModalColumnasOpen] = useState(false);
  const [seleccionTemporal, setSeleccionTemporal] = useState(camposVisibles.map(c => c.clave));

  const abrirPersonalizarColumnas = () => {
    setSeleccionTemporal(camposVisibles.map(c => c.clave));
    setModalColumnasOpen(true);
  };
  const guardarColumnasPersonalizadas = () => {
    const nuevasColumnas = todosLosCampos.filter(c => seleccionTemporal.includes(c.clave));
    setCamposVisibles(nuevasColumnas);
    setModalColumnasOpen(false);
  };

  const [siniestros, setSiniestros] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState('nmroSinstro');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const [editSiniestro, setEditSiniestro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    obtenerSiniestros();
    getEstados().then(setEstados).catch(() => setEstados([]));
    // eslint-disable-next-line
  }, []);

  // Logs de depuración para ver los datos reales
  useEffect(() => {
    if (siniestros.length > 0) {
      console.log('Ejemplo de siniestro:', siniestros[0]);
    }
  }, [siniestros]);
  useEffect(() => {
    if (estados.length > 0) {
      console.log('Estados:', estados);
      console.log('Primer estado:', estados[0]);
    }
  }, [estados]);

  const obtenerSiniestros = async () => {
    setLoading(true);
    try {
      const data = await getSiniestrosEnriquecidos();
      setSiniestros(data);
    } catch (error) {
      console.error('Error al cargar siniestros:', error);
      setSiniestros([]);
    }
    setLoading(false);
  };

  const handleEdit = (siniestro) => {
    setEditSiniestro(mapSiniestroToForm(siniestro));
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
    // Si el campo no existe en el objeto, no filtra nada (muestra todo)
    if (!(campoBusqueda in s)) return true;
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

  // Función para obtener el nombre del estado, priorizando codiEstdo y forzando comparación por string
  const getNombreEstado = (siniestro) => {
    const valor = siniestro.codiEstdo;
    const valorStr = valor !== undefined && valor !== null ? String(valor) : '';
    const estado = estados.find(e => String(e.codiEstdo) === valorStr);
    if (!estado) {
      console.warn('No se encontró estado para:', valorStr, 'en', estados.map(e => String(e.codiEstdo)));
    }
    return estado ? estado.descEstdo : valorStr;
  };

  // Mostrar mensaje de carga si los estados no están listos
  if (estados.length === 0) {
    return <div className="p-4 text-center text-gray-500">Cargando estados...</div>;
  }

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
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={abrirPersonalizarColumnas}
        >
          Personalizar columnas
        </button>
      </div>

      {modalColumnasOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">Personalizar columnas</h2>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4">
              {todosLosCampos.map(campo => (
                <label key={campo.clave} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seleccionTemporal.includes(campo.clave)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSeleccionTemporal([...seleccionTemporal, campo.clave]);
                      } else {
                        setSeleccionTemporal(seleccionTemporal.filter(cl => cl !== campo.clave));
                      }
                    }}
                  />
                  {campo.label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalColumnasOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={guardarColumnasPersonalizadas}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {camposVisibles.map(({ clave, label }) => (
                clave === 'codiEstdo' || clave.toLowerCase().includes('estado') ? null : (
                  <th
                    key={clave}
                    onClick={() => cambiarOrden(clave)}
                    className="p-2 border-b cursor-pointer whitespace-nowrap hover:bg-gray-200 text-left"
                  >
                    {label} {orden.campo === clave ? (orden.asc ? '↑' : '↓') : ''}
                  </th>
                )
              ))}
              <th className="p-2 border-b text-left">Estado</th>
              <th className="p-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={camposVisibles.length + 2} className="text-center py-6 text-gray-500">Cargando...</td></tr>
            ) : siniestrosPaginados.length === 0 ? (
              <tr>
                <td colSpan={camposVisibles.length + 2} className="text-center py-6 text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
              ) : 
              siniestrosPaginados.map((siniestro, index) => (
                <tr key={siniestro._id || index} className="border-b hover:bg-gray-50">
                  {camposVisibles.map(({ clave }) => (
                    clave === 'codiEstdo' || clave.toLowerCase().includes('estado') ? null : (
                      <td key={clave} className="p-2 whitespace-nowrap">
                        {siniestro[clave] || ''}
                      </td>
                    )
                  ))}
                  <td className="p-2 whitespace-nowrap">{getNombreEstado(siniestro)}</td>
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
