import axios from "axios";

const API_URL = "http://13.59.106.174:3000";


export const registrarUsuario = async (datos) => {
  return axios.post(`${API_URL}/api/auth/registro`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`${API_URL}/api/auth/login`, datos);
};

export const obtenerPerfil = async (token) => {
  return axios.get(`${API_URL}/api/usuarios/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
