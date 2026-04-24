import api from './axios'

export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  reject: (id) => api.patch(`/bookings/${id}/reject`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
}
