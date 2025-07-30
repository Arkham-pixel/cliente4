import axios from "axios";

export const obtenerCasos = async () => {
  const res = await axios.get("https://api.grupoproser.com.co/api/riesgos");
  return res.data;
};

export const obtenerCasosRiesgo = async () => {
  const res = await axios.get("https://api.grupoproser.com.co/api/riesgos");
  return res.data;
};

export const eliminarCaso = async (id) => {
  return axios.delete(`https://api.grupoproser.com.co/api/riesgos/${id}`);
};

export const deleteCasoRiesgo = async (id) => {
  return axios.delete(`https://api.grupoproser.com.co/api/riesgos/${id}`);
};

export const obtenerResponsables = async () => {
  const res = await axios.get("https://api.grupoproser.com.co/api/responsables");
  return res.data;
};

export const obtenerEstados = async () => {
  const res = await axios.get("https://api.grupoproser.com.co/api/estados/estados-riesgos");
  return res.data;
};

