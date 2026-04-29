// frontend/src/api/ops.js
import api from "./axios";

export const opsApi = {
  getStats: () => api.get("/operation-manager/stats"),
};
