// src/components/Cuenta/EditarCuentas.jsx
import React, { useState } from "react";
import axios from "axios";

export default function editarCuentas() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    fechaNacimiento: "",
    cedula: "",
    foto: null,

  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      // Ajusta esta URL según tu backend
      const token = localStorage.getItem("token"); // si usas JWT
      await axios.put(
        "https://TU-BACKEND/api/usuarios/editar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje("Cuenta actualizada correctamente");
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la cuenta");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Editar Cuenta</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full px-4 py-2 rounded border"
          required
        />
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full px-4 py-2 rounded border"
          required
        />

         <input
          type="cell"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="Celular"
          className="w-full px-4 py-2 rounded border"
          required
        />
        <input
          type="id"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="Cedula"
          className="w-full px-4 py-2 rounded border"
          required
        />
        
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          placeholder="Fecha de nacimiento"
          className="w-full px-4 py-2 rounded border"
          required
        />

        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border"
        />

        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar cambios
        </button>
      </form>

      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
