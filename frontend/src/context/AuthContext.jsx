// // // // import { createContext, useContext, useState, useEffect } from "react";
// // // // import { authApi } from "../api/auth";

// // // // const AuthContext = createContext(null);

// // // // export function AuthProvider({ children }) {
// // // //   const [user, setUser] = useState(null);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const token = localStorage.getItem("token");
// // // //     if (token) {
// // // //       authApi
// // // //         .getMe()
// // // //         .then((res) => setUser(res.data.data))
// // // //         .catch(() => {
// // // //           localStorage.removeItem("token");
// // // //           setUser(null);
// // // //         })
// // // //         .finally(() => setLoading(false));
// // // //     } else {
// // // //       setLoading(false);
// // // //     }
// // // //   }, []);

// // // //   const loginWithToken = (token) => {
// // // //     localStorage.setItem("token", token);
// // // //     return authApi.getMe().then((res) => {
// // // //       setUser(res.data.data);
// // // //       return res.data.data;
// // // //     });
// // // //   };

// // // //   const loginWithCredentials = (email, password) =>
// // // //     authApi
// // // //       .login({ email, password })
// // // //       .then((res) => loginWithToken(res.data.data.token));

// // // //   const register = (email, name, password) =>
// // // //     authApi
// // // //       .register({ email, name, password })
// // // //       .then((res) => loginWithToken(res.data.data.token));

// // // //   const logout = () => {
// // // //     localStorage.removeItem("token");
// // // //     setUser(null);
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider
// // // //       value={{
// // // //         user,
// // // //         loading,
// // // //         loginWithToken,
// // // //         loginWithCredentials,
// // // //         register,
// // // //         logout,
// // // //       }}
// // // //     >
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // }

// // // // export const useAuth = () => {
// // // //   const ctx = useContext(AuthContext);
// // // //   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
// // // //   return ctx;
// // // // };

// // // //frontend/src/context/AuthContext.jsx
// // // import { createContext, useContext, useState, useEffect } from "react";
// // // import { authApi } from "../api/auth";

// // // const AuthContext = createContext(null);

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   // Helper to attach token
// // //   const setAuthHeader = (token) => {
// // //     authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// // //   };

// // //   useEffect(() => {
// // //     const token = localStorage.getItem("token");
// // //     if (token) {
// // //       setAuthHeader(token);
// // //       authApi
// // //         .getMe()
// // //         .then((res) => setUser(res.data.data))
// // //         .catch(() => {
// // //           localStorage.removeItem("token");
// // //           setUser(null);
// // //         })
// // //         .finally(() => setLoading(false));
// // //     } else {
// // //       setLoading(false);
// // //     }
// // //   }, []);

// // //   const loginWithToken = (token) => {
// // //     localStorage.setItem("token", token);
// // //     setAuthHeader(token);
// // //     return authApi.getMe().then((res) => {
// // //       setUser(res.data.data);
// // //       return res.data.data;
// // //     });
// // //   };

// // //   const loginWithCredentials = (email, password) =>
// // //     authApi
// // //       .login({ email, password })
// // //       .then((res) => loginWithToken(res.data.data.token));

// // //   const register = (email, name, password) =>
// // //     authApi
// // //       .register({ email, name, password })
// // //       .then((res) => loginWithToken(res.data.data.token));

// // //   const logout = () => {
// // //     localStorage.removeItem("token");
// // //     setUser(null);
// // //     delete authApi.defaults.headers.common["Authorization"];
// // //   };

// // //   return (
// // //     <AuthContext.Provider
// // //       value={{
// // //         user,
// // //         loading,
// // //         loginWithToken,
// // //         loginWithCredentials,
// // //         register,
// // //         logout,
// // //       }}
// // //     >
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // }

// // // export const useAuth = () => {
// // //   const ctx = useContext(AuthContext);
// // //   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
// // //   return ctx;
// // // };

// // // frontend/src/context/AuthContext.jsx
// // import { createContext, useContext, useState, useEffect } from "react";
// // import api from "../api/axios"; // Use your axios instance

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // Helper to attach token
// //   const setAuthHeader = (token) => {
// //     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //   };

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       setAuthHeader(token);
// //       api
// //         .get("/auth/me")
// //         .then((res) => setUser(res.data.data))
// //         .catch(() => {
// //           localStorage.removeItem("token");
// //           setUser(null);
// //         })
// //         .finally(() => setLoading(false));
// //     } else {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const loginWithToken = (token) => {
// //     localStorage.setItem("token", token);
// //     setAuthHeader(token);
// //     return api.get("/auth/me").then((res) => {
// //       setUser(res.data.data);
// //       return res.data.data;
// //     });
// //   };

// //   const loginWithCredentials = (email, password) =>
// //     api
// //       .post("/auth/login", { email, password })
// //       .then((res) => loginWithToken(res.data.data.token));

// //   const register = (email, name, password) =>
// //     api
// //       .post("/auth/register", { email, name, password })
// //       .then((res) => loginWithToken(res.data.data.token));

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setUser(null);
// //     delete api.defaults.headers.common["Authorization"];
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         loading,
// //         loginWithToken,
// //         loginWithCredentials,
// //         register,
// //         logout,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => {
// //   const ctx = useContext(AuthContext);
// //   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
// //   return ctx;
// // };


// //frontend/src/context/AuthContext.jsx
// // frontend/src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import api from "../api/axios"; // your axios instance

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const setAuthHeader = (token) => {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setAuthHeader(token);
//       api
//         .get("/auth/me")
//         .then((res) => setUser(res.data.data))
//         .catch(() => {
//           localStorage.removeItem("token");
//           setUser(null);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const loginWithToken = (token) => {
//     localStorage.setItem("token", token);
//     setAuthHeader(token);
//     return api.get("/auth/me").then((res) => {
//       setUser(res.data.data);
//       return res.data.data;
//     });
//   };

//   const loginWithCredentials = (email, password) =>
//     api
//       .post("/auth/login", { email, password })
//       .then((res) => loginWithToken(res.data.data.token));

//   const loginWithGoogle = (googleToken) =>
//     api
//       .post("/auth/google", { token: googleToken }) // backend endpoint to exchange Google token for app JWT
//       .then((res) => loginWithToken(res.data.data.token));

//   const register = (email, name, password) =>
//     api
//       .post("/auth/register", { email, name, password })
//       .then((res) => loginWithToken(res.data.data.token));

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     delete api.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         loginWithToken,
//         loginWithCredentials,
//         loginWithGoogle,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

//frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthHeader(token);
      api
        .get("/auth/me")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
      loginWithToken(res.data.data.token)
    );

  const loginWithGoogle = (googleToken) =>
    api.post("/auth/google", { token: googleToken }).then((res) =>
      loginWithToken(res.data.data.token)
    );

  const register = (email, name, password) =>
    api.post("/auth/register", { email, name, password }).then((res) =>
      loginWithToken(res.data.data.token)
    );

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithToken,
        loginWithCredentials,
        loginWithGoogle,
        register,
        logout,
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