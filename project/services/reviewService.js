import api from '../api/client';

export const getReviewById = async id => {
  const response = await api.get(`/Review/${id}`);

  return response.data;
};

export const getFoodReviews = async (foodId, pageNumber = 1, pageSize = 20) => {
  const response = await api.get(`/Review/food/${foodId}`, {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

export const createReview = async data => {
  const response = await api.post('/Review', data);

  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await api.put(`/Review/${id}`, data);

  return response.data;
};

export const deleteReview = async id => {
  const response = await api.delete(`/Review/${id}`);

  return response.data;
};
