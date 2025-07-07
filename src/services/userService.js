// src/services/userService.js
import axios from "axios";

// Asegúrate de usar el protocolo correcto:
//const API_URL = "https://grupoproser.com.co/api";
const API_URL = "/api";

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

// Nueva función para subir y actualizar la foto de perfil
export const actualizarFoto = async (formData, token) => {
 return axios.put(
    `${API_URL}/usuarios/perfil`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
};
