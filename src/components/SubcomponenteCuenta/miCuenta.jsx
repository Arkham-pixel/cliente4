// src/components/SubcomponenteCuenta/miCuenta.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil, actualizarFoto } from "../../services/userService";

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
  const [fotoPreview, setFotoPreview] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMsg("");
    if (!oldPassword || !newPassword || !verifyPassword) {
      setPasswordError("Todos los campos son obligatorios.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }
    if (newPassword !== verifyPassword) {
      setPasswordError("La nueva contraseña y la verificación no coinciden.");
      return;
    }
    setLoading(true);
    try {
      // Aquí deberías hacer la llamada real al backend para cambiar la contraseña
      // await axios.post('/api/usuarios/cambiar-password', { oldPassword, newPassword });
      setSuccessMsg("Contraseña cambiada correctamente (simulado)");
      setOldPassword("");
      setNewPassword("");
      setVerifyPassword("");
    } catch (err) {
      setPasswordError("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const tipoUsuario = localStorage.getItem("tipoUsuario") || "normal";
    obtenerPerfil(token, tipoUsuario)
      .then(({ data }) => {
        setUsuario(data);
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Muestra preview mientras sube
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Sube la imagen al servidor
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("foto", file);

    try {
      const { data } = await actualizarFoto(formData, token);
      // data.fotoPerfil es la URL relativa guardada en Mongo
      setUsuario(u => ({ ...u, foto: data.fotoPerfil }));
      setFotoPreview("");
    } catch (err) {
      console.error("Error subiendo foto:", err);
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
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={
              fotoPreview
                ? fotoPreview
                : usuario.foto
                ? `https://aplicacion.grupoproser.com.co${usuario.foto}`
                : "/img/placeholder.png"
            }
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
        {usuario.nombre || usuario.name ? (
          <div>
            <span className="font-semibold">Nombre: </span>
            {usuario.nombre || usuario.name}
          </div>
        ) : null}
        {usuario.apellido ? (
          <div>
            <span className="font-semibold">Apellido: </span>
            {usuario.apellido}
          </div>
        ) : null}
        {usuario.fechaNacimiento ? (
          <div>
            <span className="font-semibold">Fecha de nacimiento: </span>
            {usuario.fechaNacimiento}
          </div>
        ) : null}
        {usuario.cedula ? (
          <div>
            <span className="font-semibold">Cédula: </span>
            {usuario.cedula}
          </div>
        ) : null}
        {usuario.phone ? (
          <div>
            <span className="font-semibold">Celular: </span>
            {usuario.phone}
          </div>
        ) : null}
        {usuario.role ? (
          <div>
            <span className="font-semibold">Rol: </span>
            {usuario.role}
          </div>
        ) : null}
        {usuario.email ? (
          <div>
            <span className="font-semibold">Email: </span>
            {usuario.email}
          </div>
        ) : null}
      </div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-lg font-bold mb-4">Cambiar contraseña</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-medium">Contraseña antigua</label>
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Verifica tu nueva contraseña</label>
            <input
              type="password"
              value={verifyPassword}
              onChange={e => setVerifyPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          {successMsg && <p className="text-green-600 text-sm mt-1">{successMsg}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
