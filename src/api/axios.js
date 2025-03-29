// frontend/src/api/axios.js
import axios from 'axios';
import { getCookie } from '../utils/cookies';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5050/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = null; //;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;