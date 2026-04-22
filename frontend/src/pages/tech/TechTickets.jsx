// // frontend/src/pages/tech/TechTickets.jsx

// import { useEffect, useState, useMemo } from "react";
// import { ticketsApi } from "../../api/tickets";
// import TicketComments from "../TicketComments";
// import {
//   MessageSquare,
//   Filter,
//   Clock,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";

// const BASE_URL = "http://localhost:8083";

// const TICKET_CATEGORIES = [
//   "ALL",
//   "ELECTRICAL",
//   "PLUMBING",
//   "HVAC",
//   "IT",
//   "CLEANING",
//   "OTHER",
// ];
// const STATUS_OPTIONS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
// const PRIORITY_OPTIONS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

// // Priority weights for sorting
// const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
// // Status weights (Closed/Resolved should go to bottom)
// const statusWeight = { OPEN: 2, IN_PROGRESS: 2, RESOLVED: 1, CLOSED: 0 };

// export default function TechTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [filters, setFilters] = useState({
//     category: "ALL",
//     status: "ALL",
//     priority: "ALL",
//   });

//   const [commentOpen, setCommentOpen] = useState(false);
//   const [commentTicket, setCommentTicket] = useState(null);
//   const [imageModal, setImageModal] = useState({ open: false, src: "" });
//   const [selectedTicket, setSelectedTicket] = useState(null);

//   useEffect(() => {
//     fetchTickets();
//   }, [filters.category]);

//   const fetchTickets = async () => {
//     try {
//       let res;
//       if (filters.category === "ALL") {
//         res = await ticketsApi.getAll();
//       } else {
//         res = await ticketsApi.getByCategory(filters.category);
//       }
//       setTickets(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//       setTickets([]);
//     }
//   };

//   // ✅ SORTING & FILTERING LOGIC
//   const processedTickets = useMemo(() => {
//     let filtered = [...tickets];

//     // Filter by Status
//     if (filters.status !== "ALL") {
//       filtered = filtered.filter((t) => t.status === filters.status);
//     }
//     // Filter by Priority
//     if (filters.priority !== "ALL") {
//       filtered = filtered.filter((t) => t.priority === filters.priority);
//     }

//     // Sort: Priority (High to Low) then Status (Open to Closed)
//     return filtered.sort((a, b) => {
//       if (statusWeight[b.status] !== statusWeight[a.status]) {
//         return statusWeight[b.status] - statusWeight[a.status];
//       }
//       return priorityWeight[b.priority] - priorityWeight[a.priority];
//     });
//   }, [tickets, filters]);

//   const handleStatusChange = async (ticketId, status) => {
//     try {
//       await ticketsApi.updateStatus(ticketId, status);
//       fetchTickets();
//       if (selectedTicket) setSelectedTicket({ ...selectedTicket, status });
//     } catch (err) {
//       alert("Error updating status");
//     }
//   };

//   const getPriorityColor = (p) => {
//     switch (p) {
//       case "CRITICAL":
//         return "bg-red-100 text-red-700 border-red-200";
//       case "HIGH":
//         return "bg-orange-100 text-orange-700 border-orange-200";
//       case "MEDIUM":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto pb-20">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           Assigned Tickets
//         </h1>

//         {/* FILTER BAR */}
//         <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
//           <div className="flex items-center gap-2 px-2 border-r border-gray-100">
//             <Filter size={16} className="text-gray-400" />
//             <span className="text-xs font-bold text-gray-500 uppercase">
//               Filters
//             </span>
//           </div>

//           <select
//             value={filters.category}
//             onChange={(e) =>
//               setFilters({ ...filters, category: e.target.value })
//             }
//             className="text-sm font-medium text-blue-600 bg-transparent outline-none cursor-pointer"
//           >
//             {TICKET_CATEGORIES.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="text-sm font-medium text-green-600 bg-transparent outline-none cursor-pointer border-l pl-3 border-gray-100"
//           >
//             <option value="ALL">All Status</option>
//             {STATUS_OPTIONS.slice(1).map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             value={filters.priority}
//             onChange={(e) =>
//               setFilters({ ...filters, priority: e.target.value })
//             }
//             className="text-sm font-medium text-red-600 bg-transparent outline-none cursor-pointer border-l pl-3 border-gray-100"
//           >
//             <option value="ALL">All Priority</option>
//             {PRIORITY_OPTIONS.slice(1).map((p) => (
//               <option key={p} value={p}>
//                 {p}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* TICKET GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {processedTickets.map((t) => (
//           <div
//             key={t.id}
//             onClick={() => setSelectedTicket(t)}
//             className={`bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col ${
//               t.status === "CLOSED"
//                 ? "opacity-70 grayscale-[0.5]"
//                 : "border-gray-100 shadow-sm"
//             }`}
//           >
//             {/* Card Header: Priority Ribbon */}
//             <div
//               className={`h-1.5 w-full ${
//                 t.priority === "CRITICAL"
//                   ? "bg-red-500"
//                   : t.priority === "HIGH"
//                     ? "bg-orange-500"
//                     : t.priority === "MEDIUM"
//                       ? "bg-blue-500"
//                       : "bg-gray-300"
//               }`}
//             />

//             <div className="p-5 flex-1">
//               <div className="flex justify-between items-start mb-3">
//                 <span
//                   className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getPriorityColor(t.priority)}`}
//                 >
//                   {t.priority}
//                 </span>
//                 <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
//                   <Clock size={12} />
//                   {new Date(t.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
//                 {t.title}
//               </h3>
//               <p className="text-gray-500 text-sm mb-4 line-clamp-2">
//                 {t.description}
//               </p>

//               {/* Card Images Preview */}
//               <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
//                 {t.images?.slice(0, 3).map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img.startsWith("http") ? img : `${BASE_URL}/${img}`}
//                     className="w-12 h-12 object-cover rounded-lg border border-gray-100"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setImageModal({ open: true, src: e.target.src });
//                     }}
//                   />
//                 ))}
//                 {t.images?.length > 3 && (
//                   <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
//                     +{t.images.length - 3}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Card Footer */}
//             <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold uppercase">
//                   {t.reporterName?.charAt(0)}
//                 </div>
//                 <span className="text-xs font-semibold text-gray-600">
//                   {t.reporterName}
//                 </span>
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCommentTicket(t);
//                   setCommentOpen(true);
//                 }}
//                 className="text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 <MessageSquare size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- MODALS --- */}

//       {/* FULL IMAGE LIGHTBOX */}
//       {imageModal.open && (
//         <div
//           className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] backdrop-blur-sm transition-all"
//           onClick={() => setImageModal({ open: false, src: "" })}
//         >
//           <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
//             <CheckCircle2 size={32} />
//           </button>
//           <img
//             src={imageModal.src}
//             className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}

//       {/* TICKET DETAILS MODAL */}
//       {selectedTicket && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
//           <div className="bg-white rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
//             <button
//               onClick={() => setSelectedTicket(null)}
//               className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>

//             <span
//               className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}
//             >
//               {selectedTicket.priority} Priority
//             </span>
//             <h2 className="text-2xl font-black text-gray-900 mt-4 mb-2">
//               {selectedTicket.title}
//             </h2>

//             <div className="flex gap-4 mb-6">
//               <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
//                 <AlertCircle size={14} /> {selectedTicket.category}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
//                 <Clock size={14} />{" "}
//                 {new Date(selectedTicket.createdAt).toLocaleString()}
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-2xl mb-6">
//               <p className="text-gray-700 leading-relaxed">
//                 {selectedTicket.description}
//               </p>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-bold text-gray-700 mb-2 underline decoration-blue-500 decoration-2">
//                 Status Management
//               </label>
//               <select
//                 value={selectedTicket.status}
//                 onChange={(e) =>
//                   handleStatusChange(selectedTicket.id, e.target.value)
//                 }
//                 className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {STATUS_OPTIONS.slice(1).map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-3">
//                 Evidence Images
//               </label>
//               <div className="grid grid-cols-4 gap-3">
//                 {selectedTicket.images?.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img.startsWith("http") ? img : `${BASE_URL}/${img}`}
//                     className="w-full h-20 object-cover rounded-xl cursor-pointer hover:ring-2 ring-blue-500 transition-all"
//                     onClick={() =>
//                       setImageModal({
//                         open: true,
//                         src: img.startsWith("http")
//                           ? img
//                           : `${BASE_URL}/${img}`,
//                       })
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MESSAGES MODAL */}
//       <TicketComments
//         ticketId={commentOpen ? commentTicket?.id : null}
//         open={commentOpen}
//         onClose={() => {
//           setCommentOpen(false);
//           setCommentTicket(null);
//         }}
//       />
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ticketsApi } from "../../api/tickets";
import TicketComments from "../TicketComments";
import {
  MessageSquare,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const BASE_URL = "http://localhost:8083";

const TICKET_CATEGORIES = [
  "ALL",
  "ELECTRICAL",
  "PLUMBING",
  "HVAC",
  "IT",
  "CLEANING",
  "OTHER",
];
const STATUS_OPTIONS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY_OPTIONS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const statusWeight = { OPEN: 2, IN_PROGRESS: 2, RESOLVED: 1, CLOSED: 0 };

export default function TechTickets() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    category: "ALL",
    status: "ALL",
    priority: "ALL",
  });

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTicket, setCommentTicket] = useState(null);
  const [imageModal, setImageModal] = useState({ open: false, src: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);

  // ✅ NEW: deep-link query params from notification click
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketIdFromQuery = searchParams.get("ticketId");
  const openCommentsFromQuery = searchParams.get("openComments") === "true";

  useEffect(() => {
    fetchTickets();
  }, [filters.category]);

  const fetchTickets = async () => {
    try {
      let res;
      if (filters.category === "ALL") {
        res = await ticketsApi.getAll();
      } else {
        res = await ticketsApi.getByCategory(filters.category);
      }
      setTickets(res.data.data || []);
    } catch (err) {
      console.error(err);
      setTickets([]);
    }
  };

  // ✅ NEW: when coming from notification, open relevant ticket (and comment modal if needed)
  useEffect(() => {
    if (!ticketIdFromQuery) return;
    if (!tickets.length) return;

    const idNum = Number(ticketIdFromQuery);
    if (Number.isNaN(idNum)) return;

    const matched = tickets.find((t) => Number(t.id) === idNum);
    if (!matched) return;

    setSelectedTicket(matched);

    if (openCommentsFromQuery) {
      setCommentTicket(matched);
      setCommentOpen(true);
    }

    // clean URL query after handling once
    const timeout = setTimeout(() => {
      setSearchParams({}, { replace: true });
    }, 0);

    return () => clearTimeout(timeout);
  }, [ticketIdFromQuery, openCommentsFromQuery, tickets, setSearchParams]);

  const processedTickets = useMemo(() => {
    let filtered = [...tickets];

    if (filters.status !== "ALL") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== "ALL") {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    return filtered.sort((a, b) => {
      if (statusWeight[b.status] !== statusWeight[a.status]) {
        return statusWeight[b.status] - statusWeight[a.status];
      }
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }, [tickets, filters]);

  const handleStatusChange = async (ticketId, status) => {
    try {
      await ticketsApi.updateStatus(ticketId, status);
      await fetchTickets();

      setSelectedTicket((prev) =>
        prev && prev.id === ticketId ? { ...prev, status } : prev
      );
      setCommentTicket((prev) =>
        prev && prev.id === ticketId ? { ...prev, status } : prev
      );
    } catch (err) {
      alert("Error updating status");
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Assigned Tickets
        </h1>

        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
          <div className="flex items-center gap-2 px-2 border-r border-gray-100">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">
              Filters
            </span>
          </div>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="text-sm font-medium text-blue-600 bg-transparent outline-none cursor-pointer"
          >
            {TICKET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="text-sm font-medium text-green-600 bg-transparent outline-none cursor-pointer border-l pl-3 border-gray-100"
          >
            <option value="ALL">All Status</option>
            {STATUS_OPTIONS.slice(1).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="text-sm font-medium text-red-600 bg-transparent outline-none cursor-pointer border-l pl-3 border-gray-100"
          >
            <option value="ALL">All Priority</option>
            {PRIORITY_OPTIONS.slice(1).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedTickets.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTicket(t)}
            className={`bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col ${
              t.status === "CLOSED"
                ? "opacity-70 grayscale-[0.5]"
                : "border-gray-100 shadow-sm"
            }`}
          >
            <div
              className={`h-1.5 w-full ${
                t.priority === "CRITICAL"
                  ? "bg-red-500"
                  : t.priority === "HIGH"
                    ? "bg-orange-500"
                    : t.priority === "MEDIUM"
                      ? "bg-blue-500"
                      : "bg-gray-300"
              }`}
            />

            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getPriorityColor(t.priority)}`}
                >
                  {t.priority}
                </span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                {t.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {t.description}
              </p>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {t.images?.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith("http") ? img : `${BASE_URL}/${img}`}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageModal({ open: true, src: e.target.src });
                    }}
                  />
                ))}
                {t.images?.length > 3 && (
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                    +{t.images.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {t.reporterName?.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {t.reporterName}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentTicket(t);
                  setCommentOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {imageModal.open && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] backdrop-blur-sm transition-all"
          onClick={() => setImageModal({ open: false, src: "" })}
        >
          <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
            <CheckCircle2 size={32} />
          </button>
          <img
            src={imageModal.src}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}
            >
              {selectedTicket.priority} Priority
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-4 mb-2">
              {selectedTicket.title}
            </h2>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                <AlertCircle size={14} /> {selectedTicket.category}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                <Clock size={14} />{" "}
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl mb-6">
              <p className="text-gray-700 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 underline decoration-blue-500 decoration-2">
                Status Management
              </label>
              <select
                value={selectedTicket.status}
                onChange={(e) =>
                  handleStatusChange(selectedTicket.id, e.target.value)
                }
                className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.slice(1).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Evidence Images
              </label>
              <div className="grid grid-cols-4 gap-3">
                {selectedTicket.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `${BASE_URL}/${img}`}
                    className="w-full h-20 object-cover rounded-xl cursor-pointer hover:ring-2 ring-blue-500 transition-all"
                    onClick={() =>
                      setImageModal({
                        open: true,
                        src: img.startsWith("http")
                          ? img
                          : `${BASE_URL}/${img}`,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <TicketComments
        ticketId={commentOpen ? commentTicket?.id : null}
        open={commentOpen}
        onClose={() => {
          setCommentOpen(false);
          setCommentTicket(null);
        }}
      />
    </div>
  );
}