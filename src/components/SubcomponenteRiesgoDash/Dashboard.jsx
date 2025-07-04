import React, { useEffect, useState } from 'react';
import { obtenerCasosRiesgo } from '../../services/riesgoService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from "../Loader"; // Ajusta la ruta si es necesario

const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const data = await obtenerCasosRiesgo();
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
    'PENDIENTE', 'EN PROCESO', 'SIN ASIGNAR'
  ];

  const casosPendientes = casos.filter(c => estadosPendientes.includes(c.estado)).length;

  const ultimosCasos = [...casos]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
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

  // Gráfico de barras → Días promedio (fecha cierre - fecha creación) por responsable
  const diasPorResponsable = {};

  casos.forEach(caso => {
    const fechaCierre = caso.fecha_cierre ? new Date(caso.fecha_cierre) : null;
    const fechaCreacion = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;

    if (fechaCierre && fechaCreacion) {
      const diffDias = Math.abs((fechaCierre - fechaCreacion) / (1000 * 60 * 60 * 24));
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
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Dashboard de Casos de Riesgo</h2>

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
              <li key={caso.id} className="flex justify-between">
                <span>{caso.numero_siniestro || caso.codigo}</span>
                <span className="text-gray-500">{caso.fecha_creacion?.substring(0, 10)}</span>
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
        <h3 className="text-lg font-semibold mb-4 text-center">📅 Días promedio (Cierre → Creación) por Responsable</h3>
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

export default Dashboard;