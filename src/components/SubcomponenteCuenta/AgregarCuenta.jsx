import React, { useState } from "react";
import axios from "axios";

export default function AgregarCuenta() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    fechaNacimiento: "",
    cedula: "",
    foto: null,
    rol: "usuario",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      await axios.post("https://TU-BACKEND/api/usuarios/crear", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje("Usuario creado exitosamente");
      setFormData({
        nombre: "",
        correo: "",
        celular: "",
        fechaNacimiento: "",
        cedula: "",
        foto: null,
        rol: "usuario",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el usuario");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Agregar Cuenta</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        {mensaje && <p className="text-green-600">{mensaje}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label htmlFor="nombre" className="block text-sm font-medium">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
            required
          />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
            required
          />
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-medium">Celular</label>
          <input
            id="celular"
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
            required
          />
        </div>

        <div>
          <label htmlFor="cedula" className="block text-sm font-medium">Cédula</label>
          <input
            id="cedula"
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
            required
          />
        </div>

        <div>
          <label htmlFor="fechaNacimiento" className="block text-sm font-medium">Fecha de nacimiento</label>
          <input
            id="fechaNacimiento"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
            required
          />
        </div>

        <div>
          <label htmlFor="rol" className="block text-sm font-medium">Rol del usuario</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
          >
            <option value="usuario">Usuario</option>
            <option value="soporte">Soporte</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div>
          <label htmlFor="foto" className="block text-sm font-medium">Foto de perfil</label>
          <input
            id="foto"
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
