// // frontend/src/api/resources.js
// import api from './axios'

// export const resourcesApi = {
//   getAll: (params) => api.get('/resources', { params }),
//   getById: (id) => api.get(`/resources/${id}`),
//   create: (data) => api.post('/resources', data),
//   update: (id, data) => api.put(`/resources/${id}`, data),
//   delete: (id) => api.delete(`/resources/${id}`),
// }


import api from './axios'

export const resourcesApi = {
  getAll: (params) => api.get('/resources', { params }),
  getAvailable: () => api.get('/resources/available'), // ✅ ADD THIS
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
}