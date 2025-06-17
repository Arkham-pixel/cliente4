import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      await axios.post("http://localhost:3000/auth/reset-password", { correo });
      setMensaje("Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.");
    } catch (err) {
      setMensaje("Hubo un error. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h1>

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="input"
          required
        />

        {mensaje && <p className="text-sm text-center mt-2 text-blue-300">{mensaje}</p>}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4 mb-2">
          Enviar instrucciones
        </button>

        <button type="button" onClick={() => navigate("/login")} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded">
          Volver
        </button>
      </form>
    </div>
  );
}
