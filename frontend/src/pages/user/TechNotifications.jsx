// import { useEffect, useState, useRef } from "react";
// import { notificationsApi } from "../../api/notifications";
// import {
//   Bell,
//   CheckCheck,
//   Clock,
//   Ticket,
//   Calendar,
//   Info,
//   Circle,
// } from "lucide-react";
// import useNotificationClick from "../../utils/useNotificationClick";

// const POLL_MS = 10000;

// export default function TechNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const pollRef = useRef(null);

//   const handleNotificationClick = useNotificationClick(
//     setNotifications,
//     "TECHNICIAN",
//   );

//   const load = async () => {
//     try {
//       const res = await notificationsApi.getMyNotifications();
//       const data = res.data?.data || [];
//       const sorted = [...data].sort((a, b) => {
//         if (a.read !== b.read) return a.read ? 1 : -1;
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       setNotifications(sorted);
//     } catch (e) {
//       console.error("Load notifications failed", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     pollRef.current = setInterval(load, POLL_MS);
//     return () => clearInterval(pollRef.current);
//   }, []);

//   const handleMarkAllRead = async () => {
//     try {
//       await notificationsApi.markAllAsRead();
//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const getIconByType = (type) => {
//     if (String(type).startsWith("TICKET") || type === "COMMENT_ADDED") {
//       return <Ticket className="w-5 h-5 text-rose-500" />;
//     }
//     if (String(type).startsWith("BOOKING")) {
//       return <Calendar className="w-5 h-5 text-emerald-500" />;
//     }
//     return <Info className="w-5 h-5 text-blue-500" />;
//   };

//   const getRelativeTime = (date) => {
//     const now = new Date();
//     const diff = Math.floor((now - new Date(date)) / 1000);
//     if (diff < 60) return "Just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 min-h-screen">
//       <div className="flex justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
//             <Bell className="w-8 h-8 text-blue-600" />
//             Technician Notifications
//           </h1>
//           <p className="text-gray-500 mt-1">
//             {unreadCount > 0
//               ? `You have ${unreadCount} unread updates.`
//               : "You're all caught up!"}
//           </p>
//         </div>

//         {unreadCount > 0 && (
//           <button
//             onClick={handleMarkAllRead}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
//           >
//             <CheckCheck className="w-4 h-4" />
//             Mark all as read
//           </button>
//         )}
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         {loading && notifications.length === 0 ? (
//           <div className="py-20 text-center text-gray-400">
//             Syncing notifications...
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-50">
//             {notifications.map((n) => (
//               <div
//                 key={n.id}
//                 onClick={() => handleNotificationClick(n)}
//                 className={`group relative p-5 transition-all flex gap-4 items-start cursor-pointer ${
//                   n.read
//                     ? "bg-white opacity-80"
//                     : "bg-blue-50/40 hover:bg-blue-50"
//                 }`}
//               >
//                 {!n.read && (
//                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
//                 )}
//                 <div
//                   className={`p-3 rounded-xl ${n.read ? "bg-gray-100" : "bg-white shadow-sm border border-blue-100"}`}
//                 >
//                   {getIconByType(n.type)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p
//                     className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-bold"}`}
//                   >
//                     {n.message}
//                   </p>
//                   <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
//                     <Clock className="w-3 h-3" />
//                     {getRelativeTime(n.createdAt)}
//                     <span>• {n.type}</span>
//                   </div>
//                 </div>
//                 {!n.read && (
//                   <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600 animate-pulse" />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef, useMemo } from "react";
import { notificationsApi } from "../../api/notifications";
import {
  Bell,
  CheckCheck,
  Clock,
  Ticket,
  Calendar,
  Info,
  Circle,
  CheckCircle2,
  BellOff,
  ChevronRight,
  Trash2,
} from "lucide-react";
import useNotificationClick from "../../utils/useNotificationClick";
import { useNotifications } from "../../context/NotificationContext";


const POLL_MS = 10000;

export default function TechNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const { fetchUnreadCount } = useNotifications();


  const handleNotificationClick = useNotificationClick(setNotifications, "TECHNICIAN");

  const load = async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      const data = res.data?.data || [];
      // Sort: Unread at the top, then by date
      const sorted = [...data].sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setNotifications(sorted);
    } catch (e) {
      console.error("Load notifications failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetchUnreadCount();
    } catch (e) {

      console.error(e);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this notification?")) return;
    try {
      await notificationsApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
    } catch (e) {

      console.error(e);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?"))
      return;
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
      fetchUnreadCount();
    } catch (e) {

      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationStyle = (type, read) => {
    const isTicket = String(type).startsWith("TICKET") || type === "COMMENT_ADDED";
    const isBooking = String(type).startsWith("BOOKING");

    if (isTicket) {
      return { 
        icon: <Ticket className="w-5 h-5" />, 
        color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-rose-600 bg-rose-50 border-rose-100" 
      };
    }
    if (isBooking) {
      return { 
        icon: <Calendar className="w-5 h-5" />, 
        color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-emerald-600 bg-emerald-50 border-emerald-100" 
      };
    }
    
    switch (type) {
      case "ALERT": return { icon: <AlertCircle className="w-5 h-5" />, color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-rose-600 bg-rose-50 border-rose-100" };
      case "USER": return { icon: <UserPlus className="w-5 h-5" />, color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-blue-600 bg-blue-50 border-blue-100" };
      case "SYSTEM": return { icon: <Settings className="w-5 h-5" />, color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-amber-600 bg-amber-50 border-amber-100" };
      default: return { icon: <Info className="w-5 h-5" />, color: read ? "text-slate-400 bg-slate-50 border-slate-100" : "text-slate-600 bg-slate-50 border-slate-100" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50/50 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Bell className="w-8 h-8 text-indigo-600" />
            Technician Alerts
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor system logs and service assignments.</p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-white border border-rose-100 rounded-xl hover:bg-rose-50 transition-all shadow-sm active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">
            Fetching Logs...
          </div>
        ) : notifications.map((n) => {
          const style = getNotificationStyle(n.type, n.read);
          return (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                n.read
                  ? "bg-white border-slate-100 opacity-60 grayscale-[0.5]"
                  : "bg-white border-indigo-100 shadow-md shadow-indigo-50/50 ring-1 ring-indigo-50 cursor-pointer hover:shadow-lg"
              }`}
            >
              {!n.read && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
              )}

              <div className={`p-3 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-110 ${style.color}`}>
                {style.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? "text-slate-400" : "text-indigo-600"}`}>
                    {n.type?.replace(/_/g, " ") || "General"}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <h3 className={`text-sm leading-relaxed ${n.read ? "text-slate-600 font-medium" : "text-slate-900 font-bold"}`}>
                  {n.message}
                </h3>
              </div>

              <button
                onClick={(e) => handleDelete(e, n.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 rounded-lg transition-all text-slate-300 hover:text-rose-500"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {!loading && notifications.length === 0 && (
          <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <BellOff className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-800 font-bold text-lg">System Clear</h3>
            <p className="text-slate-400 text-sm">No new technician alerts to show.</p>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Technician Assignment Log • Smart-Uni System
        </p>
      </footer>
    </div>
  );
}