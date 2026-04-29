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
  Users,
  ShieldAlert,
  UserCheck,
  Loader2,
} from "lucide-react";

const ROLES = ["USER", "TECHNICIAN", "ADMIN", "OPERATION_MANAGER"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("Your account has been banned by admin.");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8083";

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
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      setActionLoadingId(id);
      await adminApi.updateRole(id, newRole);
      await fetchUsers();
    } catch (err) {
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
  };

  const confirmBan = async () => {
    if (!selectedUser) return;
    try {
      setActionLoadingId(selectedUser.id);
      await adminApi.banUser(selectedUser.id, banReason.trim());
      closeBanModal();
      await fetchUsers();
    } catch (err) {
      setError("Failed to update ban status");
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
      try {
        setActionLoadingId(user.id);
        await adminApi.unbanUser(user.id);
        await fetchUsers();
      } finally { setActionLoadingId(null); }
    } else {
      openBanModal(user);
    }
  };

  const processedUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((u) => 
      u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    );
    return [...filtered].sort((a, b) => {
      const valA = String(a[sortConfig.key] || "").toUpperCase();
      const valB = String(b[sortConfig.key] || "").toUpperCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig, searchTerm]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.banned).length,
    banned: users.filter(u => u.banned).length,
  }), [users]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <UserCog className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Identity Management</h1>
            </div>
            <p className="text-slate-500 font-medium text-sm">Orchestrate user permissions and security policies.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none shadow-sm transition-all text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats.total} icon={<Users />} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard label="Active" value={stats.active} icon={<UserCheck />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Restricted" value={stats.banned} icon={<ShieldAlert />} color="text-rose-600" bg="bg-rose-50" />
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="w-4 h-4" /> {error}
            <button onClick={() => setError("")} className="ml-auto opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <SortableHeader label="User Profile" sortKey="name" config={sortConfig} onSort={setSortConfig} />
                  <SortableHeader label="Contact" sortKey="email" config={sortConfig} onSort={setSortConfig} />
                  <SortableHeader label="Permission" sortKey="role" config={sortConfig} onSort={setSortConfig} />
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Security Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing records...</p>
                    </td>
                  </tr>
                ) : processedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-100 flex-shrink-0">
                          {u.picture ? (
                            <img src={buildImageUrl(u.picture)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                              <UserCircle className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{u.name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Mail className="w-3.5 h-3.5 opacity-40" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest uppercase ${getRoleStyles(u.role)}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.banned ? (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black border bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100">LOCKED</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black border bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100">TRUSTED</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="relative">
                          <select
                            value={u.role || "USER"}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={actionLoadingId === u.id}
                            className="appearance-none bg-slate-100 border border-transparent text-slate-700 py-1.5 pl-3 pr-8 rounded-xl text-xs font-bold hover:bg-slate-200 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                        <button
                          onClick={() => handleToggleBan(u)}
                          disabled={actionLoadingId === u.id || u.role === "ADMIN"}
                          className={`p-2 rounded-xl border transition-all ${
                            u.banned 
                              ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" 
                              : "bg-white text-slate-400 border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                          } disabled:opacity-30`}
                        >
                          {u.banned ? <BadgeCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BAN MODAL */}
      {isBanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-rose-600 p-8 text-white relative">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-40" />
              <h2 className="text-2xl font-black tracking-tight">Restrict Access</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">You are about to suspend {selectedUser?.name}.</p>
              <button onClick={closeBanModal} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Reason</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-rose-200 transition-all resize-none"
                  placeholder="Why is this user being banned?"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={closeBanModal} className="flex-1 py-3.5 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">Dismiss</button>
                <button onClick={confirmBan} className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-lg shadow-rose-200 active:scale-95 transition-all">Confirm Ban</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// HELPER COMPONENTS
function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm">
      <div className={`${bg} ${color} p-3.5 rounded-2xl`}>
        {cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-black text-slate-900`}>{value}</p>
      </div>
    </div>
  );
}

import { cloneElement } from "react";

function SortableHeader({ label, sortKey, config, onSort }) {
  const isActive = config.key === sortKey;
  return (
    <th 
      onClick={() => onSort({ key: sortKey, direction: isActive && config.direction === "asc" ? "desc" : "asc" })}
      className="px-6 py-5 cursor-pointer group hover:bg-slate-100/50 transition-colors"
    >
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
        {label}
        {isActive ? (
          config.direction === "asc" ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
        )}
      </div>
    </th>
  );
}

function getRoleStyles(role) {
  switch (role) {
    case "ADMIN": return "bg-purple-50 text-purple-600 border-purple-100";
    case "TECHNICIAN": return "bg-blue-50 text-blue-600 border-blue-100";
    case "OPERATION_MANAGER": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
}