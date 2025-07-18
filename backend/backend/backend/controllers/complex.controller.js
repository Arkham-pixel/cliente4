// backend/controllers/complex.controller.js
import Complex from '../models/Complex.js';
import Siniestro from '../models/CasoComplex.js';

// Crear un nuevo caso
export const crearComplex = async (req, res) => {
  try {
    const nuevo = new Complex(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los casos (unificados de ambas bases, mapeando campos)
export const obtenerTodos = async (req, res) => {
  try {
    const [casos, siniestros] = await Promise.all([
      Complex.find().sort({ creado_en: -1 }),
      Siniestro.find()
    ]);
    // Mapeo de campos para siniestros secundarios
    const siniestrosNormalizados = siniestros.map(s => ({
      _id: s._id,
      numero_ajuste: s.nmro_ajste || '',
      codigo_workflow: s.cod_workflow || '',
      numero_siniestro: s.nmro_sinstro || '',
      intermediario: s.nomb_intermediario || '',
      aseguradora: s.codi_asgrdra || '',
      funcionario_aseguradora: s.func_asgrdra || '',
      responsable: s.codiRespnsble || '',
      asegurado: s.asgr_benfcro || '',
      tipo_documento: s.tipo_ducumento || '',
      numero_documento: s.num_documento || '',
      fecha_siniestro: s.fcha_sinstro || '',
      ciudad_siniestro: s.ciudad_siniestro || '',
      descripcion_siniestro: s.desc_sinstro || '',
      estado: s.codi_estdo || '',
      tipo_poliza: s.tipo_poliza || '',
      causa_siniestro: s.causa_siniestro || '',
      valor_reserva: s.vlor_resrva || '',
      valor_reclamo: s.vlor_reclmo || '',
      monto_indemnizar: s.monto_indmzar || '',
      fecha_contacto_inicial: s.fcha_cont_ini || '',
      observaciones_contacto_inicial: s.obse_cont_ini || '',
      adjuntos_contacto_inicial: s.anex_cont_ini || '',
      fecha_inspeccion: s.fcha_inspccion || '',
      observacion_inspeccion: s.obse_inspccion || '',
      adjunto_acta_inspeccion: s.anex_acta_inspccion || '',
      fecha_solicitud_documentos: s.fcha_soli_docu || '',
      observacion_solicitud_documento: s.obse_soli_docu || '',
      adjunto_solicitud_documento: s.anex_sol_doc || '',
      fecha_informe_preliminar: s.fcha_info_prelm || '',
      adjunto_informe_preliminar: s.anxo_inf_prelim || '',
      observacion_informe_preliminar: s.obse_info_prelm || '',
      fecha_informe_final: s.fcha_info_fnal || '',
      adjunto_informe_final: s.anxo_info_fnal || '',
      observacion_informe_final: s.obse_info_fnal || '',
      fecha_ultimo_documento: s.fcha_repo_acti || '',
      adjunto_entrega_ultimo_documento: s.anxo_repo_acti || '',
      numero_factura: s.nmro_factra || '',
      valor_servicio: s.vlor_servcios || '',
      valor_gastos: s.vlor_gastos || '',
      iva: s.iva || '',
      reteiva: s.reteiva || '',
      retefuente: s.retefuente || '',
      reteica: s.reteica || '',
      total_base: s.total || '',
      total_factura: s.total_general || '',
      total_pagado: s.total_pagado || '',
      fecha_factura: s.fcha_factra || '',
      fecha_ultima_revision: s.fcha_ult_revi || '',
      observacion_compromisos: s.obse_comprmsi || '',
      adjunto_factura: s.anxo_factra || '',
      fecha_ultimo_seguimiento: s.fcha_ult_segui || '',
      observacion_seguimiento_pendientes: s.obse_segmnto || '',
      adjunto_seguimientos_pendientes: '', // No hay campo directo
      numero_poliza: s.nmro_polza || '',
      fecha_asignacion: s.fcha_asgncion || '',
      creado_en: s.createdAt || '',
      // Campos adicionales agregados
      amparo_afectado: s.ampr_afctdo || '',
      fecha_fin_quito_indemnizacion: s.fcha_finqto_indem || '',
      anexo_honorarios: s.anxo_honorarios || '',
      anexo_honorarios_definitivo: s.anxo_honorariosdefinit || '',
      anexo_autorizacion: s.anxo_autorizacion || '',
      porcentaje_iva: s.porc_iva || '',
      porcentaje_reteiva: s.porc_reteiva || '',
      porcentaje_retefuente: s.porc_retefuente || '',
      porcentaje_reteica: s.porc_reteica || '',
    }));
    res.json([...casos, ...siniestrosNormalizados]);
  } catch (error) {
    console.error('Error al obtener los casos:', error);
    res.status(500).json({ error: 'Error al obtener los casos' });
  }
};

// Obtener un caso por ID
export const obtenerPorId = async (req, res) => {
  try {
    const caso = await Complex.findById(req.params.id);
    if (!caso) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(caso);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el caso' });
  }
};

// Actualizar un caso
export const actualizarComplex = async (req, res) => {
  try {
    const casoActualizado = await Complex.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!casoActualizado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(casoActualizado);
  } catch (error) {
    console.error('Error al actualizar el caso:', error);
    res.status(500).json({ error: 'Error al actualizar el caso' });
  }
};

// Eliminar un caso
export const eliminarComplex = async (req, res) => {
  try {
    const casoEliminado = await Complex.findByIdAndDelete(req.params.id);
    if (!casoEliminado) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el caso:', error);
    res.status(500).json({ error: 'Error al eliminar el caso' });
  }
};
