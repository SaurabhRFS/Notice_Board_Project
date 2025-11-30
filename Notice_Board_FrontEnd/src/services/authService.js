// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Service 1: Local Login
export const loginUser = async (email, password) => {       // Takes 2 parameters and send to backend simple 
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
    email, password 
  });
  return response.data;
};
// Service 2: Google Login (The Handshake)
export const googleLoginUser = async (idToken) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { token: idToken });
  return response.data;
};