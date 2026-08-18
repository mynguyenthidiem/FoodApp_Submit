import api from "./client";

export const getOrders = () =>
  api.get("/orders");

export const getOrderById = (id) =>
  api.get(`/orders/${id}`);

export const createOrder = (data) =>
  api.post("/orders", data);

export const updateOrder = (id, data) =>
  api.put(`/orders/${id}`, data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`);

export const updateOrderStatus = (id, data) =>
  api.put(`/orders/${id}/status`, data);

export const getRestaurantOrders = () =>
  api.get("/orders/restaurant");

export const getAllOrders = () =>
  api.get("/orders/all");