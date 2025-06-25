import React, { createContext, useContext, useState } from "react";

const CasosRiesgoContext = createContext();

export const useCasosRiesgo = () => useContext(CasosRiesgoContext); // SOLO UNA VEZ

export const CasosRiesgoProvider = ({ children }) => {
  const [casos, setCasos] = useState([]);

  const agregarCaso = (nuevoCaso) => setCasos((prev) => [...prev, nuevoCaso]);
  const editarCaso = (index, nuevoCaso) =>
    setCasos((prev) =>
      prev.map((c, i) => (i === index ? nuevoCaso : c))
    );

  return (
    <CasosRiesgoContext.Provider value={{ casos, agregarCaso, editarCaso }}>
      {children}
    </CasosRiesgoContext.Provider>
  );
};