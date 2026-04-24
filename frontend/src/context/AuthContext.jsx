import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const clearAuthState = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setAuthHeader(token);
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        clearAuthState();
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithToken = (token) => {
    localStorage.setItem("token", token);
    setAuthHeader(token);

    return api.get("/auth/me").then((res) => {
      setUser(res.data.data);
      return res.data.data;
    });
  };

  const loginWithCredentials = (email, password) =>
    api.post("/auth/login", { email, password }).then((res) =>
      loginWithToken(res.data.data.token),
    );

  const loginWithGoogle = (googleToken) =>
    api.post("/auth/google", { token: googleToken }).then((res) =>
      loginWithToken(res.data.data.token),
    );

  const register = (email, name, password) =>
    api.post("/auth/register", { email, name, password }).then((res) =>
      loginWithToken(res.data.data.token),
    );

  const logout = () => {
    clearAuthState();
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
  };

  const hasToken = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasToken,
        isAuthenticated: Boolean(user && hasToken),
        loginWithToken,
        loginWithCredentials,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
