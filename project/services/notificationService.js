import api from '../api/client';

export const getNotifications = async (pageNumber = 1, pageSize = 20) => {
  const response = await api.get('/notifications', {
    params: {
      pageNumber,
      pageSize,
    },
  });

  console.log('NOTIFICATION API:', response.data);

  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markNotificationAsRead = async id => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};