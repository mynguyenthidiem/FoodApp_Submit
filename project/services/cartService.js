import api from  '../api/client';

export const getCart = async () => {
  const response = await api.get('/cart');

  return response.data;
};

export const addToCart = async ({ foodId, quantity }) => {
  const response = await api.post('/cart', {
    foodId,
    quantity,
  });

  return response.data;
};

export const updateCart= async ({ id, quantity }) => {
  const response = await api.put(`/cart/${id}`, {
    quantity,
  });

  return response.data;
};

export const removeCart= async id => {
  const response = await api.delete(`/cart/${id}`);

  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart/clear');

  return response.data;
};
