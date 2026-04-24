// import { useState, useEffect, useMemo } from "react";
// import { ticketsApi } from "../../api/tickets";
// import TicketComments from "../TicketComments";
// import { useAuth } from "../../context/AuthContext";
// import {
//   Ticket,
//   Clock,
//   CheckCircle2,
//   CircleDot,
//   User,
//   Tag,
//   ChevronRight,
//   Filter,
//   AlertCircle,
//   XCircle,
//   MessageSquare,
//   Search,
//   Loader2,
//   X,
//   Trash2,
// } from "lucide-react";

// export default function AdminTickets() {
//   const { user: authUser } = useAuth();
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState("ALL");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [commentOpen, setCommentOpen] = useState(false);
//   const [commentTicketId, setCommentTicketId] = useState(null);

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     setLoading(true);
//     try {
//       const res = await ticketsApi.getAll();
//       setTickets(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTickets = useMemo(() => {
//     return tickets.filter((t) => {
//       const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
//       const matchesSearch =
//         t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         t.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesStatus && matchesSearch;
//     });
//   }, [tickets, filterStatus, searchQuery]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Admin: Permanently delete this ticket?")) return;
//     try {
//       await ticketsApi.deleteTicket(id);
//       fetchTickets();
//     } catch (err) {
//       alert("Failed to delete ticket");
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "OPEN":
//         return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10";
//       case "IN_PROGRESS":
//         return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10";
//       case "RESOLVED":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10";
//       case "REJECTED":
//         return "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10";
//       case "CLOSED":
//         return "bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/10";
//       default:
//         return "bg-gray-50 text-gray-600 border-gray-200";
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 min-h-screen">
//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//         <div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//             <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
//               <Ticket className="text-white w-6 h-6" />
//             </div>
//             Admin Ticket Archive
//           </h1>
//           <p className="text-slate-500 font-medium mt-1.5 ml-1">
//             Full system overview and historical logs.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
//           <div className="relative flex-1 lg:min-w-[300px]">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search database..."
//               className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <select
//             className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700 shadow-sm cursor-pointer"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="ALL">All Status</option>
//             <option value="OPEN">Open</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="RESOLVED">Resolved</option>
//             <option value="REJECTED">Rejected</option>
//             <option value="CLOSED">Closed</option>
//           </select>
//         </div>
//       </div>

//       {/* TICKETS TABLE */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
//         {loading ? (
//           <div className="p-32 text-center">
//             <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
//             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
//               Querying Database...
//             </p>
//           </div>
//         ) : filteredTickets.length === 0 ? (
//           <div className="p-32 text-center">
//             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Ticket className="w-10 h-10 text-slate-200" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-800">
//               No records found
//             </h3>
//             <p className="text-slate-400 font-medium mt-1">
//               Try refining your search parameters.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
//                     Ticket Details
//                   </th>
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
//                     Status
//                   </th>
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Assignee
//                   </th>
//                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
//                     Control
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {filteredTickets.map((t) => (
//                   <tr
//                     key={t.id}
//                     className="group hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="px-8 py-6">
//                       <div className="flex flex-col">
//                         <div className="flex items-center gap-2 mb-1.5">
//                           <span className="text-[10px] font-bold text-slate-400">
//                             #{t.id}
//                           </span>
//                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
//                           <span className="text-[10px] font-bold text-slate-400">
//                             {new Date(t.createdAt).toLocaleString()}
//                           </span>
//                         </div>
//                         <h4 className="text-sm font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
//                           {t.title}
//                         </h4>
//                         <p className="text-xs font-semibold text-slate-500">
//                           {t.reporterName} • {t.category}
//                         </p>
//                       </div>
//                     </td>

//                     <td className="px-8 py-6 text-center">
//                       <span
//                         className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusStyle(t.status)}`}
//                       >
//                         {t.status.replace("_", " ")}
//                       </span>
//                     </td>

//                     <td className="px-8 py-6">
//                       {t.assigneeName ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
//                             {t.assigneeName.charAt(0)}
//                           </div>
//                           <span className="text-xs font-bold text-slate-700">
//                             {t.assigneeName}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
//                           Open
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-8 py-6 text-right">
//                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                         <button
//                           onClick={() => {
//                             setCommentTicketId(t.id);
//                             setCommentOpen(true);
//                           }}
//                           className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
//                           title="View Log"
//                         >
//                           <MessageSquare className="w-4 h-4" />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(t.id)}
//                           className="p-2.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
//                           title="Delete Permanently"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* COMMENTS MODAL */}
//       <TicketComments
//         ticketId={commentTicketId}
//         open={commentOpen}
//         onClose={() => setCommentOpen(false)}
//         currentUserName={authUser?.name}
//       />
//     </div>
//   );
// }


import { useState, useEffect, useMemo } from "react";
import { ticketsApi } from "../../api/tickets";
import {
  Ticket,
  Clock,
  User,
  Search,
  Loader2,
  Trash2,
  Calendar,
  Layers,
  FileText,
  ChevronLeft,
  ShieldCheck,
  Hash,
  Activity
} from "lucide-react";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.getAll();
      setTickets(res.data.data || []);
    } catch (err) {
      console.error("Database Error:", err);
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

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL: Permanently delete this record from system logs?")) return;
    try {
      await ticketsApi.deleteTicket(id);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      alert("Action failed: Unauthorized or Database Error");
    }
  };

  const getStatusStyle = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ";
    switch (status) {
      case "OPEN": return base + "bg-rose-50 text-rose-600 border-rose-100";
      case "IN_PROGRESS": return base + "bg-blue-50 text-blue-600 border-blue-100";
      case "RESOLVED": return base + "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return base + "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  // ---------------------------------------------------------
  // RENDER TICKET DETAILS (Middle of page)
  // ---------------------------------------------------------
  if (selectedTicket) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedTicket(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-all group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Registry
        </button>

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          {/* Audit Header */}
          <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest border border-white/10">
                  REF ID: {selectedTicket.id}
                </span>
                <span className={getStatusStyle(selectedTicket.status)}>
                  {selectedTicket.status}
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">{selectedTicket.title}</h1>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Meta Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500"><User size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporter</p>
                  <p className="text-sm font-bold text-slate-700">{selectedTicket.reporterName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500"><ShieldCheck size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</p>
                  <p className="text-sm font-bold text-slate-700">{selectedTicket.assigneeName || "Awaiting Assignment"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500"><Calendar size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged Date</p>
                  <p className="text-sm font-bold text-slate-700">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500"><Layers size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                  <p className="text-sm font-bold text-slate-700">{selectedTicket.category}</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
                <FileText size={14}/> Incident Description
              </h3>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-600 leading-relaxed font-medium">
                {selectedTicket.description || "No detailed information provided by the reporter."}
              </div>
            </div>

            {/* Read-Only Footer */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Activity size={16} className="animate-pulse text-emerald-500"/>
                <span className="text-[10px] font-bold uppercase tracking-tighter italic">System: Record Locked (Read-Only)</span>
              </div>
              <button 
                onClick={() => handleDelete(selectedTicket.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-xs transition-all border border-rose-100"
              >
                <Trash2 size={14}/> Delete Permanent Log
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN REGISTRY LIST VIEW
  // ---------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-10 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            Admin Audit Registry
          </h1>
          <p className="text-slate-500 font-medium mt-2 ml-1 text-lg">Centralized monitoring of all system interactions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:min-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Title or Reporter..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold shadow-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-black text-slate-700 shadow-sm cursor-pointer appearance-none"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="p-40 text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Audit Data...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-40 text-center">
            <Hash className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No Records in Database</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee Info</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTickets.map((t) => (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t)}
                    className="group hover:bg-slate-50/80 cursor-pointer transition-all"
                  >
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-500 mb-1 tracking-tighter">ID: #{t.id}</span>
                        <h4 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">
                          {t.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{t.reporterName}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={getStatusStyle(t.status)}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500">
                          {t.assigneeName ? t.assigneeName.charAt(0) : <Clock size={14}/>}
                        </div>
                        <span className="text-sm font-bold text-slate-600">{t.assigneeName || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-300 group-hover:text-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest">
                        Audit View
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}