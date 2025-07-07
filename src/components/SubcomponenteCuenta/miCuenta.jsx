import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil } from "../../services/userService";  // ruta corregida

const estados = {
  Conectado: "bg-green-500 text-white",
  Desconectado: "bg-gray-400 text-white",
  "En reposo": "bg-yellow-400 text-black",
  "No molestar": "bg-red-500 text-white",
};
const opcionesEstado = Object.keys(estados);

export default function MiCuenta() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("Conectado");
  const [foto, setFoto] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si no hay token, vamos al login
      navigate("/login");
      return;
    }

    // Llamamos a la API para traer el perfil
    obtenerPerfil(token)
      .then(({ data }) => {
        setUsuario(data);     // asumo que el endpoint devuelve directamente el objeto usuario
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        // si el token está expirado o inválido, forzar login
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-16">
        <p>Cargando perfil…</p>
      </div>
    );
  }

  if (!usuario) {
    return null; // ya redirigimos al login
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={foto || usuario.fotoPerfil || "/img/placeholder.png"}
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
            title="Cambiar foto"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFotoChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {usuario.nombre} {usuario.apellido}
          </h2>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold outline-none ${estados[estado]}`}
          >
            {opcionesEstado.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-semibold">Fecha de nacimiento: </span>
          {usuario.fechaNacimiento}
        </div>
        <div>
          <span className="font-semibold">Cédula: </span>
          {usuario.cedula}
        </div>
        <div>
          <span className="font-semibold">Celular: </span>
          {usuario.celular}
        </div>
      </div>
    </div>
  );
}
