import api from '../api/client';

export const getFoods = async (
  pageNumber = 1,
  pageSize = 20
) => {
  const response = await api.get("/Foods", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`/Foods/${id}`);

  return response.data;
};

export const getFoodsByCategory = async (
  categoryId,
  pageNumber = 1,
  pageSize = 20
) => {
  const response = await api.get(
    `/Foods/category/${categoryId}`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    }
  );

  return response.data;
};

export const searchFoods = async (
  keyword,
  pageNumber = 1,
  pageSize = 20
) => {
  const response = await api.get(
    "/Foods/search",
    {
      params: {
        keyword,
        pageNumber,
        pageSize,
      },
    }
  );

  return response.data;
};