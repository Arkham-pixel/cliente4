import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Llamada directa con URL absoluta para evitar redirecciones incorrectas
      const res = await axios.post(
        'http://13.59.106.174:3000/api/auth/login',
        { correo, password }
      );

      const jwt = res.data.token;
      if (!jwt) {
        setError('Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', jwt);
      navigate('/inicio');
    } catch (err) {
      console.error('Error en login:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al iniciar sesión';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">
          APLICATIVO GRUPO PROSER
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />


          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
            >
              Entrar con usuario y contraseña
            </button>

          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
          >
            Entrar
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
        <div className="mt-4 text-sm text-center">
          <a href="/register" className="text-blue-600 hover:underline">
            Registrarse
          </a>
          <span className="mx-2 text-gray-400">|</span>
          <a href="/reset-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}