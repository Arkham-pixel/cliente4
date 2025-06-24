import React, { createContext, useContext, useState } from "react";

const CasosRiesgoContext = createContext();

export const useCasosRiesgo = () => useContext(CasosRiesgoContext);

export const CasosRiesgoProvider = ({ children }) => {
  const [casos, setCasos] = useState([]);

  const agregarCaso = (caso) => setCasos(prev => [caso, ...prev]);
  const limpiarCasos = () => setCasos([]);

  return (
    <CasosRiesgoContext.Provider value={{ casos, agregarCaso, limpiarCasos }}>
      {children}
    </CasosRiesgoContext.Provider>
  );
};