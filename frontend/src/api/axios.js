import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

let authRedirectInProgress = false;

function isPublicEndpoint(config = {}) {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";

  return (
    method === "post" &&
    (url === "/auth/login" || url === "/auth/register")
  );
}

function clearAuthState() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common.Authorization;
}

function redirectToLogin(message) {
  if (typeof window === "undefined" || authRedirectInProgress) return;

  const currentPath = window.location.pathname;
  if (currentPath === "/login" || currentPath === "/auth/callback") return;

  authRedirectInProgress = true;
  clearAuthState();

  if (message) {
    sessionStorage.setItem("authRedirectMessage", message);
  }
  sessionStorage.setItem(
    "postLoginRedirect",
    currentPath + window.location.search,
  );

  window.location.href = "/login";
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    if (!isPublicEndpoint(config)) {
      redirectToLogin("Your session expired. Please sign in again.");
      return Promise.reject(new Error("Authentication required"));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;
    const protectedCall = !isPublicEndpoint(error?.config);

    if (code === "USER_BANNED") {
      clearAuthState();
      if (message) localStorage.setItem("bannedReason", message);
      if (window.location.pathname !== "/banned") {
        window.location.href = "/banned";
      }
      return Promise.reject(error);
    }

    if (status === 401 && protectedCall) {
      redirectToLogin("Your session expired. Please sign in again.");
    }

    return Promise.reject(error);
  },
);

export default api;
