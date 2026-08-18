import api from '../api/client';

export const login = async ({ email, password }) => {
  const response = await api.post('/Auth/login', {
    email,
    password,
  });

  return response.data;
};

export const register = async data => {
  const response = await api.post('/Auth/register', data);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/Auth/profile');

  return response.data;
};

export const googleLogin = async ({ idToken }) => {
  const response = await api.post('/Auth/google', {
    idToken,
  });

  return response.data;
};

export const changePassword = async data => {
  const response = await api.put('/Auth/change-password', data);

  return response.data;
};