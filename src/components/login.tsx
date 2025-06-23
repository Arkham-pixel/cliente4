import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/userService';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUsuario({ correo, contrasena });
      localStorage.setItem('token', res.data.access_token);
      navigate('/inicio'); // ✅ Redirige a tu dashboard o inicio
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Demo Plataforma</h1>
        <h2 className="text-xl font-semibold text-center mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
          >
            Entrar
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        <div className="mt-4 text-sm text-center">
          <a href="/register" className="text-blue-400 hover:underline">Registrarse</a> <span className="text-gray-400">|</span>{' '}
          <a href="/reset-password" className="text-blue-400 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
