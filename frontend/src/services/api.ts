// src/services/api.ts
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Change to production URL later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // I prefer 'token' over 'jwt' — your choice
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: global error handling (shows better messages)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    // You can add toast/notification here later
    return Promise.reject(error);
  }
);

export default api;