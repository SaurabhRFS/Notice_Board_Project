import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// 1. Create a custom Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR (The "Gatekeeper")
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR (The "ErrorHandler")
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says "401 Unauthorized" or "403 Forbidden"
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // FIX: Use 'globalThis' instead of 'window'
      if (globalThis.location.pathname !== '/login') {
        console.warn('Session expired. Redirecting to login...');
        localStorage.clear(); // Clear bad token
        globalThis.location.href = '/login'; // Force redirect
      }
    }
    return Promise.reject(error);
  }
);

export default api;