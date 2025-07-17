import React, { useEffect, useState } from 'react';
import { getSiniestrosEnriquecidos, deleteSiniestro, updateSiniestro } from '../services/siniestrosApi';
import { getEstados } from '../services/estadosService';
import FormularioCasoComplex from './SubcomponenteCompex/FormularioCasoComplex';
import * as XLSX from 'xlsx';
// Elimina la importación de antd

const todosLosCampos = [
  { clave: 'nmroAjste', label: 'No. Ajuste' },
  { clave: 'nmroSinstro', label: 'No. de Siniestro' },
  { clave: 'intermediario', label: 'Intermediario' },
  { clave: 'codWorkflow', label: 'Cod Workflow' },
  { clave: 'nmroPolza', label: 'No. de Poliza' },
  { clave: 'nombreResponsable', label: 'Responsable' },
  { clave: 'codiAsgrdra', label: 'Aseguradora' },
  { clave: 'asgrBenfcro', label: 'Asegurado o Beneficiario' },
  { clave: 'fchaAsgncion', label: 'Fecha Asignacion' },
  { clave: 'fchaInspccion', label: 'Fecha de Inspeccion' },
  { clave: 'fchaUltDoc', label: 'Fecha Ultimo Documento' },
  { clave: 'fchaInfoFnal', label: 'Fecha del Informme Final' },
  { clave: 'codi_estdo', label: 'Estado del Siniestro' },
  { clave: 'nombreFuncionario', label: 'Funcionario Aseguradora' },
  { clave: 'diasUltRev', label: 'Dias Ultima Revisión' },
  { clave: 'obseSegmnto', label: 'Observaciones de Seguimiento' },
  // Campos adicionales de FormularioCasoComplex, con claves únicas
  { clave: 'responsable_form', label: 'Responsable (formulario)' },
  { clave: 'aseguradora_form', label: 'Aseguradora (formulario)' },
  { clave: 'funcionario_aseguradora_form', label: 'Funcionario Aseguradora (formulario)' },
  { clave: 'numero_siniestro_form', label: 'Número de Siniestro (formulario)' },
  { clave: 'codigo_workflow_form', label: 'Código Workflow (formulario)' },
  { clave: 'intermediario_form', label: 'Intermediario (formulario)' },
  { clave: 'numero_poliza_form', label: 'Número de Póliza (formulario)' },
  { clave: 'asegurado_form', label: 'Asegurado (formulario)' },
  { clave: 'tipo_documento_form', label: 'Tipo de Documento (formulario)' },
  { clave: 'numero_documento_form', label: 'Número de Documento (formulario)' },
  { clave: 'fecha_asignacion_form', label: 'Fecha Asignación (formulario)' },
  { clave: 'fecha_siniestro_form', label: 'Fecha Siniestro (formulario)' },
  { clave: 'ciudad_siniestro_form', label: 'Ciudad Siniestro (formulario)' },
  { clave: 'tipo_poliza_form', label: 'Tipo de Póliza (formulario)' },
  { clave: 'causa_siniestro_form', label: 'Causa Siniestro (formulario)' },
  { clave: 'estado_form', label: 'Estado (formulario)' },
  { clave: 'descripcion_siniestro_form', label: 'Descripción Siniestro (formulario)' },
  // Puedes agregar aquí más campos del formulario según los vayas necesitando, siempre con clave única
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
  responsable: siniestro.nombreResponsable || '',
  aseguradora: siniestro.codiAsgrdra || '',
  funcionario_aseguradora: siniestro.nombreFuncionario || '',
  numero_siniestro: siniestro.nmroSinstro || '',
  codigo_workflow: siniestro.codWorkflow || '',
  intermediario: siniestro.intermediario || '',
  numero_poliza: siniestro.nmroPolza || '',
  asegurado: siniestro.asgrBenfcro || '',
  tipo_documento: siniestro.tipoDucumento || '',
  numero_documento: siniestro.numDocumento || '',
  fecha_asignacion: toDateInputValue(siniestro.fchaAsgncion),
  fecha_siniestro: toDateInputValue(siniestro.fchaSinstro),
  ciudad_siniestro: siniestro.ciudadSiniestro || '',
  tipo_poliza: siniestro.tipoPoliza || '',
  causa_siniestro: siniestro.causa_siniestro || '',
  estado: siniestro.codiEstdo || '',
  descripcion_siniestro: siniestro.descSinstro || '',
  fcha_inspccion: toDateInputValue(siniestro.fchaInspccion),
  fcha_soli_docu: toDateInputValue(siniestro.fcha_soli_docu),
  fcha_info_prelm: toDateInputValue(siniestro.fcha_info_prelm),
  fcha_info_fnal: toDateInputValue(siniestro.fcha_info_fnal),
  fcha_repo_acti: toDateInputValue(siniestro.fcha_repo_acti),
  fcha_ult_segui: toDateInputValue(siniestro.fcha_ult_segui),
  fcha_act_segui: toDateInputValue(siniestro.fcha_act_segui),
  fcha_finqto_indem: toDateInputValue(siniestro.fcha_finqto_indem),
  fcha_factra: toDateInputValue(siniestro.fcha_factra),
  fcha_ult_revi: toDateInputValue(siniestro.fcha_ult_revi),
  // Números y montos
  dias_transcrrdo: siniestro.dias_transcrrdo || '',
  vlor_resrva: siniestro.vlor_resrva || '',
  vlor_reclmo: siniestro.vlor_reclmo || '',
  monto_indmzar: siniestro.monto_indmzar || '',
  vlor_servcios: siniestro.vlor_servcios || '',
  vlor_gastos: siniestro.vlor_gastos || '',
  total: siniestro.total || '',
  total_general: siniestro.total_general || '',
  total_pagado: siniestro.total_pagado || '',
  iva: siniestro.iva || '',
  reteiva: siniestro.reteiva || '',
  retefuente: siniestro.retefuente || '',
  reteica: siniestro.reteica || '',
  porc_iva: siniestro.porc_iva || '',
  porc_reteiva: siniestro.porc_reteiva || '',
  porc_retefuente: siniestro.porc_retefuente || '',
  porc_reteica: siniestro.porc_reteica || '',
  // Adjuntos y observaciones
  obse_cont_ini: siniestro.obse_cont_ini || '',
  anex_cont_ini: siniestro.anex_cont_ini || '',
  obse_inspccion: siniestro.obse_inspccion || '',
  anex_acta_inspccion: siniestro.anex_acta_inspccion || '',
  anex_sol_doc: siniestro.anex_sol_doc || '',
  obse_soli_docu: siniestro.obse_soli_docu || '',
  anxo_inf_prelim: siniestro.anxo_inf_prelim || '',
  obse_info_prelm: siniestro.obse_info_prelm || '',
  anxo_info_fnal: siniestro.anxo_info_fnal || '',
  obse_info_fnal: siniestro.obse_info_fnal || '',
  anxo_repo_acti: siniestro.anxo_repo_acti || '',
  obse_repo_acti: siniestro.obse_repo_acti || '',
  anxo_factra: siniestro.anxo_factra || '',
  anxo_honorarios: siniestro.anxo_honorarios || '',
  anxo_honorariosdefinit: siniestro.anxo_honorariosdefinit || '',
  anxo_autorizacion: siniestro.anxo_autorizacion || '',
  obse_comprmsi: siniestro.obse_comprmsi || '',
  obse_segmnto: siniestro.obse_segmnto || '',
  // ...agrega aquí cualquier otro campo que uses en el formulario
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

  // Función para obtener el nombre del estado, priorizando codiEstdo
  const getNombreEstado = (siniestro) => {
    // Busca el valor del código de estado en el objeto
    const valor = siniestro.codiEstdo ?? siniestro.codi_estdo ?? siniestro.codiEstado;
    // Busca el estado en la lista de estados
    const estado = estados.find(e =>
      String(e.codiEstado) === String(valor)
    );
    // Si no lo encuentra, muestra el valor numérico
    return estado ? estado.descEstado : valor ?? '';
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
                      {clave.toLowerCase().includes('estado')
                        ? (() => {
                            const valor = siniestro[clave];
                            const nombre = getNombreEstado(siniestro);
                            return nombre && nombre !== valor ? `${valor} (${nombre})` : valor;
                          })()
                        : siniestro[clave] || ''}
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
