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
  Sparkles,
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

  const notificationStats = useMemo(() => {
    const ticketCount = notifications.filter((n) =>
      String(n.type || "").startsWith("TICKET"),
    ).length;
    const bookingCount = notifications.filter((n) =>
      String(n.type || "").startsWith("BOOKING"),
    ).length;
    const readCount = notifications.filter((n) => n.read).length;

    return [
      {
        label: "Unread",
        value: unreadCount,
        detail: "Fresh updates waiting for your attention",
        icon: Bell,
      },
      {
        label: "Ticket Alerts",
        value: ticketCount,
        detail: "Support-related updates and activity",
        icon: Ticket,
      },
      {
        label: "Booking Alerts",
        value: bookingCount,
        detail: "Reservation approvals and booking changes",
        icon: Calendar,
      },
      {
        label: "Read",
        value: readCount,
        detail: "Notifications already reviewed",
        icon: CheckCheck,
      },
    ];
  }, [notifications, unreadCount]);

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
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <style>{`
        @keyframes notificationFadeUp {
          0% { opacity: 0; transform: translate3d(0, 16px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes notificationFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        @keyframes notificationGradientStream {
          0% { transform: translateX(-20%); opacity: 0.55; }
          50% { transform: translateX(18%); opacity: 1; }
          100% { transform: translateX(-20%); opacity: 0.55; }
        }

        .notification-fade-up {
          animation: notificationFadeUp 700ms ease-out both;
        }

        .notification-float {
          animation: notificationFloat 8s ease-in-out infinite;
        }

        .notification-gradient-line {
          animation: notificationGradientStream 8.5s ease-in-out infinite;
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[38px] border border-white/60 bg-[linear-gradient(135deg,#faf5ff_0%,#f3e8ff_40%,#eef2ff_100%)] px-6 py-8 shadow-[0_30px_95px_rgba(124,58,237,0.14)] md:px-8 xl:px-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-purple-300/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-24 bottom-0 h-44 w-44 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
          <div className="notification-fade-up space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-violet-700 shadow-sm backdrop-blur-xl">
                <Bell className="h-3.5 w-3.5" />
                Premium Notification Center
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-violet-700 shadow-[0_14px_34px_rgba(124,58,237,0.10)] backdrop-blur-xl">
                SMART ALERTS
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold tracking-[0.08em] text-violet-600">
                Stay connected to everything important
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.06em] text-slate-950 md:text-5xl xl:text-6xl">
                Every update,
                <span className="block bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_42%,#8B5CF6_72%,#A855F7_100%)] bg-clip-text tracking-[-0.05em] text-transparent">
                  beautifully organized
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Follow booking approvals, support activity, role changes, and
                every system update from one polished notification workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {notificationStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-[0_20px_60px_rgba(124,58,237,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(124,58,237,0.18)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-[linear-gradient(135deg,#ede9fe_0%,#f5f3ff_100%)] p-3 text-violet-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                        Live
                      </span>
                    </div>
                    <p className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      {stat.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="h-[6px] overflow-hidden rounded-full bg-white/60 shadow-inner">
              <div className="notification-gradient-line h-full w-[55%] rounded-full bg-[linear-gradient(90deg,#6D28D9_0%,#7C3AED_35%,#8B5CF6_70%,#A855F7_100%)] shadow-[0_0_30px_rgba(124,58,237,0.35)]" />
            </div>
          </div>

          <div className="notification-float notification-fade-up rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-[0_28px_80px_rgba(124,58,237,0.14)] backdrop-blur-2xl" style={{ animationDelay: "120ms" }}>
            <div className="rounded-[30px] bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_42%,#8B5CF6_74%,#A855F7_100%)] p-6 text-white shadow-[0_22px_56px_rgba(124,58,237,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-100">
                    Notification Snapshot
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight">
                    {unreadCount > 0
                      ? "You have fresh updates waiting"
                      : "You are fully caught up right now"}
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 px-4 py-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                    Today
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/95">
                    {grouped.Today.length} alerts
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                    New
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/95">
                    {unreadCount} unread
                  </p>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/90">
                Tap any card to open the related page instantly
                <CheckCheck className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {loading && notifications.length === 0 ? (
          <div className="rounded-[32px] border border-white/60 bg-white/72 px-8 py-20 text-center shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
              <div className="h-8 w-8 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
            </div>
            <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
              Fetching updates...
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(
            ([title, items]) =>
              items.length > 0 && (
                <div key={title} className="space-y-4">
                  <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    {title}
                  </h3>

                  <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/72 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl">
                    <div className="divide-y divide-slate-100">
                      {items.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`group relative flex cursor-pointer items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-50/60 ${
                            !n.read ? "bg-indigo-50/30" : "bg-white/80"
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
                                ? "scale-105 border border-indigo-100 bg-white shadow-sm"
                                : "border border-transparent bg-slate-50"
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
                                <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
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
          <div className="rounded-[32px] border-2 border-dashed border-violet-100 bg-white/72 py-24 text-center shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
              <BellOff className="w-8 h-8 text-violet-300" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              No notifications yet
            </h2>
            <p className="text-sm text-slate-500">
              We'll let you know when something happens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
