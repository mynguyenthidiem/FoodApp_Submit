import api from '../api/client';

export const createPayment = async ({ orderId, method }) => {
  const response = await api.post('/payments', {
    orderId: Number(orderId),
    method,
  });

  return response.data;
};

export const getPaymentByOrder = async orderId => {
  const response = await api.get(`/payments/order/${Number(orderId)}`);

  return response.data;
};

export const completePayment = async (orderId, transactionId = null) => {
  const response = await api.put(`/payments/${Number(orderId)}/complete`, {
    transactionId,
  });

  return response.data;
};

export const failPayment = async orderId => {
  const response = await api.put(`/payments/${Number(orderId)}/fail`);

  return response.data;
};
