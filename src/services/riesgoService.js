export async function obtenerCasosRiesgo() {
  // Devuelve datos simulados para pruebas
  return [
    {
      id: 1,
      estado: "PENDIENTE",
      aseguradora: "Seguros ABC",
      fecha_creacion: "2024-06-01",
      fecha_cierre: "2024-06-10",
      responsable: "Juan Pérez",
      numero_siniestro: "R-001"
    },
    // ...agrega más objetos si quieres
  ];
}

export async function deleteCasoRiesgo(id) {
  // Aquí va tu lógica real, por ejemplo usando fetch o axios:
  // return fetch(`/api/riesgos/${id}`, { method: 'DELETE' });

  // Para pruebas, solo simula:
  return Promise.resolve({ success: true });
}

