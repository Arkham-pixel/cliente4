import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.get("  http://13.59.106.174:3000/api/casos");
      setCasos(res.data);
    } catch (err) {
      console.error("Error al cargar casos de riesgo:", err);
    }
  };

  const agregarCaso = (nuevoCaso) => setCasos((prev) => [...prev, nuevoCaso]);
  const editarCaso = (index, nuevoCaso) =>
    setCasos((prev) =>
      prev.map((c, i) => (i === index ? nuevoCaso : c))
    );

  return (
    <CasosRiesgoContext.Provider value={{ casos, agregarCaso, editarCaso, cargarCasos }}>
      {children}
    </CasosRiesgoContext.Provider>
  );
};