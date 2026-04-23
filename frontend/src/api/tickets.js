// frontend/src/api/tickets.js
import api from "./axios";

export const ticketsApi = {
  create: (formData) =>
    api.post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: () => api.get("/tickets"),
  getMyTickets: () => api.get("/tickets/my"),
  getById: (id) => api.get(`/tickets/${id}`),
  updateStatus: (id, status) =>
    api.patch(`/tickets/${id}/status`, null, { params: { status } }),
  assign: (id, technicianId) =>
    api.patch(`/tickets/${id}/assign`, null, { params: { technicianId } }),
  getComments: (id) => api.get(`/tickets/${id}/comments`),
  addComment: (id, content) => api.post(`/tickets/${id}/comments`, { content }),
  getByCategory: (category) => api.get(`/tickets/category/${category}`),
};
