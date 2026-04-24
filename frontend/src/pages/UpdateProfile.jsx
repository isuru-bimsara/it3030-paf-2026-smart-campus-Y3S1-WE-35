// import { useState, useEffect } from "react";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import {
//   Camera,
//   User,
//   Mail,
//   Save,
//   AlertCircle,
//   CheckCircle2,
//   ShieldCheck,
// } from "lucide-react";

// export default function UpdateProfile() {
//   const { user: authUser, updateUser } = useAuth(); // ✅ global auth state

//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);

//   const buildImageUrl = (picture) => {
//     if (!picture) return null;
//     return picture.startsWith("http")
//       ? picture
//       : `http://localhost:8083${picture}`;
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/auth/me");
//         const userData = res.data.data;
//         setUser(userData);
//         setName(userData?.name || "");
//         setImagePreview(buildImageUrl(userData?.picture));
//       } catch (err) {
//         console.error("Failed to fetch user", err);
//         setError("Failed to load profile data.");
//       }
//     };
//     fetchUser();
//   }, []);

//   // Optional: keep page synced if auth context user changes elsewhere
//   useEffect(() => {
//     if (authUser) {
//       setUser(authUser);
//       setName((prev) => (prev ? prev : authUser.name || ""));
//       if (!image) {
//         setImagePreview(buildImageUrl(authUser.picture));
//       }
//     }
//   }, [authUser]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setError(null);

//     try {
//       const formData = new FormData();
//       if (name) formData.append("name", name);
//       if (image) formData.append("image", image);

//       const res = await api.put("/users/profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const updatedUser = res.data.data;

//       // local page state
//       setUser(updatedUser);
//       setName(updatedUser?.name || "");
//       setImagePreview(buildImageUrl(updatedUser?.picture));
//       setImage(null);

//       // ✅ global state update (AdminLayout updates instantly)
//       updateUser(updatedUser);

//       setMessage("Profile updated successfully!");
//       setTimeout(() => setMessage(null), 3000);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const currentUserImageUrl = buildImageUrl(user?.picture);
//   const showRevertButton = Boolean(image && imagePreview);

//   return (
//     <div className="max-w-4xl mx-auto p-6 md:p-8 pb-20 space-y-8 font-sans">
//       <div>
//         <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//           Profile Settings
//         </h1>
//         <p className="text-slate-500 mt-1 text-sm font-medium">
//           Manage your personal identity and account preferences.
//         </p>
//       </div>

//       {message && (
//         <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
//           <div className="bg-emerald-100 p-1.5 rounded-full">
//             <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//           </div>
//           <p className="font-bold text-sm">{message}</p>
//         </div>
//       )}

//       {error && (
//         <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
//           <div className="bg-rose-100 p-1.5 rounded-full">
//             <AlertCircle className="w-5 h-5 text-rose-600" />
//           </div>
//           <p className="font-bold text-sm">{error}</p>
//         </div>
//       )}

//       <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
//         <div className="h-40 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
//           <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
//         </div>

//         <form onSubmit={handleSubmit} className="px-8 pb-10">
//           <div className="flex flex-col md:flex-row gap-8 items-start relative -mt-16 mb-8">
//             <div className="relative group shrink-0">
//               <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-lg relative z-10">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Profile preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User className="w-16 h-16 text-slate-300 m-auto mt-9" />
//                 )}

//                 <div
//                   className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
//                   onClick={() => document.getElementById("profile-upload").click()}
//                 >
//                   <div className="bg-white/20 p-2 rounded-full">
//                     <Camera className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//               </div>

//               <input
//                 type="file"
//                 id="profile-upload"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />

//               <label
//                 htmlFor="profile-upload"
//                 className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-600/30 border-4 border-white z-20"
//                 title="Change profile picture"
//               >
//                 <Camera className="w-4 h-4" />
//               </label>
//             </div>

//             <div className="pt-20 md:pt-16 flex-1 w-full">
//               <h2 className="text-2xl font-black text-slate-900">
//                 {user?.name || "Loading..."}
//               </h2>
//               <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mt-1">
//                 {user?.email}
//                 {user?.provider === "google" && (
//                   <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-100">
//                     <ShieldCheck className="w-3 h-3" />
//                     Google Auth
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>

//           <hr className="border-slate-100 my-8" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
//                 Display Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                   <User className="w-5 h-5" />
//                 </div>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-sm font-bold shadow-sm"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//                   <Mail className="w-5 h-5" />
//                 </div>
//                 <input
//                   type="email"
//                   disabled
//                   value={user?.email || ""}
//                   className="block w-full pl-12 pr-4 py-3.5 bg-slate-100/50 border border-slate-200 text-slate-500 rounded-2xl cursor-not-allowed outline-none text-sm font-semibold shadow-inner"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="pt-10 mt-10 flex items-center justify-between border-t border-slate-100">
//             <div>
//               {showRevertButton && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setImage(null);
//                     setImagePreview(currentUserImageUrl);
//                   }}
//                   className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 text-sm font-bold rounded-xl transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
//                 >
//                   Revert Photo
//                 </button>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <Save className="w-5 h-5" />
//               )}
//               {loading ? "Saving changes..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Camera,
  User,
  Mail,
  Save,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UpdateProfile() {
  const { user: authUser, updateUser } = useAuth();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Password change states
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const buildImageUrl = (picture) => {
    if (!picture) return null;
    return picture.startsWith("http")
      ? picture
      : `http://localhost:8083${picture}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.data;
        setUser(userData);
        setName(userData?.name || "");
        setImagePreview(buildImageUrl(userData?.picture));
      } catch (err) {
        console.error("Failed to fetch user", err);
        setError("Failed to load profile data.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setName((prev) => (prev ? prev : authUser.name || ""));
      if (!image) {
        setImagePreview(buildImageUrl(authUser.picture));
      }
    }
  }, [authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (image) formData.append("image", image);

      const res = await api.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.data;
      setUser(updatedUser);
      setName(updatedUser?.name || "");
      setImagePreview(buildImageUrl(updatedUser?.picture));
      setImage(null);
      updateUser(updatedUser);

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your profile? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    setDeleting(true);
    setMessage(null);
    setError(null);

    try {
      await api.delete("/auth/me");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete profile.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);
    setPasswordError(null);

    try {
      await api.put("/users/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      setPasswordMessage("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const currentUserImageUrl = buildImageUrl(user?.picture);
  const showRevertButton = Boolean(image && imagePreview);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 pb-20 space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Manage your personal identity and account preferences.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="bg-emerald-100 p-1.5 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-bold text-sm">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="bg-rose-100 p-1.5 rounded-full">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
        <div className="h-40 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10">
          <div className="flex flex-col md:flex-row gap-8 items-start relative -mt-16 mb-8">
            <div className="relative group shrink-0">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-lg relative z-10">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-300 m-auto mt-9" />
                )}

                <div
                  className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="profile-upload"
                className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-600/30 border-4 border-white z-20"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </label>
            </div>

            <div className="pt-20 md:pt-16 flex-1 w-full">
              <h2 className="text-2xl font-black text-slate-900">
                {user?.name || "Loading..."}
              </h2>
              <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mt-1">
                {user?.email}
                {user?.provider === "google" && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-100">
                    <ShieldCheck className="w-3 h-3" />
                    Google Auth
                  </span>
                )}
              </p>
            </div>
          </div>

          <hr className="border-slate-100 my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-sm font-bold shadow-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-100/50 border border-slate-200 text-slate-500 rounded-2xl cursor-not-allowed outline-none text-sm font-semibold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="pt-10 mt-10 flex items-center justify-between border-t border-slate-100">
            <div>
              {showRevertButton && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(currentUserImageUrl);
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 text-sm font-bold rounded-xl transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
                >
                  Revert Photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={deleting || loading}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/25 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
                {deleting ? "Deleting..." : "Delete Profile"}
              </button>

              <button
                type="submit"
                disabled={loading || deleting}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Security Section - Only for local providers */}
      {user?.provider !== "google" && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Lock className="w-5 h-5 text-indigo-600" />
              </div>
              Security & Password
            </h3>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Update your password to keep your account secure.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
            {passwordMessage && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-2">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="font-bold text-sm">{passwordMessage}</p>
              </div>
            )}

            {passwordError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-2">
                <div className="bg-rose-100 p-1.5 rounded-full">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <p className="font-bold text-sm">{passwordError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    required
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      required
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                      className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold shadow-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold shadow-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
              >
                {passwordLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
