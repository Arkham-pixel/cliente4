import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/userService';
//import proserLogo from '../img/PROSER_FIRMA_BLANCA_V2 (3).gif';
import { useDriveToken } from '../../userDriveToken';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoggedIn, setLocalLoggedIn] = useState(false);
  const { accessToken, requestAccess } = useDriveToken();
  const navigate = useNavigate();

  // Redirige solo cuando se completa login local y Google
  useEffect(() => {
    if (localLoggedIn ) {
      navigate('/inicio');
    }
  }, [localLoggedIn, accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUsuario({ correo, password });
      localStorage.setItem('token', res.data.access_token);
      setLocalLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
      {/* Logo */}
      <img
      //  src={proserLogo}
        alt="Logo PROSER"
        className="absolute top-6 left-6 h-20 w-auto object-contain"
        style={{ zIndex: 10 }}
      />

      <div className="w-full max-w-md bg-white text-gray-800 p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-2 tracking-wide">APLICATIVO GRUPO PROSER</h1>
        <h2 className="text-lg font-semibold text-center mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-medium transition-colors"
            >
              Entrar con usuario y contraseña
            </button>

            {/* Botón Google Sign-in */}
            <button
              type="button"
              onClick={requestAccess}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-medium transition-colors flex items-center justify-center"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" className="h-5 w-5 mr-2" />
              Iniciar sesión con Google
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="mt-4 text-sm text-center">
          <a href="/register" className="text-blue-600 hover:underline">Registrarse</a>
          <span className="text-gray-400 mx-2">|</span>
          <a href="/reset-password" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
