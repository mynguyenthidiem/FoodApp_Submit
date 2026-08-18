import api from "./client";

export const completePayment = (orderId) =>
  api.put(`/payments/${orderId}/complete`);