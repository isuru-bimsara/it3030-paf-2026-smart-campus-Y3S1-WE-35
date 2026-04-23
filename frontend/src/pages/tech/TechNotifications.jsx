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
  ChevronRight
} from "lucide-react";
import useNotificationClick from "../../utils/useNotificationClick";

const POLL_MS = 10000;

export default function TechNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

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
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconByType = (type, isRead) => {
    const iconClass = "w-5 h-5";
    if (String(type).startsWith("TICKET") || type === "COMMENT_ADDED") {
      return <Ticket className={`${iconClass} ${isRead ? 'text-slate-400' : 'text-rose-500'}`} />;
    }
    if (String(type).startsWith("BOOKING")) {
      return <Calendar className={`${iconClass} ${isRead ? 'text-slate-400' : 'text-emerald-500'}`} />;
    }
    return <Info className={`${iconClass} ${isRead ? 'text-slate-400' : 'text-indigo-600'}`} />;
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            Service Alerts
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-indigo-100">
                {unreadCount} NEW
              </span>
            )}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            System logs and technician assignment updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-slate-200 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Clear All Alerts
          </button>
        )}
      </div>

      {/* NOTIFICATION BOX */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Updating Logs...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`group relative p-5 transition-all flex gap-4 items-start cursor-pointer hover:bg-slate-50 ${
                  !n.read ? "bg-indigo-50/30" : "bg-white"
                }`}
              >
                {/* Status Indicator Bar */}
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                )}

                {/* Icon Container */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  !n.read 
                    ? "bg-white border-indigo-100 shadow-sm" 
                    : "bg-slate-50 border-transparent"
                }`}>
                  {getIconByType(n.type, n.read)}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <p className={`text-[15px] leading-relaxed ${
                      !n.read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                    }`}>
                      {n.message}
                    </p>
                    
                    {/* Read Mark / Action Required Mark */}
                    {n.read ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Processed
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md uppercase tracking-wider">
                        <Circle className="w-2.5 h-2.5 fill-indigo-600" /> Action Required
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs mt-2">
                    <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {getRelativeTime(n.createdAt)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {n.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Click Hint Icon */}
                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellOff className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-slate-800 font-bold">No active alerts</h3>
                <p className="text-slate-500 text-sm">System is running normally.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}