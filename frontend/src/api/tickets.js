

// import api from "./axios";

// export const ticketsApi = {
//   create: (formData) =>
//     api.post("/tickets", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }),

//   getAll: () => api.get("/tickets"),
//   getMyTickets: () => api.get("/tickets/my"),
//   getById: (id) => api.get(`/tickets/${id}`),

//   updateStatus: (id, status) =>
//     api.patch(`/tickets/${id}/status`, null, { params: { status } }),

//   takeResponsibility: (id) => api.post(`/tickets/${id}/take`),
//   reject: (id, reason) => api.post(`/tickets/${id}/reject`, null, { params: { reason } }),
//   resolve: (id, explanation, internalNotes) =>
//     api.post(`/tickets/${id}/resolve`, null, { params: { explanation, internalNotes } }),

//   getComments: (id) => api.get(`/tickets/${id}/comments`),
//   addComment: (id, content) => api.post(`/tickets/${id}/comments`, { content }),
//   updateComment: (commentId, content) => api.put(`/tickets/comments/${commentId}`, { content }),
//   deleteComment: (commentId) => api.delete(`/tickets/comments/${commentId}`),

//   getByCategory: (category) => api.get(`/tickets/category/${category}`),
//   deleteTicket: (id) => api.delete(`/tickets/${id}`),
// };

import api from "./axios";

export const ticketsApi = {
  create: (formData) =>
    api.post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: () => api.get("/tickets"),
  getMyTickets: () => api.get("/tickets/my"),
  getById: (id) => api.get(`/tickets/${id}`),

  takeResponsibility: (id) => api.post(`/tickets/${id}/take`),

  updateStatus: (id, status) =>
    api.patch(`/tickets/${id}/status`, null, { params: { status } }),

  resolve: (id, explanation, internalNotes) =>
    api.post(`/tickets/${id}/resolve`, null, {
      params: { explanation, internalNotes },
    }),

  reject: (id, reason) =>
    api.post(`/tickets/${id}/reject`, null, { params: { reason } }),

  markResolutionViewed: (id) => api.post(`/tickets/${id}/resolution/view`),
  acknowledgeResolution: (id) =>
    api.post(`/tickets/${id}/resolution/ack`, { acknowledged: true }),

  getComments: (id) => api.get(`/tickets/${id}/comments`),
  addComment: (id, content) => api.post(`/tickets/${id}/comments`, { content }),
  updateComment: (commentId, content) =>
    api.put(`/tickets/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/tickets/comments/${commentId}`),

  deleteTicket: (id) => api.delete(`/tickets/${id}`),
  getByCategory: (category) => api.get(`/tickets/category/${category}`),
};