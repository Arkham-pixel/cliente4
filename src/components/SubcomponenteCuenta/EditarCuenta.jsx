// src/components/Cuenta/EditarCuentas.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerPerfil, actualizarPerfil } from "../../services/userService";

export default function EditarCuentas() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    // ...otros campos
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario") || "normal";
    obtenerPerfil(token, tipoUsuario).then(({ data }) => {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        // ...otros campos
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario") || "normal";
    await actualizarPerfil(form, token, tipoUsuario);
    alert("¡Perfil actualizado!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Correo" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Celular" />
      <input name="role" value={form.role} onChange={handleChange} placeholder="Rol" />
      {/* ...otros campos */}
      <button type="submit">Guardar cambios</button>
    </form>
  );
}
