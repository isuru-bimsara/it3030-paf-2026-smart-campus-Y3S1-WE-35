import { useState, useEffect, useMemo } from "react";
import { ticketsApi } from "../../api/tickets";
import TicketComments from "../TicketComments";
import { useAuth } from "../../context/AuthContext";
import {
  Ticket,
  Clock,
  CheckCircle2,
  CircleDot,
  User,
  Tag,
  ChevronRight,
  Filter,
  AlertCircle,
  XCircle,
  MessageSquare,
  Search,
  Info,
  Loader2,
  X,
} from "lucide-react";

export default function OpsTickets() {
  const { user: authUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);

  const [rejectModal, setRejectModal] = useState({ open: false, ticketId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.getAll();
      setTickets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tickets, filterStatus, searchQuery]);

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    setSubmitting(true);
    try {
      await ticketsApi.reject(rejectModal.ticketId, rejectReason);
      alert("✅ Ticket REJECTED");
      setRejectModal({ open: false, ticketId: null });
      setRejectReason("");
      fetchTickets();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to reject ticket"));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN": return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10";
      case "IN_PROGRESS": return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10";
      case "RESOLVED": return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10";
      case "REJECTED": return "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10";
      case "CLOSED": return "bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/10";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "CRITICAL": return "text-rose-600";
      case "HIGH": return "text-orange-600";
      case "MEDIUM": return "text-blue-600";
      default: return "text-slate-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-100">
              <Ticket className="text-white w-6 h-6" />
            </div>
            Operations Ticket Console
          </h1>
          <p className="text-slate-500 font-medium mt-1.5 ml-1">Monitor, assign, and manage all facility incidents.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
           <div className="relative flex-1 lg:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by title or user..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>

           <select 
             className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value)}
           >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
           </select>
        </div>
      </div>

      {/* STATS PREVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: "Active", count: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length, color: "bg-blue-600" },
           { label: "Pending Resolve", count: tickets.filter(t => t.status === 'RESOLVED').length, color: "bg-emerald-600" },
           { label: "Rejected", count: tickets.filter(t => t.status === 'REJECTED').length, color: "bg-orange-600" },
           { label: "Total", count: tickets.length, color: "bg-slate-800" },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className={`w-1 h-8 rounded-full ${stat.color}`}></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <p className="text-xl font-black text-slate-800 leading-none">{stat.count}</p>
              </div>
           </div>
         ))}
      </div>

      {/* TICKETS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="p-32 text-center">
             <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Secure Logs...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-32 text-center">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No tickets matching criteria</h3>
             <p className="text-slate-400 font-medium mt-1">Adjust your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Incident Info</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Technician</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-black uppercase ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">
                          {t.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 line-clamp-1 max-w-xs">
                          {t.isOther ? "General" : t.resourceName} • {t.reporterName}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusStyle(t.status)}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      {t.assigneeName ? (
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                              {t.assigneeName.charAt(0)}
                           </div>
                           <span className="text-xs font-bold text-slate-700">{t.assigneeName}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setCommentTicketId(t.id);
                              setCommentOpen(true);
                            }}
                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-100 hover:bg-orange-50 rounded-xl transition-all shadow-sm"
                            title="View Log"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {(t.status === 'OPEN' || t.status === 'IN_PROGRESS') && (
                            <button 
                              onClick={() => setRejectModal({ open: true, ticketId: t.id })}
                              className="p-2.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                              title="Reject Ticket"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-800 rounded-xl transition-all shadow-sm">
                             <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-slate-800">Reject Ticket</h2>
                 <button onClick={() => setRejectModal({ open: false, ticketId: null })} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                 <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                 <p className="text-xs font-semibold text-orange-800 leading-relaxed">
                   Rejecting a ticket requires a mandatory reason that will be visible to the user. This action cannot be undone easily.
                 </p>
              </div>

              <form onSubmit={handleReject} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Rejection Reason</label>
                    <textarea 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                      placeholder="Explain why this ticket is being rejected..."
                      rows={4}
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                    />
                 </div>

                 <button 
                   type="submit" 
                   disabled={submitting || !rejectReason.trim()}
                   className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                 >
                   {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><XCircle className="w-5 h-5" /> Reject Request</>}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      <TicketComments
        ticketId={commentTicketId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        currentUserName={authUser?.name}
      />
    </div>
  );
}
