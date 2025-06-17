// src/components/DashboardComplex.jsx
import React, { useEffect, useState } from 'react';
import { obtenerCasosComplex } from '../services/complexService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Circles } from 'react-loader-spinner';
import Loader from "./Loader"; // Ajusta la ruta si es necesario

const DashboardComplex = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const data = await obtenerCasosComplex();
        setCasos(data);
      } catch (error) {
        console.error('Error al cargar casos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasos();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Métricas
  const totalCasos = casos.length;

  const estadosPendientes = [
    'PENDIENTE DOCUMENTOS',
    'PENDIENTE ACEPTACION CLIENTE',
    'PENDIENTE ACEPTACION CIFRAS'
  ];

  const casosPendientes = casos.filter(c => estadosPendientes.includes(c.estado)).length;

  const ultimosCasos = [...casos]
    .sort((a, b) => new Date(b.fecha_asignacion) - new Date(a.fecha_asignacion))
    .slice(0, 5);

  // Gráfico de barras → Casos por estado
  const casosPorEstado = Object.entries(
    casos.reduce((acc, caso) => {
      acc[caso.estado] = (acc[caso.estado] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, cantidad]) => ({ estado, cantidad }));

  // Gráfico circular → Casos por aseguradora
  const casosPorAseguradora = Object.entries(
    casos.reduce((acc, caso) => {
      acc[caso.aseguradora] = (acc[caso.aseguradora] || 0) + 1;
      return acc;
    }, {})
  ).map(([aseguradora, cantidad]) => ({ aseguradora, cantidad }));

  // Gráfico de barras → Días promedio (fecha informe final - fecha ultimo documento) por responsable
  const diasPorResponsable = {};

  casos.forEach(caso => {
    const fechaFinal = caso.fecha_informe_final ? new Date(caso.fecha_informe_final) : null;
    const fechaUltimoDoc = caso.fecha_ultimo_documento ? new Date(caso.fecha_ultimo_documento) : null;

    if (fechaFinal && fechaUltimoDoc) {
      const diffDias = Math.abs((fechaUltimoDoc - fechaFinal) / (1000 * 60 * 60 * 24));
      if (!diasPorResponsable[caso.responsable]) {
        diasPorResponsable[caso.responsable] = [];
      }
      diasPorResponsable[caso.responsable].push(diffDias);
    }
  });

  const promedioDiasPorResponsable = Object.entries(diasPorResponsable).map(([responsable, dias]) => {
    const promedio = dias.reduce((sum, d) => sum + d, 0) / dias.length;
    return { responsable, promedioDias: Math.round(promedio) };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33', '#FF6633'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Dashboard de Casos Complex</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Total de Casos</h3>
          <p className="text-4xl font-bold text-blue-600">{totalCasos}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Casos Pendientes</h3>
          <p className="text-4xl font-bold text-red-500">{casosPendientes}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Últimos Casos Registrados</h3>
          <ul className="text-sm space-y-1">
            {ultimosCasos.map(caso => (
              <li key={caso.id_complex} className="flex justify-between">
                <span>{caso.numero_siniestro}</span>
                <span className="text-gray-500">{caso.fecha_asignacion?.substring(0, 10)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">📊 Casos por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={casosPorEstado}>
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">🥧 Casos por Aseguradora</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={casosPorAseguradora}
                dataKey="cantidad"
                nameKey="aseguradora"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {casosPorAseguradora.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">📅 Días promedio (Informe Final → Último Documento) por Responsable</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={promedioDiasPorResponsable}>
            <XAxis dataKey="responsable" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="promedioDias" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComplex;
