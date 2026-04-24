

// // //frontend/src/pages/LoginPage.jsx
// // import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import { authApi } from "../api/auth";

// // export default function LoginPage() {
// //   const { loginWithCredentials } = useAuth();
// //   const navigate = useNavigate();
// //   const [form, setForm] = useState({ email: "", password: "" });
// //   const [error, setError] = useState(null);
// //   const [submitting, setSubmitting] = useState(false);

// //   const handleChange = (e) =>
// //     setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setError(null);
// //     try {
// //       const user = await loginWithCredentials(form.email, form.password);
// //       // Role-based redirect
// //       switch (user.role.toLowerCase()) {
// //         case "admin":
// //           navigate("/admin/dashboard");
// //           break;
// //         case "user":
// //           navigate("/user/dashboard");
// //           break;
// //         case "technician":
// //           navigate("/tech/dashboard");
// //           break;
// //         default:
// //           navigate("/login");
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Invalid credentials");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
// //       <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
// //         <div className="text-center space-y-2">
// //           <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
// //           <p className="text-sm text-gray-500">
// //             Sign in with email/password or Google.
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
// //             {error}
// //           </div>
// //         )}

// //         <form className="space-y-4" onSubmit={handleSubmit}>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">
// //               Email
// //             </label>
// //             <input
// //               type="email"
// //               name="email"
// //               required
// //               value={form.email}
// //               onChange={handleChange}
// //               className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //               placeholder="you@example.com"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               name="password"
// //               required
// //               value={form.password}
// //               onChange={handleChange}
// //               className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //               placeholder="••••••••"
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             disabled={submitting}
// //             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
// //           >
// //             {submitting ? "Signing in…" : "Sign in"}
// //           </button>
// //         </form>

// //         <button
// //           onClick={authApi.loginWithGoogle}
// //           className="w-full border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-2.5 rounded-lg transition"
// //         >
// //           Continue with Google
// //         </button>

// //         <div className="text-sm text-center text-gray-600">
// //           New here?{" "}
// //           <Link to="/register" className="text-blue-600 hover:underline">
// //             Create an account
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// //frontend/src/pages/LoginPage.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { authApi } from "../api/auth";
// import { 
//   Mail, 
//   Lock, 
//   ArrowRight, 
//   Loader2, 
//   ShieldCheck, 
//   AlertCircle 
// } from "lucide-react";

// export default function LoginPage() {
//   const { loginWithCredentials } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     try {
//       const user = await loginWithCredentials(form.email, form.password);
//       switch (user.role.toLowerCase()) {
//         case "admin": navigate("/admin/dashboard"); break;
//         case "user": navigate("/user/dashboard"); break;
//         case "technician": navigate("/tech/dashboard"); break;
//         default: navigate("/login");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-white font-sans text-slate-900">
//       {/* LEFT SIDE: Visual/Branding Panel (Hidden on mobile) */}
//       <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
//         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
//         <div className="z-10 max-w-lg text-center">
//           <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl mb-6 border border-white/20">
//             <ShieldCheck className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
//             Secure Resource Management
//           </h2>
//           <p className="text-indigo-100 text-lg font-medium leading-relaxed">
//             Everything you need to manage support tickets, maintenance requests, and team assets in one unified workspace.
//           </p>
//           <div className="mt-12 grid grid-cols-2 gap-4 text-left">
//             {['Real-time Tracking', 'Instant Support', 'Team Analytics', 'Mobile Ready'].map((feat) => (
//                <div key={feat} className="flex items-center gap-2 text-indigo-200 text-sm font-semibold">
//                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" /> {feat}
//                </div>
//             ))}
//           </div>
//         </div>
//         {/* Decorative Circles */}
//         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
//       </div>

//       {/* RIGHT SIDE: Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/50">
//         <div className="w-full max-w-[440px] space-y-8">
          
//           <div className="space-y-2">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//               Sign In
//             </h1>
//             <p className="text-slate-500 font-medium">
//               Welcome back! Please enter your details.
//             </p>
//           </div>

//           {error && (
//             <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
//               <AlertCircle className="w-5 h-5 shrink-0" />
//               <p className="text-sm font-bold">{error}</p>
//             </div>
//           )}

//           <div className="space-y-6">
//             <form className="space-y-5" onSubmit={handleSubmit}>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Email Address
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
//                     <Mail className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={form.email}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
//                     placeholder="name@company.com"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between items-center ml-1">
//                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                     Password
//                   </label>
//                   <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
//                     Forgot Password?
//                   </Link>
//                 </div>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
//                     <Lock className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="password"
//                     name="password"
//                     required
//                     value={form.password}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
//               >
//                 {submitting ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <>
//                     Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="relative py-2">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-slate-200"></div>
//               </div>
//               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
//                 <span className="bg-slate-50 px-4 text-slate-400">Or continue with</span>
//               </div>
//             </div>

//             <button
//               onClick={authApi.loginWithGoogle}
//               className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
//             >
//               <img 
//                 src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
//                 className="w-5 h-5" 
//                 alt="Google" 
//               />
//               Google Account
//             </button>
//           </div>

//           <p className="text-center text-sm font-medium text-slate-500">
//             Don&apos;t have an account?{" "}
//             <Link to="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4">
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const redirectedMessage = sessionStorage.getItem("authRedirectMessage");
    if (redirectedMessage) {
      setError(redirectedMessage);
      sessionStorage.removeItem("authRedirectMessage");
    }
  }, []);

  const resolveLandingPage = (user) => {
    const pendingRedirect = sessionStorage.getItem("postLoginRedirect");
    const role = (user.role || "").toUpperCase();

    if (pendingRedirect) {
      const allowedByRole = {
        ADMIN: pendingRedirect.startsWith("/admin/"),
        USER: pendingRedirect.startsWith("/user/"),
        TECHNICIAN: pendingRedirect.startsWith("/tech/"),
      };

      sessionStorage.removeItem("postLoginRedirect");

      if (allowedByRole[role]) {
        return pendingRedirect;
      }
    }

    switch (role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "USER":
        return "/user/dashboard";
      case "TECHNICIAN":
        return "/tech/dashboard";
      default:
        return "/";
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // IMPORTANT:
      // loginWithCredentials should return user object.
      // If your context returns extra fields (banned/message), this code handles both.
      const result = await loginWithCredentials(form.email, form.password);

      // support both return shapes:
      // 1) result = user
      // 2) result = { user, banned, message }
      const user = result?.user ? result.user : result;
      const banned = Boolean(result?.banned ?? user?.banned);
      const bannedReason =
        result?.message || user?.banReason || "Your account has been banned by admin.";

      if (!user) {
        throw new Error("Login response is invalid.");
      }

      // if banned -> redirect to banned page
      if (banned) {
        localStorage.setItem("bannedReason", bannedReason);
        navigate("/banned");
        return;
      }

      navigate(resolveLandingPage(user));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid credentials"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="z-10 max-w-lg text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl mb-6 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            Secure Resource Management
          </h2>
          <p className="text-indigo-100 text-lg font-medium leading-relaxed">
            Everything you need to manage support tickets, maintenance requests,
            and team assets in one unified workspace.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            {["Real-time Tracking", "Instant Support", "Team Analytics", "Mobile Ready"].map(
              (feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-indigo-200 text-sm font-semibold"
                >
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" /> {feat}
                </div>
              )
            )}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/50">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 font-medium">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-slate-50 px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={authApi.loginWithGoogle}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google Account
            </button>
          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
