import api from '../api/client';

export const getFavoriteFoods = async (pageNumber = 1, pageSize = 20) => {
  const response = await api.get('/favorites/foods', {
    params: { pageNumber, pageSize },
  });

  return response.data;
};

export const getFoodFavoriteStatus = async foodId => {
  const response = await api.get(`/favorites/foods/${foodId}/status`);

  return response.data;
};

export const addFavoriteFood = async foodId => {
  const response = await api.post(`/favorites/foods/${foodId}`);

  return response.data;
};

export const removeFavoriteFood = async foodId => {
  const response = await api.delete(`/favorites/foods/${foodId}`);

  return response.data;
};

export const getFavoriteRestaurants = async (pageNumber = 1, pageSize = 20) => {
  const response = await api.get('/favorites/restaurants', {
    params: { pageNumber, pageSize },
  });

  return response.data;
};

export const getRestaurantFavoriteStatus = async restaurantId => {
  const response = await api.get(`/favorites/restaurants/${restaurantId}/status`);

  return response.data;
};

export const addFavoriteRestaurant = async restaurantId => {
  const response = await api.post(`/favorites/restaurants/${restaurantId}`);

  return response.data;
};

export const removeFavoriteRestaurant = async restaurantId => {
  const response = await api.delete(`/favorites/restaurants/${restaurantId}`);

  return response.data;
};