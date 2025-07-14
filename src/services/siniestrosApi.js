const API_URL = "http://13.59.106.174:3000/api/siniestros";

export const getSiniestros = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${query}`);
  if (!res.ok) throw new Error("Error al obtener siniestros");
  return res.json();
};

export const getSiniestrosConResponsables = async (params = {}) => {
  // Agregar timestamp para evitar cache
  const paramsWithTimestamp = { ...params, _t: Date.now() };
  const query = new URLSearchParams(paramsWithTimestamp).toString();
  const res = await fetch(`${API_URL}/con-responsables?${query}`);
  if (!res.ok) throw new Error("Error al obtener siniestros con responsables");
  return res.json();
};

export const getSiniestroById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("No encontrado");
  return res.json();
};

export const createSiniestro = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear siniestro");
  return res.json();
};

export const updateSiniestro = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar siniestro");
  return res.json();
};

export const deleteSiniestro = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar siniestro");
  return res.json();
}; 