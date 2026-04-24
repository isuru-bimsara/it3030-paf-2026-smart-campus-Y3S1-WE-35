// // import { useEffect, useState } from 'react';
// // import { notificationsApi } from '../../api/notifications';

// // export default function AdminNotifications() {
// //   const [notifications, setNotifications] = useState([]);
// //   useEffect(() => {
// //     notificationsApi.getAll().then(res => setNotifications(res.data.data)).catch(() => {});
// //   }, []);

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold mb-4">Notifications</h1>
// //       <ul className="space-y-2">
// //         {notifications.map(n => (
// //           <li key={n.id} className="p-2 bg-white shadow">{n.message}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   )
// // }

// import { useEffect, useState, useCallback } from 'react';
// import { notificationsApi } from '../../api/notifications';
// import { 
//   Bell, CheckCheck, AlertCircle, Info, UserPlus, Settings, Clock, MoreVertical 
// } from 'lucide-react';

// export default function AdminNotifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. Logic for sorting (Extracted for re-use)
//   const sortNotifications = useCallback((data) => {
//     return [...data].sort((a, b) => {
//       // Unread (false) comes before Read (true)
//       if (a.read !== b.read) return a.read ? 1 : -1;
//       // Then newest date first
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//   }, []);

//   useEffect(() => {
//     notificationsApi.getAll()
//       .then(res => {
//         const data = res.data.data || [];
//         setNotifications(sortNotifications(data));
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [sortNotifications]);

//   // 2. Function to mark individual as read and RE-SORT
//   const handleMarkAsRead = async (id) => {
//     try {
//       // Optional: Call API here
//       // await notificationsApi.markAsRead(id);

//       setNotifications(prev => {
//         const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
//         return sortNotifications(updated);
//       });
//     } catch (err) {
//       console.error("Failed to update notification");
//     }
//   };

//   // 3. Function to mark all as read
//   const handleMarkAllRead = () => {
//     setNotifications(prev => {
//       const updated = prev.map(n => ({ ...n, read: true }));
//       return sortNotifications(updated);
//     });
//   };

//   const getNotificationStyle = (type) => {
//     switch (type) {
//       case 'ALERT': return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50 border-rose-100' };
//       case 'USER': return { icon: <UserPlus className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-100' };
//       case 'SYSTEM': return { icon: <Settings className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
//       default: return { icon: <Info className="w-5 h-5" />, color: 'text-slate-600 bg-slate-50 border-slate-100' };
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50/50 font-sans">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
//             <Bell className="w-8 h-8 text-indigo-600" />
//             System Notifications
//           </h1>
//           <p className="text-slate-500 mt-1 font-medium">Monitor system logs and user alerts.</p>
//         </div>
        
//         <button 
//           onClick={handleMarkAllRead}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
//         >
//           <CheckCheck className="w-4 h-4" />
//           Mark all read
//         </button>
//       </div>

//       <div className="space-y-4">
//         {loading ? (
//           <div className="py-20 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">Fetching Logs...</div>
//         ) : notifications.map((n) => {
//           const style = getNotificationStyle(n.type);
//           return (
//             <div 
//               key={n.id} 
//               onClick={() => !n.read && handleMarkAsRead(n.id)}
//               className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500 ${
//                 n.read 
//                 ? 'bg-white border-slate-100 opacity-60 grayscale-[0.5]' 
//                 : 'bg-white border-indigo-100 shadow-md shadow-indigo-50/50 ring-1 ring-indigo-50 cursor-pointer hover:shadow-lg'
//               }`}
//             >
//               {/* Vertical Priority Indicator */}
//               {!n.read && (
//                 <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
//               )}

//               <div className={`p-3 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-110 ${style.color}`}>
//                 {style.icon}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? 'text-slate-400' : 'text-indigo-600'}`}>
//                     {n.type || 'General'}
//                   </span>
//                   <div className="flex items-center gap-2 text-slate-400">
//                     <Clock className="w-3 h-3" />
//                     <span className="text-xs font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                   </div>
//                 </div>
                
//                 <h3 className={`text-sm leading-relaxed ${n.read ? 'text-slate-600 font-medium' : 'text-slate-900 font-bold'}`}>
//                   {n.message}
//                 </h3>
//               </div>

//               <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400">
//                 <MoreVertical className="w-4 h-4" />
//               </button>
//             </div>
//           );
//         })}

//         {!loading && notifications.length === 0 && (
//           <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
//             <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//             <h3 className="text-slate-800 font-bold text-lg">Clean slate!</h3>
//             <p className="text-slate-400 text-sm">No notifications to show right now.</p>
//           </div>
//         )}
//       </div>

//       <footer className="mt-12 pt-6 border-t border-slate-100 text-center">
//         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
//           Internal Administrative Log • Smart-Uni System
//         </p>
//       </footer>
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { notificationsApi } from "../../api/notifications";
import {
  Bell, CheckCheck, AlertCircle, Info, UserPlus, Settings, Clock, MoreVertical
} from "lucide-react";
import useNotificationClick from "../../utils/useNotificationClick";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNotificationClick = useNotificationClick(setNotifications, "ADMIN");

  const sortNotifications = useCallback((data) => {
    return [...data].sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, []);

  useEffect(() => {
    notificationsApi.getAll()
      .then((res) => {
        const data = res.data.data || [];
        setNotifications(sortNotifications(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sortNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, read: true }));
        return sortNotifications(updated);
      });
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "ALERT": return { icon: <AlertCircle className="w-5 h-5" />, color: "text-rose-600 bg-rose-50 border-rose-100" };
      case "USER": return { icon: <UserPlus className="w-5 h-5" />, color: "text-blue-600 bg-blue-50 border-blue-100" };
      case "SYSTEM": return { icon: <Settings className="w-5 h-5" />, color: "text-amber-600 bg-amber-50 border-amber-100" };
      default: return { icon: <Info className="w-5 h-5" />, color: "text-slate-600 bg-slate-50 border-slate-100" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50/50 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Bell className="w-8 h-8 text-indigo-600" />
            System Notifications
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor system logs and user alerts.</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest text-xs">
            Fetching Logs...
          </div>
        ) : notifications.map((n) => {
          const style = getNotificationStyle(n.type);
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
                    {n.type || "General"}
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

              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {!loading && notifications.length === 0 && (
          <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-800 font-bold text-lg">Clean slate!</h3>
            <p className="text-slate-400 text-sm">No notifications to show right now.</p>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Internal Administrative Log • Smart-Uni System
        </p>
      </footer>
    </div>
  );
}