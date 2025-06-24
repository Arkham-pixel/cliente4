import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tu-backend-874854648927.us-central1.run.app/api', // Ajusta si tu backend corre en otra URL o puerto
});

export default api;
