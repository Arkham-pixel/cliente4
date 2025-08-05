// src/services/userService.js
import axios from "axios";


// Asegúrate de usar el protocolo correcto:
//const API_URL = "https://grupoproser.com.co/api";

//const API_URL = "http://13.59.106.174/api"


export const registrarUsuario = async (datos) => {
  return axios.post(`/api/auth/registro`, datos);
};

export const loginUsuario = async (datos) => {
  return axios.post(`/api/auth/login`, datos);
};

export const obtenerPerfil = async (token, tipo = "normal") => {
  const url =
    tipo === "secur"
      ? "/api/secur-users/perfil"
      : "/api/usuarios/perfil";
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nueva función para subir y actualizar la foto de perfil
export const actualizarFoto = (formData, token) =>
  axios.put(
    `/usuarios/perfil`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    }
  );

export const actualizarPerfil = async (data, token, tipo = "normal") => {
  const url =
    tipo === "secur"
      ? "/api/secur-users/perfil"
      : "/api/usuarios/perfil";
  return axios.put(url, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
