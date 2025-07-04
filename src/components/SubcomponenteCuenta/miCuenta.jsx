import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Simula que no hay usuario al inicio
const usuarioInicial = null;

const estados = {
  "Conectado": "bg-green-500 text-white",
  "Desconectado": "bg-gray-400 text-white",
  "En reposo": "bg-yellow-400 text-black",
  "No molestar": "bg-red-500 text-white",
};

const opcionesEstado = Object.keys(estados);

const MiCuenta = () => {
  const [usuario] = useState(usuarioInicial);
  const [estado, setEstado] = useState("Conectado");
  const [foto, setFoto] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Si no hay usuario, pide iniciar sesión
  if (!usuario) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8 text-center">
        <p className="mb-4 text-gray-600">Debes iniciar sesión para ver tu perfil.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={foto || "https://via.placeholder.com/80x80?text=Foto"}
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
          <h2 className="text-2xl font-bold">{usuario.nombre} {usuario.apellido}</h2>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold outline-none ${estados[estado]}`}
          >
            {opcionesEstado.map(op => (
              <option key={op} value={op}>{op}</option>
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
};

export default MiCuenta;