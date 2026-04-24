// //frontend/src/pages/RegisterPage.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { authApi } from "../api/auth"; // Added for Google part
// import { 
//   Mail, 
//   Lock, 
//   User, 
//   UserPlus, 
//   ArrowRight, 
//   Loader2, 
//   ShieldCheck, 
//   AlertCircle,
//   CheckCircle 
// } from "lucide-react";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     try {
//       const user = await register(form.email, form.name, form.password);
//       // Role-based redirect logic preserved
//       switch (user.role.toLowerCase()) {
//         case "admin": navigate("/admin/dashboard"); break;
//         case "user": navigate("/user/dashboard"); break;
//         case "tech": navigate("/tech/dashboard"); break;
//         default: navigate("/login");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-white font-sans text-slate-900">
      
//       {/* LEFT SIDE: Brand/Benefits Panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
//         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
//         <div className="z-10 max-w-lg">
//           <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl mb-8 border border-white/20">
//             <UserPlus className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-4xl font-black text-white mb-6 tracking-tight">
//             Start Your Journey With Us.
//           </h2>
          
//           <div className="space-y-6">
//             {[
//               { title: 'Centralized Control', desc: 'Manage all your assets and requests from one place.' },
//               { title: 'Role-Based Access', desc: 'Secure environments for Admins, Users, and Techs.' },
//               { title: 'Seamless Integration', desc: 'Connect with your favorite tools in minutes.' }
//             ].map((item, i) => (
//               <div key={i} className="flex gap-4">
//                 <div className="mt-1 bg-indigo-500/50 p-1 rounded-full h-fit">
//                   <CheckCircle className="w-5 h-5 text-indigo-200" />
//                 </div>
//                 <div>
//                   <h4 className="text-white font-bold">{item.title}</h4>
//                   <p className="text-indigo-100 text-sm">{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Decorative elements */}
//         <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
//       </div>

//       {/* RIGHT SIDE: Register Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/50">
//         <div className="w-full max-w-[440px] space-y-8">
          
//           <div className="space-y-2 text-left">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//               Create Account
//             </h1>
//             <p className="text-slate-500 font-medium">
//               Join the platform and start managing your workspace.
//             </p>
//           </div>

//           {error && (
//             <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
//               <AlertCircle className="w-5 h-5 shrink-0" />
//               <p className="text-sm font-bold">{error}</p>
//             </div>
//           )}

//           <div className="space-y-6">
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               {/* Full Name Input */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     value={form.name}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
//                     placeholder="Jane Doe"
//                   />
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
//                     <Mail className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={form.email}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
//                     placeholder="name@company.com"
//                   />
//                 </div>
//               </div>

//               {/* Password Input */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
//                     <Lock className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="password"
//                     name="password"
//                     required
//                     minLength={8}
//                     value={form.password}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
//                     placeholder="At least 8 characters"
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
//                     Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="relative py-2">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-slate-200"></div>
//               </div>
//               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
//                 <span className="bg-slate-50 px-4 text-slate-400">Or sign up with</span>
//               </div>
//             </div>

//             <button
//               onClick={authApi.loginWithGoogle}
//               className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
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
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useMemo, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { authApi } from "../api/auth";
// import {
//   Mail,
//   Lock,
//   User,
//   UserPlus,
//   ArrowRight,
//   Loader2,
//   AlertCircle,
//   CheckCircle
// } from "lucide-react";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });

//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Password validation rules
//   const passwordRules = useMemo(() => {
//     const p = form.password || "";
//     return {
//       minLength: p.length >= 8,
//       upper: /[A-Z]/.test(p),
//       lower: /[a-z]/.test(p),
//       number: /\d/.test(p),
//       special: /[^A-Za-z0-9]/.test(p)
//     };
//   }, [form.password]);

//   const isPasswordStrong = Object.values(passwordRules).every(Boolean);
//   const isPasswordMatch =
//     form.confirmPassword.length > 0 && form.password === form.confirmPassword;

//   const canSubmit =
//     form.name.trim() &&
//     form.email.trim() &&
//     isPasswordStrong &&
//     isPasswordMatch &&
//     !submitting;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!isPasswordStrong) {
//       setError("Password must be at least 8 chars and include upper, lower, number, and special character.");
//       return;
//     }

//     if (!isPasswordMatch) {
//       setError("Password and Confirm Password do not match.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const user = await register(form.email, form.name, form.password);
//       switch ((user.role || "").toLowerCase()) {
//         case "admin":
//           navigate("/admin/dashboard");
//           break;
//         case "user":
//           navigate("/user/dashboard");
//           break;
//         case "tech":
//           navigate("/tech/dashboard");
//           break;
//         default:
//           navigate("/login");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-white font-sans text-slate-900">
//       {/* LEFT SIDE */}
//       <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
//         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
//         <div className="z-10 max-w-lg">
//           <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl mb-8 border border-white/20">
//             <UserPlus className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-4xl font-black text-white mb-6 tracking-tight">
//             Start Your Journey With Us.
//           </h2>

//           <div className="space-y-6">
//             {[
//               { title: "Centralized Control", desc: "Manage all your assets and requests from one place." },
//               { title: "Role-Based Access", desc: "Secure environments for Admins, Users, and Techs." },
//               { title: "Seamless Integration", desc: "Connect with your favorite tools in minutes." }
//             ].map((item, i) => (
//               <div key={i} className="flex gap-4">
//                 <div className="mt-1 bg-indigo-500/50 p-1 rounded-full h-fit">
//                   <CheckCircle className="w-5 h-5 text-indigo-200" />
//                 </div>
//                 <div>
//                   <h4 className="text-white font-bold">{item.title}</h4>
//                   <p className="text-indigo-100 text-sm">{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/50">
//         <div className="w-full max-w-[440px] space-y-8">
//           <div className="space-y-2 text-left">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
//             <p className="text-slate-500 font-medium">
//               Join the platform and start managing your workspace.
//             </p>
//           </div>

//           {error && (
//             <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3">
//               <AlertCircle className="w-5 h-5 shrink-0" />
//               <p className="text-sm font-bold">{error}</p>
//             </div>
//           )}

//           <div className="space-y-6">
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               {/* Name */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     value={form.name}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl"
//                     placeholder="Jane Doe"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                     <Mail className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={form.email}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl"
//                     placeholder="name@company.com"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                     <Lock className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="password"
//                     name="password"
//                     required
//                     value={form.password}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl"
//                     placeholder="Min 8 chars, Aa1@"
//                   />
//                 </div>

//                 {/* Live password checks */}
//                 <ul className="text-xs flex flex-wrap gap-3 mt-2">
//   <li className={passwordRules.minLength ? "text-emerald-600" : "text-slate-500"}>
//     • 8+ chars
//   </li>
//   <li className={passwordRules.upper ? "text-emerald-600" : "text-slate-500"}>
//     • Uppercase
//   </li>
//   <li className={passwordRules.lower ? "text-emerald-600" : "text-slate-500"}>
//     • Lowercase
//   </li>
//   <li className={passwordRules.number ? "text-emerald-600" : "text-slate-500"}>
//     • Number
//   </li>
//   <li className={passwordRules.special ? "text-emerald-600" : "text-slate-500"}>
//     • Special char
//   </li>
// </ul>
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-2 relative group">
//                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                     <Lock className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     required
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     className={`block w-full pl-12 pr-4 py-3 bg-white border rounded-2xl ${
//                       form.confirmPassword.length === 0
//                         ? "border-slate-200"
//                         : isPasswordMatch
//                         ? "border-emerald-400"
//                         : "border-rose-300"
//                     }`}
//                     placeholder="Re-enter password"
//                   />
//                 </div>
//                 {form.confirmPassword.length > 0 && !isPasswordMatch && (
//                   <p className="text-xs text-rose-600 ml-1">Passwords do not match.</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={!canSubmit}
//                 className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl disabled:bg-slate-300 flex items-center justify-center gap-2"
//               >
//                 {submitting ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <>
//                     Create Account <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="relative py-2">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-slate-200"></div>
//               </div>
//               <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
//                 <span className="bg-slate-50 px-4 text-slate-400">Or sign up with</span>
//               </div>
//             </div>

//             <button
//               onClick={authApi.loginWithGoogle}
//               className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-3"
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
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ NEW STATES (only added)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordRules = useMemo(() => {
    const p = form.password || "";
    return {
      minLength: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[^A-Za-z0-9]/.test(p)
    };
  }, [form.password]);

  const isPasswordStrong = Object.values(passwordRules).every(Boolean);
  const isPasswordMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    isPasswordStrong &&
    isPasswordMatch &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong) {
      setError("Password must be at least 8 chars and include upper, lower, number, and special character.");
      return;
    }

    if (!isPasswordMatch) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form.email, form.name, form.password);
      switch ((user.role || "").toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "user":
          navigate("/user/dashboard");
          break;
        case "tech":
          navigate("/tech/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="z-10 max-w-lg">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-xl mb-8 border border-white/20">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight">
            Start Your Journey With Us.
          </h2>

          <div className="space-y-6">
            {[
              { title: "Centralized Control", desc: "Manage all your assets and requests from one place." },
              { title: "Role-Based Access", desc: "Secure environments for Admins, Users, and Techs." },
              { title: "Seamless Integration", desc: "Connect with your favorite tools in minutes." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 bg-indigo-500/50 p-1 rounded-full h-fit">
                  <CheckCircle className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <p className="text-indigo-100 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-50/50">
        <div className="w-full max-w-[440px] space-y-8">

          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">
              Join the platform and start managing your workspace.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="space-y-2 relative group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 relative group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 relative group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl"
                    placeholder="Min 8 chars, Aa1@"
                  />

                  {/* 👁 Eye */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <ul className="text-xs flex flex-wrap gap-3 mt-2">
                  <li className={passwordRules.minLength ? "text-emerald-600" : "text-slate-500"}>• 8+ chars</li>
                  <li className={passwordRules.upper ? "text-emerald-600" : "text-slate-500"}>• Uppercase</li>
                  <li className={passwordRules.lower ? "text-emerald-600" : "text-slate-500"}>• Lowercase</li>
                  <li className={passwordRules.number ? "text-emerald-600" : "text-slate-500"}>• Number</li>
                  <li className={passwordRules.special ? "text-emerald-600" : "text-slate-500"}>• Special char</li>
                </ul>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 relative group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Confirm Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-12 py-3 bg-white border rounded-2xl ${
                      form.confirmPassword.length === 0
                        ? "border-slate-200"
                        : isPasswordMatch
                        ? "border-emerald-400"
                        : "border-rose-300"
                    }`}
                    placeholder="Re-enter password"
                  />

                  {/* 👁 Eye */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {form.confirmPassword.length > 0 && !isPasswordMatch && (
                  <p className="text-xs text-rose-600 ml-1">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-slate-50 px-4 text-slate-400">Or sign up with</span>
              </div>
            </div>

            <button
              onClick={authApi.loginWithGoogle}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-3"
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
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}