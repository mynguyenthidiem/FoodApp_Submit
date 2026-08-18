import api from "../api/client";

export const getOrders = async (
  pageNumber = 1,
  pageSize = 20
) => {
  const response = await api.get("/orders", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

export const createOrder = async ({
  shippingAddress,
  paymentMethod,
  cartIds,
}) => {
  const response = await api.post("/orders", {
    shippingAddress,
    paymentMethod,
    cartIds,
  });

  return response.data;
};

export const updateOrder = async ({
  id,
  shippingAddress,
  paymentMethod,
}) => {
  const response = await api.put(`/orders/${id}`, {
    shippingAddress,
    paymentMethod,
  });

  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);

  return response.data;
};