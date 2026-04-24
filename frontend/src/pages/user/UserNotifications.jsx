// // import { useEffect, useState, useRef } from "react";
// // import { notificationsApi } from "../../api/notifications";
// // import { CheckCheck, Bell, BellOff, Circle } from "lucide-react"; // Optional: install lucide-react

// // const POLL_MS = 10000; // 10 seconds is safer for polling

// // export default function UserNotifications() {
// //   const [notifications, setNotifications] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const pollRef = useRef(null);

// //   const load = async () => {
// //     try {
// //       const res = await notificationsApi.getMyNotifications();
// //       const rawData = res.data?.data || [];

// //       // PRIORITIZE: Sort by Unread first, then by Date (Newest first)
// //       const sorted = [...rawData].sort((a, b) => {
// //         if (a.read !== b.read) return a.read ? 1 : -1;
// //         return new Date(b.createdAt) - new Date(a.createdAt);
// //       });

// //       setNotifications(sorted);
// //     } catch (e) {
// //       console.error("Load notifications failed", e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     load();
// //     pollRef.current = setInterval(load, POLL_MS);
// //     return () => clearInterval(pollRef.current);
// //   }, []);

// //   const handleMarkAsRead = async (id) => {
// //     try {
// //       await notificationsApi.markAsRead(id);
// //       // Optimistic Update: Update UI immediately
// //       setNotifications((prev) =>
// //         prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
// //       );
// //     } catch (e) {
// //       console.error("Failed to mark as read", e);
// //     }
// //   };

// //   const handleMarkAllRead = async () => {
// //     try {
// //       await notificationsApi.markAllAsRead();
// //       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
// //     } catch (e) {
// //       console.error("Failed to mark all read", e);
// //     }
// //   };

// //   const unreadCount = notifications.filter((n) => !n.read).length;

// //   return (
// //     <div className="max-w-2xl mx-auto p-4">
// //       <div className="flex justify-between items-end mb-6">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //             <Bell className="w-6 h-6 text-blue-600" />
// //             Notifications
// //           </h1>
// //           <p className="text-sm text-gray-500 mt-1">
// //             {unreadCount > 0
// //               ? `You have ${unreadCount} unread messages`
// //               : "No new notifications"}
// //           </p>
// //         </div>

// //         {unreadCount > 0 && (
// //           <button
// //             onClick={handleMarkAllRead}
// //             className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
// //           >
// //             <CheckCheck className="w-4 h-4" />
// //             Mark all as read
// //           </button>
// //         )}
// //       </div>

// //       {loading && notifications.length === 0 ? (
// //         <div className="py-20 text-center text-gray-400">
// //           <div className="animate-pulse">Fetching updates...</div>
// //         </div>
// //       ) : (
// //         <div className="space-y-3">
// //           {notifications.map((n) => (
// //             <div
// //               key={n.id}
// //               onClick={() => !n.read && handleMarkAsRead(n.id)}
// //               className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
// //                 n.read
// //                   ? "bg-white border-gray-100 opacity-75"
// //                   : "bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300"
// //               }`}
// //             >
// //               <div className="flex gap-4">
// //                 {/* Unread Status Dot */}
// //                 {!n.read && (
// //                   <div className="mt-1.5">
// //                     <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />
// //                   </div>
// //                 )}

// //                 <div className="flex-1">
// //                   <div
// //                     className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}
// //                   >
// //                     {n.message}
// //                   </div>
// //                   <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
// //                     <span>{formatDate(n.createdAt)}</span>
// //                     {!n.read && (
// //                       <span className="text-blue-600 font-medium">New</span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}

// //           {notifications.length === 0 && (
// //             <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
// //               <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
// //               <p className="text-gray-500 font-medium">All caught up!</p>
// //               <p className="text-sm text-gray-400">
// //                 We'll notify you when something happens.
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // Helper for real-world date formatting
// // function formatDate(dateString) {
// //   const date = new Date(dateString);
// //   return new Intl.DateTimeFormat("en-US", {
// //     month: "short",
// //     day: "numeric",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   }).format(date);
// // }

// import { useEffect, useState, useRef, useMemo } from "react";
// import { notificationsApi, unwrapApiData } from "../../api/notifications";
// import {
//   Bell, CheckCheck, Clock, Ticket, Calendar, Info, Circle, BellOff
// } from "lucide-react";
// import useNotificationClick from "../../utils/useNotificationClick";

// const POLL_MS = 10000;

// export default function UserNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const pollRef = useRef(null);

//   const handleNotificationClick = useNotificationClick(setNotifications, "USER");

//   const sortNotifications = (data) =>
//     [...data].sort((a, b) => {
//       if (a.read !== b.read) return a.read ? 1 : -1;
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });

//   const load = async () => {
//     try {
//       const res = await notificationsApi.getMyNotifications();
//       const data = unwrapApiData(res, []);
//       setNotifications(sortNotifications(data));
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
//       setNotifications((prev) => sortNotifications(prev.map((n) => ({ ...n, read: true }))));
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

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
//             Notifications
//           </h1>
//           <p className="text-gray-500 mt-1">
//             {unreadCount > 0 ? `You have ${unreadCount} unread updates.` : "You're all caught up!"}
//           </p>
//         </div>

//         {unreadCount > 0 && (
//           <button
//             onClick={handleMarkAllRead}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
//           >
//             <CheckCheck className="w-4 h-4" />
//             Mark all as read
//           </button>
//         )}
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         {loading && notifications.length === 0 ? (
//           <div className="py-20 text-center text-gray-400">Syncing notifications...</div>
//         ) : (
//           <div className="divide-y divide-gray-50">
//             {notifications.map((n) => (
//               <div
//                 key={n.id}
//                 onClick={() => handleNotificationClick(n)}
//                 className={`group relative p-5 transition-all flex gap-4 items-start cursor-pointer ${
//                   n.read ? "bg-white opacity-80" : "bg-blue-50/40 hover:bg-blue-50"
//                 }`}
//               >
//                 {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />}
//                 <div className={`p-3 rounded-xl ${n.read ? "bg-gray-100" : "bg-white shadow-sm border border-blue-100"}`}>
//                   {getIconByType(n.type)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-bold"}`}>{n.message}</p>
//                   <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {getRelativeTime(n.createdAt)}
//                     </span>
//                     <span>• {n.type}</span>
//                     {!n.read && <Circle className="w-2.5 h-2.5 fill-blue-600 text-blue-600" />}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {notifications.length === 0 && (
//               <div className="py-24 text-center">
//                 <BellOff className="w-8 h-8 text-gray-300 mx-auto mb-2" />
//                 <p className="text-gray-500">No notifications.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef, useMemo } from "react";
import { notificationsApi, unwrapApiData } from "../../api/notifications";
import {
  Bell,
  CheckCheck,
  Clock,
  Ticket,
  Calendar,
  Info,
  Circle,
  BellOff,
  Check,
} from "lucide-react";
import useNotificationClick from "../../utils/useNotificationClick";

const POLL_MS = 10000;

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const handleNotificationClick = useNotificationClick(
    setNotifications,
    "USER",
  );

  const sortNotifications = (data) =>
    [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const load = async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      const data = unwrapApiData(res, []);
      setNotifications(sortNotifications(data));
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

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  // Grouping logic for "Real World" feel
  const grouped = useMemo(() => {
    const sections = { Today: [], Yesterday: [], Older: [] };
    const now = new Date();

    notifications.forEach((n) => {
      const d = new Date(n.createdAt);
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) sections.Today.push(n);
      else if (diffDays === 1) sections.Yesterday.push(n);
      else sections.Older.push(n);
    });
    return sections;
  }, [notifications]);

  const getIconByType = (type, read) => {
    const baseClass = "w-5 h-5";
    if (String(type).startsWith("TICKET"))
      return (
        <Ticket
          className={`${baseClass} ${read ? "text-slate-400" : "text-rose-500"}`}
        />
      );
    if (String(type).startsWith("BOOKING"))
      return (
        <Calendar
          className={`${baseClass} ${read ? "text-slate-400" : "text-emerald-500"}`}
        />
      );
    return (
      <Info
        className={`${baseClass} ${read ? "text-slate-400" : "text-indigo-500"}`}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[11px] px-2.5 py-0.5 rounded-full shadow-lg shadow-indigo-200">
                {unreadCount} NEW
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Stay updated with your bookings and ticket status.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 bg-white border border-slate-200 rounded-xl transition-all shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-8">
        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Fetching updates...
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(
            ([title, items]) =>
              items.length > 0 && (
                <div key={title} className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                    {title}
                  </h3>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100">
                      {items.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`group relative p-5 transition-all flex gap-4 items-start cursor-pointer hover:bg-slate-50/80 ${
                            !n.read ? "bg-indigo-50/30" : "bg-white"
                          }`}
                        >
                          {/* New Status Vertical Bar */}
                          {!n.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                          )}

                          {/* Icon Box */}
                          <div
                            className={`p-3 rounded-xl transition-all ${
                              !n.read
                                ? "bg-white shadow-sm border border-indigo-100 scale-105"
                                : "bg-slate-50 border border-transparent"
                            }`}
                          >
                            {getIconByType(n.type, n.read)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-4">
                              <p
                                className={`text-sm leading-relaxed ${
                                  !n.read
                                    ? "text-slate-900 font-bold"
                                    : "text-slate-500 font-medium"
                                }`}
                              >
                                {n.message}
                              </p>

                              {/* Read/Unread Badge */}
                              {n.read ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                                  <Check className="w-3 h-3" /> Read
                                </span>
                              ) : (
                                <div className="mt-1">
                                  <Circle className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600 animate-pulse" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs mt-2">
                              <span className="flex items-center gap-1 text-slate-400 font-semibold">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="text-slate-200">|</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                {n.type.replace(/_/g, " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
          )
        )}

        {notifications.length === 0 && !loading && (
          <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-slate-800 font-bold text-lg">
              No notifications yet
            </h2>
            <p className="text-slate-500 text-sm">
              We'll let you know when something happens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
