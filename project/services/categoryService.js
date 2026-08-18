import api from '../api/client';

export const getSystemCategories = async () => {
  const response = await api.get('/SystemCategories');

  return response.data;
};

export const getSystemCategoryById = async id => {
  const response = await api.get(`/SystemCategories/${id}`);

  return response.data;
};
export const searchSystemCategories = async keyword => {
  const response = await api.get('/SystemCategories/search', {
    params: { keyword },
  });
  return response.data;
};
export const createSystemCategory = async data => {
  const response = await api.post('/SystemCategories', data);

  return response.data;
};

export const updateSystemCategory = async (id, data) => {
  const response = await api.put(`/SystemCategories/${id}`, data);

  return response.data;
};

export const deleteSystemCategory = async id => {
  const response = await api.delete(`/SystemCategories/${id}`);

  return response.data;
};
