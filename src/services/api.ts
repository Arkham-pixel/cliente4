import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Ajusta si tu backend corre en otra URL o puerto
});

export default api;
