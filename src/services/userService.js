// src/services/userService.js
import axios from "axios";

const API_URL = "http://13.59.106.174:3000";

// Asegúrate de usar el protocolo correcto:
//const API_URL = "https://grupoproser.com.co/api";
//const API_URL = "https://api.grupoproser.com.co/api";
//const API_URL = "http://13.59.106.174/api"


export const registrarUsuario = async (datos) => {
  return axios.post(`${API_URL}/api/auth/registro`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`${API_URL}/api/auth/login`, datos);
};

export const obtenerPerfil = async (token, tipo = "normal") => {
  const url =
    tipo === "secur"
      ? "http://13.59.106.174:3000/api/secur-users/perfil"
      : "http://13.59.106.174:3000/api/usuarios/perfil";
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nueva función para subir y actualizar la foto de perfil
export const actualizarFoto = (formData, token) =>
  axios.put(
    `${API_URL}/usuarios/perfil`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );
