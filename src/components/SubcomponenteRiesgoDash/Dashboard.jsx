import React, { useEffect, useState } from 'react';
import { obtenerCasosRiesgo, obtenerResponsables, obtenerEstados } from '../../services/riesgoService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Loader from "../Loader"; // Ajusta la ruta si es necesario

const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [estados, setEstados] = useState([]);
  const [responsables, setResponsables] = useState([]);

  // Helper para mostrar nombre de estado
  const getEstadoNombre = codigo => {
    if (!estados || estados.length === 0) return codigo;
    const est = estados.find(e => String(e.codiEstdo) === String(codigo));
    return est ? est.descEstdo : codigo;
  };
  // Helper para mostrar nombre de responsable
  const getResponsableNombre = codigo => {
    if (!responsables || responsables.length === 0) return codigo;
    const resp = responsables.find(r => String(r.codiRespnsble) === String(codigo));
    return resp ? resp.nmbrRespnsble : codigo;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [data, estadosData, responsablesData] = await Promise.all([
          obtenerCasosRiesgo(),
          obtenerEstados(),
          obtenerResponsables()
        ]);
        setEstados(estadosData);
        setResponsables(responsablesData);
        const mapeados = data.map(caso => ({
          ...caso,
          estado: caso.codiEstdo || caso.estado,
          aseguradora: caso.asgrBenfcro || caso.aseguradora,
          fecha_creacion: caso.fchaAsgncion || caso.fecha_creacion,
          fecha_cierre: caso.fchaInforme || caso.fecha_cierre,
          numero_siniestro: caso.nmroRiesgo || caso.numero_siniestro,
          responsable: caso.codiIspector || caso.responsable,
        }));
        setCasos(mapeados);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Filtros
  const casosFiltrados = casos.filter(caso => {
    let ok = true;
    if (fechaDesde) {
      const f = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;
      if (!f || f < new Date(fechaDesde)) ok = false;
    }
    if (fechaHasta) {
      const f = caso.fecha_creacion ? new Date(caso.fecha_creacion) : null;
      if (!f || f > new Date(fechaHasta)) ok = false;
    }
    if (estadoFiltro) {
      ok = ok && String(caso.estado) === String(estadoFiltro);
    }
    return ok;
  });

  // Métricas
  const totalCasos = casosFiltrados.length;
  const estadosPendientes = ['PENDIENTE', 'EN PROCESO', 'SIN ASIGNAR', 1, 2, 3];
  const casosPendientes = casosFiltrados.filter(c => estadosPendientes.includes(c.estado)).length;
  const ultimosCasos = [...casosFiltrados]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);

  // Gráfico de barras → Casos por estado
  const casosPorEstado = Object.entries(
    casosFiltrados.reduce((acc, caso) => {
      const nombre = getEstadoNombre(caso.estado);
      acc[nombre] = (acc[nombre] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, cantidad]) => ({ estado, cantidad }));

  // Gráfico de barras horizontal → Top 10 aseguradoras
  const aseguradoraCount = {};
  casosFiltrados.forEach(caso => {
    if (caso.aseguradora) {
      aseguradoraCount[caso.aseguradora] = (aseguradoraCount[caso.aseguradora] || 0) + 1;
    }
  });
  const topAseguradoras = Object.entries(aseguradoraCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([aseguradora, cantidad]) => ({ aseguradora, cantidad }));

  // Gráfico de barras → Días promedio (fecha cierre - fecha creación) por responsable
  const diasPorResponsable = {};
  casosFiltrados.forEach(caso => {
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
  const promedioDiasPorResponsable = Object.entries(diasPorResponsable)
    .map(([responsable, dias]) => {
      const promedio = dias.reduce((sum, d) => sum + d, 0) / dias.length;
      return { responsable: getResponsableNombre(responsable), promedioDias: Math.round(promedio) };
    });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC33', '#FF6633'];

  // Lista de estados para el filtro
  const estadosUnicos = Array.from(new Set(casos.map(c => c.estado))).map(e => ({ value: e, label: getEstadoNombre(e) }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Dashboard de Casos de Riesgo</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 items-end justify-center">
        <div>
          <label className="block text-xs font-semibold mb-1">Fecha desde</label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="border rounded px-2 py-1 text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Fecha hasta</label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="border rounded px-2 py-1 text-xs" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Estado</label>
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)} className="border rounded px-2 py-1 text-xs">
            <option value="">Todos</option>
            {estadosUnicos.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

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
            {ultimosCasos.map((caso, idx) => (
              <li key={caso._id || caso.nmroRiesgo || idx} className="flex justify-between">
                <span>{caso.numero_siniestro || caso.nmroRiesgo || caso.codigo}</span>
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
            <BarChart data={casosPorEstado} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="estado" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center">🏢 Top 10 Aseguradoras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAseguradoras} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="aseguradora" type="category" width={180} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#FF8042" />
            </BarChart>
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