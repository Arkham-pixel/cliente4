import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Configurar axios con timeouts más largos para Firebase -> AWS
const api = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

const CasosRiesgoContext = createContext();

export const useCasosRiesgo = () => useContext(CasosRiesgoContext); // SOLO UNA VEZ

export const CasosRiesgoProvider = ({ children }) => {
  const [casos, setCasos] = useState([]);

  // Cargar casos desde el backend al iniciar
  useEffect(() => {
    cargarCasos();
  }, []);

  const cargarCasos = async () => {
    try {
      const res = await api.get("https://api.grupoproser.com.co/api/riesgos");
      setCasos(res.data);
    } catch (err) {
      console.error("Error al cargar casos de riesgo:", err);
    }
  };

  const agregarCaso = async (nuevoCaso) => {
    try {
      let dataToSend = nuevoCaso;
      let config = {};
      // Si hay archivos adjuntos, usar FormData
      const formData = new FormData();
      let hasFile = false;
      Object.entries(nuevoCaso).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          hasFile = true;
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (hasFile) {
        dataToSend = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      await api.post('https://api.grupoproser.com.co/api/riesgos', dataToSend, config);
      await cargarCasos();
    } catch (err) {
      console.error('Error al agregar caso de riesgo:', err);
    }
  };

  const editarCaso = async (index, nuevoCaso) => {
    try {
      const caso = casos[index];
      if (!caso || !caso._id) throw new Error('No se encontró el caso a editar');
      let dataToSend = nuevoCaso;
      let config = {};
      const formData = new FormData();
      let hasFile = false;
      Object.entries(nuevoCaso).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          hasFile = true;
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (hasFile) {
        dataToSend = formData;
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      await api.put(`https://api.grupoproser.com.co/api/riesgos/${caso._id}`, dataToSend, config);
      await cargarCasos();
    } catch (err) {
      console.error('Error al editar caso de riesgo:', err);
    }
  };

  return (
    <CasosRiesgoContext.Provider value={{ casos, agregarCaso, editarCaso, cargarCasos }}>
      {children}
    </CasosRiesgoContext.Provider>
  );
};