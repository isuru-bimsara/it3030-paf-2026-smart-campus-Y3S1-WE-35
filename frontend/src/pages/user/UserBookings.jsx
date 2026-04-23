// // import { useState, useEffect, useMemo } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import { bookingsApi } from "../../api/bookings";
// // import {
// //   CalendarDays,
// //   Clock3,
// //   CheckCircle2,
// //   XCircle,
// //   AlertCircle,
// //   Ban,
// //   Loader2,
// //   BellRing,
// // } from "lucide-react";

// // export default function UserBookings() {
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchParams, setSearchParams] = useSearchParams();

// //   // notification deep-link
// //   const bookingIdFromQuery = searchParams.get("bookingId");

// //   useEffect(() => {
// //     setLoading(true);
// //     bookingsApi
// //       .getMyBookings()
// //       .then((res) => setBookings(res.data.data || []))
// //       .catch(() => setBookings([]))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   // clear query after page handles highlight
// //   useEffect(() => {
// //     if (!bookingIdFromQuery) return;
// //     const timeout = setTimeout(() => {
// //       setSearchParams({}, { replace: true });
// //     }, 1200);
// //     return () => clearTimeout(timeout);
// //   }, [bookingIdFromQuery, setSearchParams]);

// //   const sortedBookings = useMemo(() => {
// //     return [...bookings].sort(
// //       (a, b) =>
// //         new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
// //     );
// //   }, [bookings]);

// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case "APPROVED":
// //         return {
// //           badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
// //           icon: <CheckCircle2 className="w-4 h-4" />,
// //         };
// //       case "PENDING":
// //         return {
// //           badge: "bg-amber-50 text-amber-700 border-amber-200",
// //           icon: <AlertCircle className="w-4 h-4" />,
// //         };
// //       case "REJECTED":
// //         return {
// //           badge: "bg-rose-50 text-rose-700 border-rose-200",
// //           icon: <XCircle className="w-4 h-4" />,
// //         };
// //       case "CANCELLED":
// //         return {
// //           badge: "bg-slate-100 text-slate-600 border-slate-200",
// //           icon: <Ban className="w-4 h-4" />,
// //         };
// //       default:
// //         return {
// //           badge: "bg-blue-50 text-blue-700 border-blue-200",
// //           icon: <Clock3 className="w-4 h-4" />,
// //         };
// //     }
// //   };

// //   const formatDateTime = (d) =>
// //     new Date(d).toLocaleString([], {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });

// //   return (
// //     <div className="max-w-6xl mx-auto pb-20 space-y-8">
// //       {/* Header */}
// //       <div className="flex items-center gap-4">
// //         <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
// //           <CalendarDays className="w-7 h-7 text-white" />
// //         </div>
// //         <div>
// //           <h1 className="text-3xl font-black text-slate-900 tracking-tight">
// //             My Bookings
// //           </h1>
// //           <p className="text-slate-500 font-medium mt-0.5">
// //             Track your reservations and approval status.
// //           </p>
// //         </div>
// //       </div>

// //       {/* Main Card */}
// //       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
// //         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
// //           <div>
// //             <h2 className="text-lg font-bold text-slate-800">
// //               Booking History
// //             </h2>
// //             <p className="text-xs text-slate-400 font-medium mt-1">
// //               Newest bookings appear first
// //             </p>
// //           </div>
// //           <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500">
// //             {sortedBookings.length} Total
// //           </div>
// //         </div>

// //         {loading ? (
// //           <div className="p-20 text-center">
// //             <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
// //             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
// //               Loading bookings...
// //             </p>
// //           </div>
// //         ) : sortedBookings.length === 0 ? (
// //           <div className="p-20 text-center">
// //             <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
// //               <CalendarDays className="w-7 h-7 text-slate-300" />
// //             </div>
// //             <h3 className="text-slate-800 font-bold text-lg">
// //               No bookings yet
// //             </h3>
// //             <p className="text-slate-400 text-sm mt-1">
// //               Your booked resources will show here.
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-left border-collapse">
// //               <thead>
// //                 <tr className="bg-slate-50/60 border-b border-slate-100">
// //                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
// //                     Resource
// //                   </th>
// //                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
// //                     Time
// //                   </th>
// //                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
// //                     Status
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody className="divide-y divide-slate-50">
// //                 {sortedBookings.map((b) => {
// //                   const isHighlighted =
// //                     bookingIdFromQuery &&
// //                     Number(bookingIdFromQuery) === Number(b.id);
// //                   const status = getStatusStyle(b.status);

// //                   return (
// //                     <tr
// //                       key={b.id}
// //                       className={`transition-all ${
// //                         isHighlighted
// //                           ? "bg-indigo-50/60 ring-1 ring-inset ring-indigo-100"
// //                           : "hover:bg-slate-50/60"
// //                       }`}
// //                     >
// //                       <td className="px-6 py-5">
// //                         <div className="flex items-center gap-2">
// //                           {isHighlighted && (
// //                             <BellRing className="w-4 h-4 text-indigo-600 animate-pulse" />
// //                           )}
// //                           <p className="font-bold text-slate-800">
// //                             {b.resourceName}
// //                           </p>
// //                         </div>
// //                         <p className="text-xs text-slate-400 mt-1">
// //                           Booking #{b.id}
// //                         </p>
// //                       </td>

// //                       <td className="px-6 py-5">
// //                         <div className="text-sm text-slate-700 font-semibold">
// //                           {formatDateTime(b.startTime)}
// //                         </div>
// //                         <div className="text-xs text-slate-400 mt-1">
// //                           → {formatDateTime(b.endTime)}
// //                         </div>
// //                       </td>

// //                       <td className="px-6 py-5 text-center">
// //                         <span
// //                           className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${status.badge}`}
// //                         >
// //                           {status.icon}
// //                           {b.status}
// //                         </span>
// //                         {b.status === "REJECTED" && b.rejectReason && (
// //                           <p className="text-[10px] text-rose-500 font-bold mt-2 max-w-[150px] mx-auto italic">
// //                             Reason: {b.rejectReason}
// //                           </p>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useEffect, useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import { bookingsApi } from "../../api/bookings";
// import { format, isToday, isTomorrow } from "date-fns";
// import {
//   CalendarDays,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Ban,
//   Loader2,
//   BellRing,
//   Box,
//   ChevronRight,
//   X,
//   Calendar,
//   MessageSquare,
//   ArrowRight,
//   Info
// } from "lucide-react";

// const STATUS_MAP = {
//   APPROVED: {
//     label: "Confirmed",
//     color: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     banner: "bg-emerald-600",
//     icon: <CheckCircle2 className="w-4 h-4" />,
//   },
//   PENDING: {
//     label: "Under Review",
//     color: "bg-amber-50 text-amber-700 border-amber-200",
//     banner: "bg-amber-500",
//     icon: <AlertCircle className="w-4 h-4" />,
//   },
//   REJECTED: {
//     label: "Declined",
//     color: "bg-rose-50 text-rose-700 border-rose-200",
//     banner: "bg-rose-600",
//     icon: <XCircle className="w-4 h-4" />,
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     color: "bg-slate-100 text-slate-500 border-slate-200",
//     banner: "bg-slate-500",
//     icon: <Ban className="w-4 h-4" />,
//   },
// };

// export default function UserBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const bookingIdFromQuery = searchParams.get("bookingId");

//   useEffect(() => {
//     setLoading(true);
//     bookingsApi
//       .getMyBookings()
//       .then((res) => setBookings(res.data.data || []))
//       .catch(() => setBookings([]))
//       .finally(() => setLoading(false));
//   }, []);

//   // Handle deep-linking and highlight
//   useEffect(() => {
//     if (bookingIdFromQuery && bookings.length > 0) {
//       const b = bookings.find((item) => String(item.id) === String(bookingIdFromQuery));
//       if (b) setSelectedBooking(b);
      
//       const timeout = setTimeout(() => {
//         setSearchParams({}, { replace: true });
//       }, 2000);
//       return () => clearTimeout(timeout);
//     }
//   }, [bookingIdFromQuery, bookings, setSearchParams]);

//   const sortedBookings = useMemo(() => {
//     return [...bookings].sort(
//       (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
//     );
//   }, [bookings]);

//   const stats = useMemo(() => ({
//     total: bookings.length,
//     approved: bookings.filter(b => b.status === "APPROVED").length,
//     pending: bookings.filter(b => b.status === "PENDING").length,
//   }), [bookings]);

//   const formatDateLabel = (dateStr) => {
//     const d = new Date(dateStr);
//     if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
//     if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`;
//     return format(d, "EEE, MMM dd • h:mm a");
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
//       <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
//       <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Updating Schedule...</p>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
      
//       {/* GREETING & SUMMARY */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
//               <CalendarDays className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Reservations</h1>
//           </div>
//           <p className="text-slate-500 font-medium">Manage and check the status of your requested resources.</p>
//         </div>

//         <div className="flex gap-3">
//           <StatMini label="Active" count={stats.approved} color="text-emerald-600" />
//           <StatMini label="Pending" count={stats.pending} color="text-amber-600" />
//           <StatMini label="Total" count={stats.total} color="text-indigo-600" />
//         </div>
//       </div>

//       {/* MAIN LIST SECTION */}
//       <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/40 overflow-hidden">
//         {sortedBookings.length === 0 ? (
//           <div className="p-24 text-center">
//             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Box className="w-10 h-10 text-slate-300" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-800">No reservations found</h3>
//             <p className="text-slate-500 mt-2 max-w-xs mx-auto">When you book a resource, it will appear here with its real-time status.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Resource</th>
//                   <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Scheduled Time</th>
//                   <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
//                   <th className="px-8 py-5"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {sortedBookings.map((b) => {
//                   const status = STATUS_MAP[b.status] || STATUS_MAP.PENDING;
//                   const isHighlighted = Number(bookingIdFromQuery) === Number(b.id);

//                   return (
//                     <tr
//                       key={b.id}
//                       onClick={() => setSelectedBooking(b)}
//                       className={`group cursor-pointer transition-all ${
//                         isHighlighted ? "bg-indigo-50/70" : "hover:bg-slate-50/80"
//                       }`}
//                     >
//                       <td className="px-8 py-6">
//                         <div className="flex items-center gap-4">
//                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
//                             isHighlighted ? "bg-white shadow-sm" : "bg-slate-100 group-hover:bg-white"
//                           }`}>
//                             <Box className={`w-6 h-6 ${isHighlighted ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} />
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <p className="font-bold text-slate-800">{b.resourceName}</p>
//                               {isHighlighted && (
//                                 <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
//                               )}
//                             </div>
//                             <p className="text-xs font-medium text-slate-400 mt-0.5">ID: #{b.id}</p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-8 py-6">
//                         <div className="space-y-1">
//                           <p className="text-sm font-bold text-slate-700">{formatDateLabel(b.startTime)}</p>
//                           <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
//                             <ArrowRight className="w-3 h-3" />
//                             {formatDateLabel(b.endTime)}
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-8 py-6 text-center">
//                         <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
//                           {status.icon}
//                           {status.label}
//                         </span>
//                       </td>

//                       <td className="px-8 py-6 text-right">
//                         <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
//                           <ChevronRight className="w-5 h-5" />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* DETAIL MODAL (Centered) */}
//       {selectedBooking && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
//             onClick={() => setSelectedBooking(null)} 
//           />
          
//           <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* Modal Header */}
//             <div className={`px-10 py-12 ${STATUS_MAP[selectedBooking.status]?.banner || "bg-indigo-600"} text-white relative`}>
//               <button 
//                 onClick={() => setSelectedBooking(null)}
//                 className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
              
//               <div className="flex items-center gap-6">
//                 <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
//                   <Box className="w-10 h-10 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-black tracking-tight leading-none">{selectedBooking.resourceName}</h2>
//                   <p className="mt-3 text-white/80 font-bold uppercase text-[10px] tracking-[0.2em]">Reservation Receipt #{selectedBooking.id}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="p-10 space-y-8 bg-slate-50/50">
//               <div className="grid grid-cols-2 gap-8">
//                 <DetailItem 
//                   icon={<Calendar className="w-4 h-4" />} 
//                   label="Start Schedule" 
//                   value={format(new Date(selectedBooking.startTime), "EEEE, MMM dd, yyyy")}
//                   subValue={format(new Date(selectedBooking.startTime), "hh:mm a")}
//                 />
//                 <DetailItem 
//                   icon={<Clock className="w-4 h-4" />} 
//                   label="End Schedule" 
//                   value={format(new Date(selectedBooking.endTime), "EEEE, MMM dd, yyyy")}
//                   subValue={format(new Date(selectedBooking.endTime), "hh:mm a")}
//                 />
//               </div>

//               {/* Purpose Box */}
//               <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
//                 <div className="flex items-center gap-2 text-indigo-600">
//                   <MessageSquare className="w-4 h-4" />
//                   <span className="text-[10px] font-black uppercase tracking-widest">Purpose of Booking</span>
//                 </div>
//                 <p className="text-sm text-slate-600 italic leading-relaxed px-1">
//                   "{selectedBooking.purpose || "No specific details provided."}"
//                 </p>
//               </div>

//               {/* Logic for Feedback/Rejection */}
//               {selectedBooking.status === "REJECTED" && (
//                 <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4">
//                   <div className="p-2 bg-rose-100 rounded-xl h-fit">
//                     <Info className="w-5 h-5 text-rose-600" />
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Admin Feedback</p>
//                     <p className="text-sm text-rose-800 font-bold">{selectedBooking.rejectReason || "No explanation provided by admin."}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
//                <button 
//                 onClick={() => setSelectedBooking(null)}
//                 className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all active:scale-95"
//               >
//                 DISMISS DETAILS
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Helper Components
// function StatMini({ label, count, color }) {
//   return (
//     <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 flex flex-col items-center min-w-[80px]">
//       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
//       <span className={`text-xl font-black ${color}`}>{count}</span>
//     </div>
//   );
// }

// function DetailItem({ icon, label, value, subValue }) {
//   return (
//     <div className="flex gap-4">
//       <div className="mt-1 p-2 bg-white rounded-xl border border-slate-200 text-indigo-500 shadow-sm h-fit">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//         <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
//         <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>
//       </div>
//     </div>
//   );
// }




import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingsApi } from "../../api/bookings";
import { format, isToday, isTomorrow } from "date-fns";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Loader2,
  Box,
  ChevronRight,
  X,
  Calendar,
  MessageSquare,
  ArrowRight,
  Info,
  ArrowUpDown, // New icon for sorting
} from "lucide-react";

const STATUS_MAP = {
  APPROVED: {
    label: "Confirmed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    banner: "bg-emerald-600",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  PENDING: {
    label: "Under Review",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    banner: "bg-amber-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  REJECTED: {
    label: "Declined",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    banner: "bg-rose-600",
    icon: <XCircle className="w-4 h-4" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    banner: "bg-slate-500",
    icon: <Ban className="w-4 h-4" />,
  },
};

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortBy, setSortBy] = useState("NEWEST"); // NEWEST, OLDEST, NAME
  const [searchParams, setSearchParams] = useSearchParams();

  const bookingIdFromQuery = searchParams.get("bookingId");

  useEffect(() => {
    setLoading(true);
    bookingsApi
      .getMyBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (bookingIdFromQuery && bookings.length > 0) {
      const b = bookings.find((item) => String(item.id) === String(bookingIdFromQuery));
      if (b) setSelectedBooking(b);
      const timeout = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [bookingIdFromQuery, bookings, setSearchParams]);

  // Enhanced Sorting Logic
  const sortedBookings = useMemo(() => {
    const list = [...bookings];
    switch (sortBy) {
      case "OLDEST":
        return list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      case "NAME":
        return list.sort((a, b) => a.resourceName.localeCompare(b.resourceName));
      case "NEWEST":
      default:
        return list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    }
  }, [bookings, sortBy]);

  const stats = useMemo(() => ({
    total: bookings.length,
    approved: bookings.filter(b => b.status === "APPROVED").length,
    pending: bookings.filter(b => b.status === "PENDING").length,
  }), [bookings]);

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
    if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`;
    return format(d, "EEE, MMM dd • h:mm a");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Updating Schedule...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
      
      {/* GREETING & SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Reservations</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage and check the status of your requested resources.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* SORT DROPDOWN */}
          <div className="relative group mr-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
              <option value="NAME">Sort: Resource Name</option>
            </select>
          </div>

          <StatMini label="Active" count={stats.approved} color="text-emerald-600" />
          <StatMini label="Pending" count={stats.pending} color="text-amber-600" />
          <StatMini label="Total" count={stats.total} color="text-indigo-600" />
        </div>
      </div>

      {/* MAIN LIST SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/40 overflow-hidden">
        {sortedBookings.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Box className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No reservations found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">When you book a resource, it will appear here with its real-time status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Resource</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Scheduled Time</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedBookings.map((b) => {
                  const status = STATUS_MAP[b.status] || STATUS_MAP.PENDING;
                  const isHighlighted = Number(bookingIdFromQuery) === Number(b.id);

                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`group cursor-pointer transition-all ${
                        isHighlighted ? "bg-indigo-50/70" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                            isHighlighted ? "bg-white shadow-sm" : "bg-slate-100 group-hover:bg-white"
                          }`}>
                            <Box className={`w-6 h-6 ${isHighlighted ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800">{b.resourceName}</p>
                              {isHighlighted && (
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">ID: #{b.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-700">{formatDateLabel(b.startTime)}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                            <ArrowRight className="w-3 h-3" />
                            {formatDateLabel(b.endTime)}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL (Centered) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedBooking(null)} 
          />
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-10 py-12 ${STATUS_MAP[selectedBooking.status]?.banner || "bg-indigo-600"} text-white relative`}>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                  <Box className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight leading-none">{selectedBooking.resourceName}</h2>
                  <p className="mt-3 text-white/80 font-bold uppercase text-[10px] tracking-[0.2em]">Reservation Receipt #{selectedBooking.id}</p>
                </div>
              </div>
            </div>
            <div className="p-10 space-y-8 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-8">
                <DetailItem 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Start Schedule" 
                  value={format(new Date(selectedBooking.startTime), "EEEE, MMM dd, yyyy")}
                  subValue={format(new Date(selectedBooking.startTime), "hh:mm a")}
                />
                <DetailItem 
                  icon={<Clock className="w-4 h-4" />} 
                  label="End Schedule" 
                  value={format(new Date(selectedBooking.endTime), "EEEE, MMM dd, yyyy")}
                  subValue={format(new Date(selectedBooking.endTime), "hh:mm a")}
                />
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Purpose of Booking</span>
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed px-1">
                  "{selectedBooking.purpose || "No specific details provided."}"
                </p>
              </div>
              {selectedBooking.status === "REJECTED" && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4">
                  <div className="p-2 bg-rose-100 rounded-xl h-fit">
                    <Info className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Admin Feedback</p>
                    <p className="text-sm text-rose-800 font-bold">{selectedBooking.rejectReason || "No explanation provided by admin."}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
               <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all active:scale-95"
              >
                DISMISS DETAILS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatMini({ label, count, color }) {
  return (
    <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 flex flex-col items-center min-w-[80px]">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
      <span className={`text-xl font-black ${color}`}>{count}</span>
    </div>
  );
}

function DetailItem({ icon, label, value, subValue }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 p-2 bg-white rounded-xl border border-slate-200 text-indigo-500 shadow-sm h-fit">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-xs font-medium text-slate-400 mt-1">{subValue}</p>
      </div>
    </div>
  );
}