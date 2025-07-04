// src/components/Inicio.jsx
import React, { useState } from 'react';

// Simulación de usuarios y comunicados reales (reemplaza por tu backend o contexto)
const usuariosEjemplo = [
  // { nombre: "Juan Pérez", puntos: 120 },
  // { nombre: "Ana Gómez", puntos: 110 },
  // { nombre: "Carlos Ruiz", puntos: 90 },
];

const comunicadosIniciales = [
  // { id: 1, titulo: "Mantenimiento", mensaje: "La plataforma estará en mantenimiento el sábado.", fecha: "2025-06-28" }
];

// Simula el usuario actual (reemplaza por tu auth real)
const usuarioActual = {
  nombre: "Admin",
  rol: "admin", // Puede ser: "admin", "soporte", "usuario"
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

  // Ranking y comunicados
  const [usuarios] = useState(usuariosEjemplo);
  const [comunicados, setComunicados] = useState(comunicadosIniciales);
  const [nuevoComunicado, setNuevoComunicado] = useState({ titulo: "", mensaje: "", duracion: 1 });
  const [editandoComId, setEditandoComId] = useState(null);
  const [editComunicado, setEditComunicado] = useState({ titulo: "", mensaje: "" });

  // Tareas
  const agregarTarea = () => {
    if (nuevaTarea && nuevaFecha) {
      setTareas([
        ...tareas,
        { id: Date.now(), texto: nuevaTarea, fecha: nuevaFecha, cumplida: false }
      ]);
      setNuevaTarea("");
      setNuevaFecha("");
    }
  };

  const guardarEdicion = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, texto: editTexto, fecha: editFecha } : t
    ));
    setEditandoId(null);
    setEditTexto("");
    setEditFecha("");
  };

  const toggleCumplida = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, cumplida: !t.cumplida } : t
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  // Comunicados (solo admin/soporte)
  const puedeGestionarComunicados = usuarioActual.rol === "admin" || usuarioActual.rol === "soporte";

  const agregarComunicado = () => {
    if (nuevoComunicado.titulo && nuevoComunicado.mensaje && nuevoComunicado.duracion > 0) {
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
    }
  };

  const eliminarComunicado = (id) => {
    setComunicados(comunicados.filter(c => c.id !== id));
  };

  const iniciarEdicionCom = (com) => {
    setEditandoComId(com.id);
    setEditComunicado({ titulo: com.titulo, mensaje: com.mensaje });
  };

  const guardarEdicionCom = (id) => {
    setComunicados(comunicados.map(c =>
      c.id === id ? { ...c, ...editComunicado } : c
    ));
    setEditandoComId(null);
    setEditComunicado({ titulo: "", mensaje: "" });
  };

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
            {tareas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">Sin tareas</td>
              </tr>
            ) : tareas.map(t => (
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
                  <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{u.puntos} pts</span>
                </li>
              ))}
          </ol>
        )}
      </div>

      {/* Tablero de comunicados */}
      <div className="bg-white rounded shadow p-4 mt-6 md:mt-0 md:col-span-3">
        <h2 className="text-xl font-bold mb-4">📢 Comunicados</h2>
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
          {comunicados.length === 0 ? (
            <li className="text-gray-400 text-center">No hay comunicados.</li>
          ) : comunicados.map((c, idx) => (
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
