import axios from "axios";

const API_URL ="grupoproser.com.co/api";

export const registrarUsuario = async (datos) => {
  return axios.post(`${API_URL}/auth/registro`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`${API_URL}/auth/login`, datos);
};

export const obtenerPerfil = async (token) => {
  return axios.get(`${API_URL}/usuarios/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

