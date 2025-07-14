import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSecurUser } from '../services/securUserService';

export default function Login() {
  const [tipo, setTipo] = useState('normal'); // 'normal' o 'secur'
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [pswd, setPswd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (tipo === 'normal') {
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
        localStorage.setItem('tipoUsuario', 'normal');
      } else {
        const data = await loginSecurUser({ login, pswd });
        if (!data.token) {
          setError('Credenciales incorrectas');
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('tipoUsuario', 'secur');
      }
      navigate('/inicio');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
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
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 border"
          >
            <option value="normal">Usuario normal</option>
            <option value="secur">Usuario secundario</option>
          </select>
          {tipo === 'normal' ? (
            <>
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 border"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 border"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 border"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={pswd}
                onChange={e => setPswd(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 border"
                required
              />
            </>
          )}
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