import api from './axios'

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  getMyNotifications: () => api.get('/notifications'),  
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
}

// Optional helper
export const unwrapApiData = (res, fallback = null) => {
  return res?.data?.data ?? fallback;
};