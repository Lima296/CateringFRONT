import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor para incluir el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: any) => API.post('auth/login/', credentials),
  register: (data: any) => API.post('usuarios/', data),
};

export const ingredientesAPI = {
  getAll: () => API.get('ingredientes/'),
  create: (data: any) => API.post('ingredientes/', data),
  update: (id: string, data: any) => API.put(`ingredientes/${id}/`, data),
  delete: (id: string) => API.delete(`ingredientes/${id}/`),
};

export const recetasAPI = {
  getAll: () => API.get('recetas/'),
  create: (data: any) => API.post('recetas/', data),
  getOne: (id: string) => API.get(`recetas/${id}/`),
  update: (id: string, data: any) => API.put(`recetas/${id}/`, data),
  delete: (id: string) => API.delete(`recetas/${id}/`),
};

export const ventasAPI = {
  getAll: () => API.get('ventas/'),
  create: (data: any) => API.post('ventas/', data),
  getResumen: () => API.get('ventas/resumen_financiero/'),
};

export default API;
