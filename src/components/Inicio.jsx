// src/components/Inicio.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simulación de usuarios y comunicados reales (reemplaza por tu backend o contexto)
const usuariosEjemplo = [
  // { nombre: "Juan Pérez", puntos: 120 },
  // { nombre: "Ana Gómez", puntos: 110 },
  // { nombre: "Carlos Ruiz", puntos: 90 },
];

const comunicadosIniciales = [
  // { id: 1, titulo: "Mantenimiento", mensaje: "La plataforma estará en mantenimiento el sábado.", fecha: "2025-06-28" }
];

const usuarioActual = {
  nombre: localStorage.getItem('nombre') || "Usuario",
  rol: localStorage.getItem('rol') || "usuario",
  login: localStorage.getItem('login') || ""
};

function diasDesde(fecha) {
  const hoy = new Date();
  const fechaCom = new Date(fecha);
  const diff = Math.floor((hoy - fechaCom) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "Hoy" : diff === 1 ? "Hace 1 día" : `Hace ${diff} días`;
}

const Inicio = () => {
  // Tareas del usuario
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editTexto, setEditTexto] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [busquedaTarea, setBusquedaTarea] = useState("");

  // Ranking y comunicados
  const [usuarios, setUsuarios] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const [nuevoComunicado, setNuevoComunicado] = useState({ titulo: "", mensaje: "", duracion: 1 });
  const [editandoComId, setEditandoComId] = useState(null);
  const [editComunicado, setEditComunicado] = useState({ titulo: "", mensaje: "" });
  const [busquedaComunicado, setBusquedaComunicado] = useState("");

  // Cargar tareas y comunicados al iniciar
  useEffect(() => {
    // Simulación de fetch real
    const fetchTareas = async () => {
      try {
        // const res = await axios.get(`/api/tareas?login=${usuarioActual.login}`);
        // setTareas(res.data);
        setTareas([]); // Simulado
      } catch (err) {
        alert("Error al cargar tareas");
      }
    };
    const fetchComunicados = async () => {
      try {
        // const res = await axios.get(`/api/comunicados`);
        // setComunicados(res.data);
        setComunicados([]); // Simulado
      } catch (err) {
        alert("Error al cargar comunicados");
      }
    };
    const fetchUsuarios = async () => {
      try {
        // const res = await axios.get(`/api/usuarios/ranking`);
        // setUsuarios(res.data);
        setUsuarios([]); // Simulado
      } catch (err) {
        alert("Error al cargar ranking");
      }
    };
    fetchTareas();
    fetchComunicados();
    fetchUsuarios();
  }, []);

  // Tareas
  const agregarTarea = async () => {
    if (!nuevaTarea.trim() || !nuevaFecha) {
      alert("Debes ingresar la tarea y la fecha");
      return;
    }
    if (new Date(nuevaFecha) < new Date(new Date().toISOString().slice(0, 10))) {
      alert("La fecha no puede ser pasada");
      return;
    }
    try {
      // await axios.post(`/api/tareas`, { texto: nuevaTarea, fecha: nuevaFecha, login: usuarioActual.login });
      setTareas([
        ...tareas,
        { id: Date.now(), texto: nuevaTarea, fecha: nuevaFecha, cumplida: false }
      ]);
      setNuevaTarea("");
      setNuevaFecha("");
      alert("Tarea agregada");
    } catch (err) {
      alert("Error al agregar tarea");
    }
  };

  const guardarEdicion = async (id) => {
    if (!editTexto.trim() || !editFecha) {
      alert("Debes ingresar la tarea y la fecha");
      return;
    }
    if (new Date(editFecha) < new Date(new Date().toISOString().slice(0, 10))) {
      alert("La fecha no puede ser pasada");
      return;
    }
    try {
      // await axios.put(`/api/tareas/${id}`, { texto: editTexto, fecha: editFecha });
      setTareas(tareas.map(t =>
        t.id === id ? { ...t, texto: editTexto, fecha: editFecha } : t
      ));
      setEditandoId(null);
      setEditTexto("");
      setEditFecha("");
      alert("Tarea editada");
    } catch (err) {
      alert("Error al editar tarea");
    }
  };

  const toggleCumplida = async (id) => {
    try {
      // await axios.patch(`/api/tareas/${id}/cumplida`);
      setTareas(tareas.map(t =>
        t.id === id ? { ...t, cumplida: !t.cumplida } : t
      ));
    } catch (err) {
      alert("Error al actualizar tarea");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      // await axios.delete(`/api/tareas/${id}`);
      setTareas(tareas.filter(t => t.id !== id));
      alert("Tarea eliminada");
    } catch (err) {
      alert("Error al eliminar tarea");
    }
  };

  // Comunicados (solo admin/soporte)
  const puedeGestionarComunicados = usuarioActual.rol === "admin" || usuarioActual.rol === "soporte";

  const agregarComunicado = async () => {
    if (!nuevoComunicado.titulo.trim() || !nuevoComunicado.mensaje.trim() || nuevoComunicado.duracion <= 0) {
      alert("Debes ingresar título, mensaje y duración válida");
      return;
    }
    try {
      // await axios.post(`/api/comunicados`, nuevoComunicado);
      const fechaInicio = new Date();
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + Number(nuevoComunicado.duracion));
      setComunicados([
        ...comunicados,
        {
          id: Date.now(),
          titulo: nuevoComunicado.titulo,
          mensaje: nuevoComunicado.mensaje,
          fecha: fechaInicio.toISOString().slice(0, 10),
          fechaFin: fechaFin.toISOString().slice(0, 10),
          duracion: nuevoComunicado.duracion,
        }
      ]);
      setNuevoComunicado({ titulo: "", mensaje: "", duracion: 1 });
      alert("Comunicado agregado");
    } catch (err) {
      alert("Error al agregar comunicado");
    }
  };

  const eliminarComunicado = async (id) => {
    try {
      // await axios.delete(`/api/comunicados/${id}`);
      setComunicados(comunicados.filter(c => c.id !== id));
      alert("Comunicado eliminado");
    } catch (err) {
      alert("Error al eliminar comunicado");
    }
  };

  const iniciarEdicionCom = (com) => {
    setEditandoComId(com.id);
    setEditComunicado({ titulo: com.titulo, mensaje: com.mensaje });
  };

  const guardarEdicionCom = async (id) => {
    if (!editComunicado.titulo.trim() || !editComunicado.mensaje.trim()) {
      alert("Debes ingresar título y mensaje");
      return;
    }
    try {
      // await axios.put(`/api/comunicados/${id}`, editComunicado);
      setComunicados(comunicados.map(c =>
        c.id === id ? { ...c, ...editComunicado } : c
      ));
      setEditandoComId(null);
      setEditComunicado({ titulo: "", mensaje: "" });
      alert("Comunicado editado");
    } catch (err) {
      alert("Error al editar comunicado");
    }
  };

  // Filtrado de tareas y comunicados
  const tareasFiltradas = tareas.filter(t =>
    t.texto.toLowerCase().includes(busquedaTarea.toLowerCase())
  );
  const comunicadosFiltrados = comunicados.filter(c =>
    c.titulo.toLowerCase().includes(busquedaComunicado.toLowerCase()) ||
    c.mensaje.toLowerCase().includes(busquedaComunicado.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tabla de tareas */}
      <div className="bg-white rounded shadow p-4 col-span-2">
        <h2 className="text-xl font-bold mb-4">📝 Mis tareas</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nueva tarea"
            className="border px-2 py-1 rounded flex-1"
            value={nuevaTarea}
            onChange={e => setNuevaTarea(e.target.value)}
          />
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={nuevaFecha}
            onChange={e => setNuevaFecha(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={agregarTarea}
          >
            Agregar
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar tarea..."
          className="border px-2 py-1 rounded mb-2 w-full"
          value={busquedaTarea}
          onChange={e => setBusquedaTarea(e.target.value)}
        />
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tarea</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Cumplida</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">Sin tareas</td>
              </tr>
            ) : tareasFiltradas.map(t => (
              <tr key={t.id} className={t.cumplida ? "bg-green-50" : ""}>
                <td className="p-2">
                  {editandoId === t.id ? (
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      value={editTexto}
                      onChange={e => setEditTexto(e.target.value)}
                    />
                  ) : t.texto}
                </td>
                <td className="p-2">
                  {editandoId === t.id ? (
                    <input
                      type="date"
                      className="border px-2 py-1 rounded"
                      value={editFecha}
                      onChange={e => setEditFecha(e.target.value)}
                    />
                  ) : t.fecha}
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={t.cumplida}
                    onChange={() => toggleCumplida(t.id)}
                  />
                </td>
                <td className="p-2 space-x-2">
                  {editandoId === t.id ? (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => guardarEdicion(t.id)}
                    >
                      Guardar
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                        onClick={() => {
                          setEditandoId(t.id);
                          setEditTexto(t.texto);
                          setEditFecha(t.fecha);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => eliminarTarea(t.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ranking de usuarios */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">🏆 Ranking de usuarios</h2>
        {usuarios.length === 0 ? (
          <div className="text-gray-400 text-center">No hay usuarios registrados.</div>
        ) : (
          <ol className="space-y-2">
            {[...usuarios]
              .sort((a, b) => b.puntos - a.puntos)
              .map((u, idx) => (
                <li key={u.nombre} className="flex items-center gap-2">
                  <span className="font-bold text-lg">{idx + 1}.</span>
                  <span>{u.nombre}</span>
                  {u.avatar && <img src={u.avatar} alt="avatar" className="w-6 h-6 rounded-full ml-2" />}
                  <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{u.puntos} pts</span>
                </li>
              ))}
          </ol>
        )}
      </div>

      {/* Tablero de comunicados */}
      <div className="bg-white rounded shadow p-4 mt-6 md:mt-0 md:col-span-3">
        <h2 className="text-xl font-bold mb-4">📢 Comunicados</h2>
        <input
          type="text"
          placeholder="Buscar comunicado..."
          className="border px-2 py-1 rounded mb-2 w-full"
          value={busquedaComunicado}
          onChange={e => setBusquedaComunicado(e.target.value)}
        />
        {puedeGestionarComunicados && (
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Título"
              className="border px-2 py-1 rounded flex-1"
              value={nuevoComunicado.titulo}
              onChange={e => setNuevoComunicado({ ...nuevoComunicado, titulo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mensaje"
              className="border px-2 py-1 rounded flex-1"
              value={nuevoComunicado.mensaje}
              onChange={e => setNuevoComunicado({ ...nuevoComunicado, mensaje: e.target.value })}
            />
            <input
              type="number"
              min={1}
              placeholder="Duración (días)"
              className="border px-2 py-1 rounded w-32"
              value={nuevoComunicado.duracion}
              onChange={e => setNuevoComunicado({ ...nuevoComunicado, duracion: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={agregarComunicado}
            >
              Agregar
            </button>
          </div>
        )}
        <ul className="space-y-3">
          {comunicadosFiltrados.length === 0 ? (
            <li className="text-gray-400 text-center">No hay comunicados.</li>
          ) : comunicadosFiltrados.map((c, idx) => (
            <li key={c.id || idx} className="border-l-4 border-blue-600 pl-3 relative">
              {editandoComId === c.id ? (
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={editComunicado.titulo}
                    onChange={e => setEditComunicado({ ...editComunicado, titulo: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={editComunicado.mensaje}
                    onChange={e => setEditComunicado({ ...editComunicado, mensaje: e.target.value })}
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => guardarEdicionCom(c.id)}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <>
                  <div className="font-semibold">{c.titulo}</div>
                  <div className="text-gray-700">{c.mensaje}</div>
                  <div className="text-xs text-gray-400">
                    {c.fecha} &middot; {diasDesde(c.fecha)} &middot; Vigente hasta: {c.fechaFin}
                  </div>
                  {puedeGestionarComunicados && (
                    <div className="absolute top-1 right-2 flex gap-1">
                      <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                        onClick={() => iniciarEdicionCom(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => eliminarComunicado(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inicio;
