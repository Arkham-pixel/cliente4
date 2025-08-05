import axios from "axios";

// Configurar axios con timeouts más largos para Firebase -> AWS
const api = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

export const obtenerCasos = async () => {
  const res = await api.get("/riesgos");
  return res.data;
};

export const obtenerCasosRiesgo = async () => {
  const res = await api.get("/riesgos");
  return res.data;
};

export const eliminarCaso = async (id) => {
  return api.delete(`/api/riesgos/${id}`);
};

export const deleteCasoRiesgo = async (id) => {
  return api.delete(`/api/riesgos/${id}`);
};

export const obtenerResponsables = async () => {
  const res = await api.get("/api/responsables");
  return res.data;
};

export const obtenerEstados = async () => {
  const res = await api.get("/api/estados/estados-riesgos");
  return res.data;
};

