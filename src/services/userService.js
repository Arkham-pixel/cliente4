import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://tu-backend-874854648927.us-central1.run.app/api";

export const registrarUsuario = async (datos) => {
  return axios.post(`${API_URL}/auth/register`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`${API_URL}/auth/login`, datos);
};

export const obtenerPerfil = async (token) => {
  return axios.get(`${API_URL}/usuarios/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
