// frontend/src/pages/ops/OpsNotifications.jsx
// Notifications page for OPERATION_MANAGER role.

import { useEffect, useState, useCallback } from "react";
import { notificationsApi } from "../../api/notifications";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  Info,
  UserPlus,
  Settings,
  Clock,
  Inbox,
} from "lucide-react";

export default function OpsNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL | UNREAD | READ

  const sortNotifications = useCallback((data) => {
    return [...data].sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, []);

  useEffect(() => {
    notificationsApi
      .getAll()
      .then((res) => {
        const data = res.data.data || [];
        setNotifications(sortNotifications(data));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sortNotifications]);

  const handleMarkAsRead = async (n) => {
    if (n.read) return;
    try {
      await notificationsApi.markAsRead?.(n.id).catch(() => {});
      setNotifications((prev) => {
        const updated = prev.map((item) =>
          item.id === n.id ? { ...item, read: true } : item
        );
        return sortNotifications(updated);
      });
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, read: true }));
        return sortNotifications(updated);
      });
    } catch {
      console.error("Failed to mark all as read");
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case "ALERT":
        return { icon: <AlertCircle className="w-5 h-5" />, color: "text-rose-600 bg-rose-50 border-rose-100", accent: "bg-rose-500" };
      case "USER":
        return { icon: <UserPlus className="w-5 h-5" />, color: "text-blue-600 bg-blue-50 border-blue-100", accent: "bg-blue-500" };
      case "SYSTEM":
        return { icon: <Settings className="w-5 h-5" />, color: "text-amber-600 bg-amber-50 border-amber-100", accent: "bg-amber-500" };
      default:
        return { icon: <Info className="w-5 h-5" />, color: "text-emerald-600 bg-emerald-50 border-emerald-100", accent: "bg-emerald-500" };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "READ") return n.read;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
            <Bell className="text-white w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Notifications</h1>
            <p className="text-slate-500">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-emerald-700 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { key: "ALL", label: "All" },
          { key: "UNREAD", label: `Unread (${unreadCount})` },
          { key: "READ", label: "Read" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === tab.key
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-100 py-24 text-center">
            <Inbox className="w-14 h-14 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-700 font-bold text-lg">
              {filter === "UNREAD" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {filter === "UNREAD"
                ? "Check the 'All' tab to see all messages."
                : "Notifications will appear here when actions occur."}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const style = getStyle(n.type);
            return (
              <div
                key={n.id}
                onClick={() => handleMarkAsRead(n)}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  n.read
                    ? "bg-white border-slate-100 opacity-60"
                    : "bg-white border-emerald-100 shadow-md shadow-emerald-50/60 hover:shadow-lg ring-1 ring-emerald-50"
                }`}
              >
                {/* Unread accent bar */}
                {!n.read && (
                  <div className={`absolute left-0 top-4 bottom-4 w-1 ${style.accent} rounded-r-full`} />
                )}

                {/* Icon */}
                <div className={`p-3 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-110 ${style.color}`}>
                  {style.icon}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? "text-slate-400" : "text-emerald-600"}`}>
                      {n.type || "General"}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs text-slate-300 ml-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed ${n.read ? "text-slate-500 font-medium" : "text-slate-800 font-bold"}`}>
                    {n.message}
                  </p>

                  {!n.read && (
                    <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                      Unread — click to mark as read
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Operations Manager Notification Center • Smart-Uni
        </p>
      </footer>
    </div>
  );
}
