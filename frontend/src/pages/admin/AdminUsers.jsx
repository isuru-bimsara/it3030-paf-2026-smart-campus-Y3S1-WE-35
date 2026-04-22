

// import { useEffect, useState, useMemo } from "react";
// import { adminApi } from "../../api/admin";
// import {
//   UserCog,
//   Mail,
//   ShieldCheck,
//   ArrowUpDown,
//   Search,
//   UserCircle,
//   ChevronDown,
//   ArrowUp,
//   ArrowDown,
//   Ban,
//   BadgeCheck,
// } from "lucide-react";

// const ROLES = ["USER", "TECHNICIAN", "ADMIN"];

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
//   const [actionLoadingId, setActionLoadingId] = useState(null);

//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8083";

//   const buildImageUrl = (picture) => {
//     if (!picture) return null;
//     if (picture.startsWith("http")) return picture;
//     return `${API_BASE_URL}${picture}`;
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await adminApi.getUsers();
//       setUsers(res?.data?.data || []);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleChange = async (id, newRole) => {
//     try {
//       await adminApi.updateRole(id, newRole);
//       await fetchUsers();
//     } catch (err) {
//       console.error("Failed to update role:", err);
//       alert("Failed to update role");
//     }
//   };

//   const handleToggleBan = async (user) => {
//     try {
//       setActionLoadingId(user.id);

//       if (user.role === "ADMIN") {
//         alert("Admin user cannot be banned.");
//         return;
//       }

//       if (user.banned) {
//         await adminApi.unbanUser(user.id);
//       } else {
//         const reason = window.prompt(
//           "Enter ban reason:",
//           "Your account has been banned by admin."
//         );
//         if (reason === null) return;
//         await adminApi.banUser(user.id, reason);
//       }

//       await fetchUsers();
//     } catch (err) {
//       console.error("Failed to update ban status:", err);
//       alert(err?.response?.data?.message || "Failed to update ban status");
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const processedUsers = useMemo(() => {
//     const term = (searchTerm || "").toLowerCase();

//     const filtered = users.filter((u) => {
//       const name = (u?.name || "").toLowerCase();
//       const email = (u?.email || "").toLowerCase();
//       return name.includes(term) || email.includes(term);
//     });

//     return [...filtered].sort((a, b) => {
//       const rawA = a?.[sortConfig.key];
//       const rawB = b?.[sortConfig.key];
//       const valA = String(rawA ?? "").toUpperCase();
//       const valB = String(rawB ?? "").toUpperCase();

//       if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//       if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [users, sortConfig, searchTerm]);

//   const getRoleBadge = (role) => {
//     switch (role) {
//       case "ADMIN":
//         return "bg-purple-100 text-purple-700 border-purple-200";
//       case "TECHNICIAN":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-600 border-gray-200";
//     }
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
//     return sortConfig.direction === "asc" ? (
//       <ArrowUp className="w-3 h-3 text-indigo-600" />
//     ) : (
//       <ArrowDown className="w-3 h-3 text-indigo-600" />
//     );
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
//               <UserCog className="w-8 h-8 text-indigo-600" />
//               Manage Users
//             </h1>
//             <p className="text-gray-500 mt-1 font-medium">
//               Assign roles, ban/unban users, and monitor system access.
//             </p>
//           </div>

//           <div className="relative group w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm"
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50/50 border-b border-gray-100">
//                   <th onClick={() => requestSort("name")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
//                     <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
//                       User Profile {getSortIcon("name")}
//                     </div>
//                   </th>
//                   <th onClick={() => requestSort("email")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
//                     <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
//                       Contact Details {getSortIcon("email")}
//                     </div>
//                   </th>
//                   <th onClick={() => requestSort("role")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
//                     <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
//                       Current Role {getSortIcon("role")}
//                     </div>
//                   </th>
//                   <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
//                     Ban Status
//                   </th>
//                   <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="5" className="py-20 text-center text-gray-400 font-medium animate-pulse">
//                       Retrieving user records...
//                     </td>
//                   </tr>
//                 ) : (
//                   processedUsers.map((u) => (
//                     <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
//                             {u.picture ? (
//                               <img src={buildImageUrl(u.picture)} alt={u.name || "User"} className="h-full w-full object-cover" />
//                             ) : (
//                               <div className="h-full w-full flex items-center justify-center text-gray-300">
//                                 <UserCircle className="w-6 h-6" />
//                               </div>
//                             )}
//                           </div>
//                           <span className="font-bold text-gray-800 text-sm">{u.name || "Unnamed User"}</span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-gray-600 text-sm">
//                           <Mail className="w-4 h-4 text-gray-400" />
//                           {u.email || "-"}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit ${getRoleBadge(u.role)}`}>
//                           <ShieldCheck className="w-3 h-3" />
//                           {u.role || "USER"}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4">
//                         {u.banned ? (
//                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border bg-rose-100 text-rose-700 border-rose-200">
//                             BANNED
//                           </span>
//                         ) : (
//                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border bg-emerald-100 text-emerald-700 border-emerald-200">
//                             ACTIVE
//                           </span>
//                         )}
//                       </td>

//                       <td className="px-6 py-4 text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <div className="relative inline-block text-left">
//                             <select
//                               value={u.role || "USER"}
//                               onChange={(e) => handleRoleChange(u.id, e.target.value)}
//                               className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer"
//                             >
//                               {ROLES.map((r) => (
//                                 <option key={r} value={r}>{r}</option>
//                               ))}
//                             </select>
//                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                           </div>

//                           <button
//                             onClick={() => handleToggleBan(u)}
//                             disabled={actionLoadingId === u.id || u.role === "ADMIN"}
//                             className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
//                               ${u.banned
//                                 ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
//                                 : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"}
//                               disabled:opacity-50 disabled:cursor-not-allowed`}
//                           >
//                             {u.banned ? <BadgeCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
//                             {actionLoadingId === u.id ? "Please wait..." : u.banned ? "Unban" : "Ban"}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {!loading && processedUsers.length === 0 && (
//             <div className="py-20 text-center">
//               <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
//                 <UserCog className="h-8 w-8 text-gray-200" />
//               </div>
//               <p className="text-gray-500 font-bold">No users found</p>
//               <p className="text-gray-400 text-sm">Try adjusting your search criteria.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../api/admin";
import {
  UserCog,
  Mail,
  ShieldCheck,
  ArrowUpDown,
  Search,
  UserCircle,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Ban,
  BadgeCheck,
  X,
} from "lucide-react";

const ROLES = ["USER", "TECHNICIAN", "ADMIN", "OPERATION_MANAGER"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  // Ban modal states
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("Your account has been banned by admin.");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8083";

  const buildImageUrl = (picture) => {
    if (!picture) return null;
    if (picture.startsWith("http")) return picture;
    return `${API_BASE_URL}${picture}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.getUsers();
      setUsers(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      setActionLoadingId(id);
      setError("");
      await adminApi.updateRole(id, newRole);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
      setError(err?.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanReason("Your account has been banned by admin.");
    setIsBanModalOpen(true);
  };

  const closeBanModal = () => {
    setIsBanModalOpen(false);
    setSelectedUser(null);
    setBanReason("Your account has been banned by admin.");
  };

  const confirmBan = async () => {
    if (!selectedUser) return;

    const reason = banReason.trim();
    if (!reason) {
      setError("Ban reason is required");
      return;
    }

    try {
      setActionLoadingId(selectedUser.id);
      setError("");
      await adminApi.banUser(selectedUser.id, reason);
      closeBanModal();
      await fetchUsers();
    } catch (err) {
      console.error("Failed to ban user:", err);
      setError(err?.response?.data?.message || "Failed to update ban status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const unbanUser = async (user) => {
    try {
      setActionLoadingId(user.id);
      setError("");
      await adminApi.unbanUser(user.id);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to unban user:", err);
      setError(err?.response?.data?.message || "Failed to update ban status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleBan = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin user cannot be banned.");
      return;
    }

    if (user.banned) {
      await unbanUser(user);
    } else {
      openBanModal(user);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const processedUsers = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();

    const filtered = users.filter((u) => {
      const name = (u?.name || "").toLowerCase();
      const email = (u?.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });

    return [...filtered].sort((a, b) => {
      const rawA = a?.[sortConfig.key];
      const rawB = b?.[sortConfig.key];
      const valA = String(rawA ?? "").toUpperCase();
      const valB = String(rawB ?? "").toUpperCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig, searchTerm]);

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "TECHNICIAN":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "OPERATION_MANAGER":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-600" />
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <UserCog className="w-8 h-8 text-indigo-600" />
              Manage Users
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Assign roles, ban/unban users, and monitor system access.
            </p>
          </div>

          <div className="relative group w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th onClick={() => requestSort("name")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      User Profile {getSortIcon("name")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("email")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      Contact Details {getSortIcon("email")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("role")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      Current Role {getSortIcon("role")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Ban Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400 font-medium animate-pulse">
                      Retrieving user records...
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                            {u.picture ? (
                              <img src={buildImageUrl(u.picture)} alt={u.name || "User"} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300">
                                <UserCircle className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{u.name || "Unnamed User"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {u.email || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit ${getRoleBadge(u.role)}`}>
                          <ShieldCheck className="w-3 h-3" />
                          {u.role || "USER"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {u.banned ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border bg-rose-100 text-rose-700 border-rose-200">
                            BANNED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border bg-emerald-100 text-emerald-700 border-emerald-200">
                            ACTIVE
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative inline-block text-left">
                            <select
                              value={u.role || "USER"}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={actionLoadingId === u.id}
                              className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>

                          <button
                            onClick={() => handleToggleBan(u)}
                            disabled={actionLoadingId === u.id || u.role === "ADMIN"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                              ${u.banned
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"}
                              disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {u.banned ? <BadgeCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            {actionLoadingId === u.id ? "Please wait..." : u.banned ? "Unban" : "Ban"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && processedUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
                <UserCog className="h-8 w-8 text-gray-200" />
              </div>
              <p className="text-gray-500 font-bold">No users found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ban Reason Modal */}
      {isBanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Ban User</h2>
              <button
                onClick={closeBanModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                You are banning:{" "}
                <span className="font-bold text-gray-900">
                  {selectedUser?.name || selectedUser?.email}
                </span>
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
                  Ban Reason
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 resize-none"
                  placeholder="Enter reason for banning this user..."
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={closeBanModal}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBan}
                disabled={!selectedUser || actionLoadingId === selectedUser?.id}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:bg-rose-300"
              >
                {actionLoadingId === selectedUser?.id ? "Banning..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}