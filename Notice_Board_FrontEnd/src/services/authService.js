import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', { 
    email, password 
  });
  return response.data;
};

export const googleLoginUser = async (idToken) => {
  const response = await api.post('/api/auth/google', { token: idToken });
  return response.data;
};