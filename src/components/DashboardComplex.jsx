// src/components/DashboardComplex.jsx
import React, { useEffect, useState } from 'react';
import { getSiniestrosConResponsables } from '../services/siniestrosApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from "./Loader";
import { 
  obtenerNombreEstado, 
  obtenerNombreAseguradora
} from '../data/mapeos';

const DashboardComplex = () => {
  const [siniestros, setSiniestros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiniestros = async () => {
      try {
        const data = await getSiniestrosConResponsables({ page: 1, limit: 1000 });
        console.log('🔍 Dashboard - Datos recibidos:', data);
        console.log('🔍 Dashboard - Primer siniestro:', data.siniestros?.[0]);
        console.log('🔍 Dashboard - nombreFuncionario del primer siniestro:', data.siniestros?.[0]?.nombreFuncionario);
        setSiniestros(data.siniestros || []);
      } catch (error) {
        console.error('Error al cargar siniestros:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSiniestros();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Métricas
  const totalSiniestros = siniestros.length;

  // Contar cada tipo de pendiente por separado
  const pendienteDocumentos = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE DOCUMENTOS'
  ).length;

  const pendienteAceptacionCliente = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE ACEPTACION CLIENTE'
  ).length;

  const pendienteAceptacionCifras = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'PENDIENTE ACEPTACION CIFRAS'
  ).length;

  const enProceso = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'EN PROCESO'
  ).length;

  const cerrado = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'CERRADO'
  ).length;

  const suspendido = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'SUSPENDIDO'
  ).length;

  const revision = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'REVISION'
  ).length;

  const finalizado = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'FINALIZADO'
  ).length;

  const cancelado = siniestros.filter(s => 
    obtenerNombreEstado(s.codiEstdo) === 'CANCELADO'
  ).length;

  const ultimosSiniestros = [...siniestros]
    .sort((a, b) => new Date(b.fchaAsgncion) - new Date(a.fchaAsgncion))
    .slice(0, 5);

  // Gráfico de barras → Siniestros por estado
  const siniestrosPorEstado = Object.entries(
    siniestros.reduce((acc, s) => {
      const nombreEstado = obtenerNombreEstado(s.codiEstdo);
      acc[nombreEstado] = (acc[nombreEstado] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, cantidad]) => ({ estado, cantidad }));

  // Gráfico circular → Siniestros por aseguradora
  const siniestrosPorAseguradora = Object.entries(
    siniestros.reduce((acc, s) => {
      const nombreAseguradora = obtenerNombreAseguradora(s.codiAsgrdra);
      acc[nombreAseguradora] = (acc[nombreAseguradora] || 0) + 1;
      return acc;
    }, {})
  ).map(([aseguradora, cantidad]) => ({ aseguradora, cantidad }));

  // Gráfico de barras → Siniestros por ajustador/responsable (usando nombres reales)
  const siniestrosPorResponsable = Object.entries(
    siniestros.reduce((acc, s) => {
      const nombreResponsable = s.nombreResponsable || 'Sin asignar';
      acc[nombreResponsable] = (acc[nombreResponsable] || 0) + 1;
      return acc;
    }, {})
  ).map(([responsable, cantidad]) => ({ responsable, cantidad }));

  // Gráfico de barras → Siniestros por funcionario de aseguradora (usando nombres reales)
  const siniestrosPorFuncionario = Object.entries(
    siniestros.reduce((acc, s) => {
      const nombreFuncionario = s.nombreFuncionario || 'Sin asignar';
      acc[nombreFuncionario] = (acc[nombreFuncionario] || 0) + 1;
      return acc;
    }, {})
  ).map(([funcionario, cantidad]) => ({ funcionario, cantidad }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33', '#FF6633'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Dashboard de Siniestros</h2>

      {/* Tarjeta de total */}
      <div className="bg-white shadow rounded-lg p-4 text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Total de Siniestros</h3>
        <p className="text-4xl font-bold text-blue-600">{totalSiniestros}</p>
      </div>

      {/* Tarjetas de estados por separado */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Pendiente Documentos</h3>
          <p className="text-2xl font-bold text-orange-500">{pendienteDocumentos}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Pendiente Aceptación Cliente</h3>
          <p className="text-2xl font-bold text-yellow-500">{pendienteAceptacionCliente}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Pendiente Aceptación Cifras</h3>
          <p className="text-2xl font-bold text-red-500">{pendienteAceptacionCifras}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">En Proceso</h3>
          <p className="text-2xl font-bold text-blue-500">{enProceso}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Cerrado</h3>
          <p className="text-2xl font-bold text-green-500">{cerrado}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Suspendido</h3>
          <p className="text-2xl font-bold text-gray-500">{suspendido}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Revisión</h3>
          <p className="text-2xl font-bold text-purple-500">{revision}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Finalizado</h3>
          <p className="text-2xl font-bold text-teal-500">{finalizado}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm font-semibold mb-2">Cancelado</h3>
          <p className="text-2xl font-bold text-red-600">{cancelado}</p>
        </div>
      </div>

      {/* Últimos siniestros */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2 text-center">Últimos Siniestros Registrados</h3>
        <ul className="text-sm space-y-1">
          {ultimosSiniestros.map(s => (
            <li key={s._id} className="flex justify-between">
              <span>{s.nmroSinstro}</span>
              <span className="text-gray-500">{s.fchaAsgncion?.substring(0, 10)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">📊 Siniestros por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siniestrosPorEstado}>
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">🥧 Siniestros por Aseguradora</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={siniestrosPorAseguradora}
                dataKey="cantidad"
                nameKey="aseguradora"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {siniestrosPorAseguradora.map((entry, index) => (
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
        <h3 className="text-lg font-semibold mb-4 text-center">👥 Siniestros por Ajustador/Responsable</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siniestrosPorResponsable}>
            <XAxis dataKey="responsable" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">👨‍💼 Siniestros por Funcionario de Aseguradora</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siniestrosPorFuncionario}>
            <XAxis dataKey="funcionario" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardComplex;
