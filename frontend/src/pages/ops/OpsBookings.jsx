// // frontend/src/pages/ops/OpsBookings.jsx
// // Booking management page for OPERATION_MANAGER role.

// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { bookingsApi } from "../../api/bookings";

// import { formatDistanceToNowStrict } from "date-fns";
// import {
//   CalendarCheck,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Search,
//   Filter,
//   Loader2,
//   X,
//   ChevronRight,
// } from "lucide-react";

// const STATUS_STYLES = {
//   APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
//   REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
//   CANCELLED:"bg-slate-100 text-slate-500 border-slate-200",
// };

// const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

// export default function OpsBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [searchParams] = useSearchParams();
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: "" });

//   const fetchBookings = async () => {
//     try {
//       const res = await bookingsApi.getAll();
//       const data = (res.data.data || []).map((b) => {
//         if (new Date(b.endTime) < new Date() && b.status === "PENDING") {
//           return { ...b, status: "CANCELLED", autoCancelled: true };
//         }
//         return b;
//       });
//       setBookings(data);
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     const interval = setInterval(fetchBookings, 60_000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Auto-select booking if ID in URL
//   useEffect(() => {
//     const bookingId = searchParams.get("bookingId");
//     if (bookingId && bookings.length > 0) {
//       const b = bookings.find((item) => String(item.id) === String(bookingId));
//       if (b) setSelectedBooking(b);
//     }
//   }, [searchParams, bookings]);

//   const handleAction = async (id, action, reason = "") => {
//     if (action === "reject" && !reason) {
//       setRejectModal({ open: true, id, reason: "" });
//       return;
//     }

//     setActionLoading(id + action);
//     try {
//       let res;
//       if (action === "approve") res = await bookingsApi.approve(id);
//       else if (action === "reject") res = await bookingsApi.reject(id, reason);
//       else if (action === "cancel") res = await bookingsApi.cancel(id);

//       const updated = res.data.data;
//       setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
//       if (selectedBooking?.id === id) setSelectedBooking(updated);
//       setRejectModal({ open: false, id: null, reason: "" });
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update booking status.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const sortedBookings = [...bookings]
//     .filter((b) => {
//       const matchSearch =
//         b.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
//         b.userName?.toLowerCase().includes(search.toLowerCase());
//       const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
//       return matchSearch && matchStatus;
//     })
//     .sort((a, b) => {
//       // 1. Prioritize PENDING status
//       if (a.status === "PENDING" && b.status !== "PENDING") return -1;
//       if (a.status !== "PENDING" && b.status === "PENDING") return 1;

//       // 2. Within PENDING: Oldest first (Manager handles oldest requests first)
//       if (a.status === "PENDING" && b.status === "PENDING") {
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       }

//       // 3. Within non-PENDING (Approved/Rejected): Newest first (Manager sees latest history)
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });

//   // Summary counts
//   const counts = bookings.reduce(
//     (acc, b) => {
//       acc[b.status] = (acc[b.status] || 0) + 1;
//       return acc;
//     },
//     {}
//   );

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-60">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );

//   return (
//     <div className="space-y-6 pb-20">
//       {/* HEADER */}
//       <div className="flex items-center gap-3">
//         <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
//           <CalendarCheck className="text-white w-6 h-6" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">Booking Management</h1>
//           <p className="text-slate-500">Review, approve and manage all reservations</p>
//         </div>
//       </div>

//       {/* SUMMARY PILLS */}
//       <div className="flex flex-wrap gap-3">
//         {[
//           { label: "Pending", key: "PENDING", color: "bg-amber-100 text-amber-700 border-amber-200" },
//           { label: "Approved", key: "APPROVED", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
//           { label: "Rejected", key: "REJECTED", color: "bg-rose-100 text-rose-700 border-rose-200" },
//           { label: "Cancelled", key: "CANCELLED", color: "bg-slate-100 text-slate-500 border-slate-200" },
//         ].map((item) => (
//           <button
//             key={item.key}
//             onClick={() => setStatusFilter(statusFilter === item.key ? "ALL" : item.key)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all active:scale-95 ${
//               statusFilter === item.key
//                 ? item.color + " ring-2 ring-offset-1 ring-current"
//                 : item.color + " opacity-70 hover:opacity-100"
//             }`}
//           >
//             {item.label}
//             <span className="bg-white/60 rounded-full px-1.5 py-0.5 text-xs">
//               {counts[item.key] || 0}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* SEARCH + FILTER BAR */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by resource or user…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-300"
//           />
//         </div>
//         <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-500">
//           <Filter className="w-4 h-4" />
//           <span className="font-medium">{sortedBookings.length} results</span>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-5 border-b flex items-center justify-between">
//           <h3 className="font-bold text-slate-700 flex items-center gap-2">
//             <Clock className="w-5 h-5 text-indigo-600" />
//             All Bookings
//           </h3>
//           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//             {bookings.length} total
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           {sortedBookings.length === 0 ? (
//             <div className="py-20 text-center">
//               <CalendarCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//               <p className="text-slate-500 font-bold">No bookings match your filter</p>
//             </div>
//           ) : (
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Resource</th>
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Created</th>
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Booking Period</th>
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
//                   <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {sortedBookings.map((b) => (
//                   <tr
//                     key={b.id}
//                     onClick={() => setSelectedBooking(b)}
//                     className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
//                   >
//                     <td className="px-6 py-4 font-bold text-slate-800">{b.resourceName}</td>
//                     <td className="px-6 py-4 text-slate-600 text-sm">{b.userName}</td>
//                     <td className="px-6 py-4 text-slate-500 text-sm">
//                       {formatDistanceToNowStrict(new Date(b.createdAt), { addSuffix: true })}
//                     </td>
//                     <td className="px-6 py-4 text-slate-500 text-sm">
//                       <div className="flex flex-col">
//                         <span>{new Date(b.startTime).toLocaleDateString()} {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                         <span className="text-slate-400 text-[10px]">to {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[b.status] || ""}`}>
//                         {b.status}{b.autoCancelled ? " (auto)" : ""}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
//                         {b.status === "PENDING" && (
//                           <>
//                             <button
//                               onClick={() => handleAction(b.id, "approve")}
//                               disabled={!!actionLoading}
//                               className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 disabled:opacity-50 transition-colors"
//                             >
//                               <CheckCircle className="w-3.5 h-3.5" /> Approve
//                             </button>
//                             <button
//                               onClick={() => handleAction(b.id, "reject")}
//                               disabled={!!actionLoading}
//                               className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 disabled:opacity-50 transition-colors"
//                             >
//                               <XCircle className="w-3.5 h-3.5" /> Reject
//                             </button>
//                           </>
//                         )}
//                         {b.status === "APPROVED" && (
//                           <button
//                             onClick={() => handleAction(b.id, "cancel")}
//                             disabled={!!actionLoading}
//                             className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 disabled:opacity-50 transition-colors"
//                           >
//                             Cancel
//                           </button>
//                         )}
//                         <ChevronRight className="w-4 h-4 text-slate-300" />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* DETAIL PANEL */}
//       {selectedBooking && (
//         <div className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-5 border-b">
//             <h2 className="text-lg font-black text-slate-800">Booking Details</h2>
//             <button
//               onClick={() => setSelectedBooking(null)}
//               className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
//             >
//               <X className="w-5 h-5 text-slate-400" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 p-6 space-y-5">
//             <InfoRow label="Resource" value={selectedBooking.resourceName} bold />
//             <InfoRow label="Booked by" value={selectedBooking.userName} />
//             <InfoRow
//               label="Start Time"
//               value={new Date(selectedBooking.startTime).toLocaleString()}
//             />
//             <InfoRow
//               label="End Time"
//               value={new Date(selectedBooking.endTime).toLocaleString()}
//             />
//             <InfoRow
//               label="Created"
//               value={formatDistanceToNowStrict(new Date(selectedBooking.createdAt), {
//                 addSuffix: true,
//               })}
//             />

//             <div>
//               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Purpose</p>
//               <p className="bg-slate-50 p-3 rounded-xl text-sm text-slate-700">
//                 {selectedBooking.purpose || "No purpose provided"}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
//               <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLES[selectedBooking.status] || ""}`}>
//                 {selectedBooking.status}{selectedBooking.autoCancelled ? " (auto-cancelled)" : ""}
//               </span>
//             </div>

//             {selectedBooking.status === "REJECTED" && selectedBooking.rejectReason && (
//               <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
//                 <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Rejection Reason</p>
//                 <p className="text-sm text-rose-700 italic">"{selectedBooking.rejectReason}"</p>
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="p-6 border-t space-y-2">
//             {selectedBooking.status === "PENDING" && (
//               <>
//                 <button
//                   onClick={() => handleAction(selectedBooking.id, "approve")}
//                   disabled={!!actionLoading}
//                   className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
//                 >
//                   {actionLoading === selectedBooking.id + "approve" ? "Processing…" : "✓ Approve Booking"}
//                 </button>
//                 <button
//                   onClick={() => handleAction(selectedBooking.id, "reject")}
//                   disabled={!!actionLoading}
//                   className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 disabled:bg-rose-300 transition-colors"
//                 >
//                   {actionLoading === selectedBooking.id + "reject" ? "Processing…" : "✕ Reject Booking"}
//                 </button>
//                 <button
//                   onClick={() => handleAction(selectedBooking.id, "cancel")}
//                   disabled={!!actionLoading}
//                   className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 disabled:bg-amber-300 transition-colors"
//                 >
//                   Cancel Booking
//                 </button>
//               </>
//             )}
//             {selectedBooking.status === "APPROVED" && (
//               <button
//                 onClick={() => handleAction(selectedBooking.id, "cancel")}
//                 disabled={!!actionLoading}
//                 className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 disabled:bg-amber-300 transition-colors"
//               >
//                 Cancel Booking
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* REJECT REASON MODAL */}
//       {rejectModal.open && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//               <h3 className="text-xl font-black text-slate-800">Reject Booking</h3>
//               <button onClick={() => setRejectModal({ open: false, id: null, reason: "" })} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
//                 <X className="w-5 h-5 text-slate-400" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
//                 <XCircle className="w-4 h-4" /> Please provide a reason for rejecting this booking request.
//               </div>
//               <textarea
//                 value={rejectModal.reason}
//                 onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
//                 placeholder="e.g. This resource is undergoing maintenance during these hours."
//                 rows={4}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-300 resize-none"
//               />
//             </div>
//             <div className="p-6 bg-slate-50 flex gap-3">
//               <button
//                 onClick={() => setRejectModal({ open: false, id: null, reason: "" })}
//                 className="flex-1 py-3 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={!rejectModal.reason.trim()}
//                 onClick={() => handleAction(rejectModal.id, "reject", rejectModal.reason)}
//                 className="flex-2 bg-rose-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50"
//               >
//                 {actionLoading === rejectModal.id + "reject" ? "Rejecting..." : "Reject Booking"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function InfoRow({ label, value, bold }) {
//   return (
//     <div>
//       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//       <p className={`text-sm ${bold ? "font-bold text-slate-800" : "text-slate-600"}`}>{value}</p>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingsApi } from "../../api/bookings";
import { format, isToday, isTomorrow } from "date-fns";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  X,
  ChevronRight,
  User,
  Box,
  AlertCircle,
  ArrowRight,
  Calendar,
  Hash,
  MessageSquare,
  History
} from "lucide-react";

const STATUS_THEME = {
  APPROVED: { 
    color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
    banner: "bg-emerald-600",
    light: "bg-emerald-50",
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  PENDING: { 
    color: "bg-amber-50 text-amber-700 border-amber-200", 
    banner: "bg-amber-500",
    light: "bg-amber-50",
    icon: <Clock className="w-4 h-4" /> 
  },
  REJECTED: { 
    color: "bg-rose-50 text-rose-700 border-rose-200", 
    banner: "bg-rose-600",
    light: "bg-rose-50",
    icon: <XCircle className="w-4 h-4" /> 
  },
  CANCELLED: { 
    color: "bg-slate-100 text-slate-500 border-slate-200", 
    banner: "bg-slate-500",
    light: "bg-slate-100",
    icon: <AlertCircle className="w-4 h-4" /> 
  },
};

export default function OpsBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: "" });

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getAll();
      const data = (res.data.data || []).map((b) => {
        if (new Date(b.endTime) < new Date() && b.status === "PENDING") {
          return { ...b, status: "CANCELLED", autoCancelled: true };
        }
        return b;
      });
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (bookingId && bookings.length > 0) {
      const b = bookings.find((item) => String(item.id) === String(bookingId));
      if (b) setSelectedBooking(b);
    }
  }, [searchParams, bookings]);

  const handleAction = async (id, action, reason = "") => {
    setActionLoading(id + action);
    try {
      let res;
      if (action === "approve") res = await bookingsApi.approve(id);
      else if (action === "reject") res = await bookingsApi.reject(id, reason);
      else if (action === "cancel") res = await bookingsApi.cancel(id);

      const updated = res.data.data;
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (selectedBooking?.id === id) setSelectedBooking(updated);
      setRejectModal({ open: false, id: null, reason: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.resourceName?.toLowerCase().includes(search.toLowerCase()) || 
                          b.userName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return `Today at ${format(d, "p")}`;
    if (isTomorrow(d)) return `Tomorrow at ${format(d, "p")}`;
    return format(d, "MMM dd, p");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      <p className="text-slate-500 font-bold tracking-tight">Syncing Reservations...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* TOP NAVBAR AREA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
            <CalendarCheck className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Booking Manager</h1>
            <p className="text-indigo-100 font-medium">Identify and process reservations in real-time</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search resources or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-80 pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-indigo-200 outline-none focus:bg-white/20 focus:border-white/50 transition-all font-medium"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"].map((key) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest transition-all whitespace-nowrap border-2 ${
              statusFilter === key 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                : "bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            {key} {key !== "ALL" && `(${bookings.filter(b => b.status === key).length})`}
          </button>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Resource Identity</th>
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Requester</th>
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
              <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredBookings.map((b) => (
              <tr 
                key={b.id} 
                onClick={() => setSelectedBooking(b)}
                className="group hover:bg-indigo-50/30 cursor-pointer transition-all"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Box className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-base">{b.resourceName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {b.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{b.userName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">{formatTime(b.startTime)}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 uppercase font-bold tracking-tighter">
                      <ArrowRight className="w-3 h-3" /> Ends {formatTime(b.endTime)}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${STATUS_THEME[b.status]?.color}`}>
                    {STATUS_THEME[b.status]?.icon}
                    {b.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CENTERED DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedBooking(null)} 
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Status-colored Header Banner */}
            <div className={`px-10 py-12 ${STATUS_THEME[selectedBooking.status]?.banner} text-white relative`}>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Box className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{selectedBooking.resourceName}</h2>
                  <div className="flex items-center gap-2 mt-2 opacity-90">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">Booking ID #{selectedBooking.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
              <div className="space-y-6">
                <DetailRow icon={<User />} label="Requested Personnel" value={selectedBooking.userName} />
                <DetailRow icon={<Calendar />} label="Reservation Date" value={format(new Date(selectedBooking.startTime), "EEEE, MMMM dd")} />
                <div className="flex items-center gap-4">
                   <DetailRow icon={<Clock />} label="Check-In" value={format(new Date(selectedBooking.startTime), "hh:mm a")} />
                   <DetailRow icon={<ArrowRight />} label="Check-Out" value={format(new Date(selectedBooking.endTime), "hh:mm a")} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Purpose</span>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{selectedBooking.purpose || "The requester has not specified a purpose."}"
                  </p>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs font-bold px-2">
                   <History className="w-4 h-4" />
                   <span>Generated on {format(new Date(selectedBooking.createdAt), "PPp")}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Footer Actions */}
            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
              {selectedBooking.status === "PENDING" && (
                <>
                  <button 
                    onClick={() => handleAction(selectedBooking.id, "approve")}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
                  >
                    CONFIRM & APPROVE
                  </button>
                  <button 
                    onClick={() => setRejectModal({ open: true, id: selectedBooking.id, reason: "" })}
                    className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95"
                  >
                    DECLINE REQUEST
                  </button>
                </>
              )}
              {selectedBooking.status === "APPROVED" && (
                <button 
                  onClick={() => handleAction(selectedBooking.id, "cancel")}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  CLOSE THE REQUEST
                </button>
              )}
         
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL (Centered) */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-rose-900/30 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Reason for Decline</h3>
            <p className="text-slate-500 mb-6 font-medium leading-snug">Please provide a brief explanation. This feedback will be sent directly to the requester.</p>
            
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g. Double booking or maintenance required..."
              rows={4}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-rose-500 focus:bg-white transition-all text-sm mb-6 resize-none"
            />
            
            <div className="flex gap-4">
              <button onClick={() => setRejectModal({ open: false, id: null, reason: "" })} className="flex-1 font-bold text-slate-400">Back</button>
              <button 
                disabled={!rejectModal.reason.trim()} 
                onClick={() => handleAction(rejectModal.id, "reject", rejectModal.reason)}
                className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 disabled:opacity-50 transition-all"
              >
                SUBMIT & REJECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal Detail Component for Modal
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 p-2 bg-white rounded-xl border border-slate-200 text-indigo-500 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}