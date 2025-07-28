// src/services/estadosService.js
export async function getEstados() {
  const res = await fetch('https://api.grupoproser.com.co/api/estados');
  if (!res.ok) throw new Error('Error al obtener estados');
  return res.json();
} 