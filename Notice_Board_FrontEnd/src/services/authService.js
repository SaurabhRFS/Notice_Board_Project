// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Service 1: Local Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
      email, 
      password 
    });
    return response.data; // Returns { token, role }
  } catch (error) {
    // We throw the error so the UI knows something went wrong
    throw error;
  }
};

// Service 2: Google Login (The Handshake)
export const googleLoginUser = async (idToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { 
      token: idToken 
    });
    return response.data; // Returns { token, role }
  } catch (error) {
    throw error;
  }
};