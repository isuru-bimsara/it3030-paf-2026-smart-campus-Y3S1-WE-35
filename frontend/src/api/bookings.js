import api from './axios'

export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  reject: (id, reason) => api.patch(`/bookings/${id}/reject`, { reason }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getByResourceAndDate: (resourceId, date) => api.get(`/bookings/resource/${resourceId}/date/${date}`),
}
