// frontend/src/layouts/AdminLayout.jsx

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  CalendarCheck,
  Box,
  Ticket,
  Bell,
  Users,
  LogOut,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";


const NAV_ITEMS = [
  { to: "/admin/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/bookings",      icon: CalendarCheck,   label: "Bookings" },
  { to: "/admin/tickets",       icon: Ticket,          label: "Tickets" },
  { to: "/admin/users",         icon: Users,           label: "Users" },
  { to: "/admin/notifications", icon: Bell,            label: "Notifications" },
  { to: "/admin/profile",       icon: Settings,        label: "Profile Settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  const getPictureSrc = (picture) => {
    if (!picture) return null;
    return picture.startsWith("http") ? picture : `http://localhost:8083${picture}`;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        {/* LOGO */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              Admin<span className="text-indigo-600">Panel</span>
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Admin Menu
          </p>

          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={navItemClass} id={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="relative">
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {label}
            </NavLink>
          ))}

        </nav>

        {/* PROFILE + LOGOUT */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-3">
            {user?.picture ? (
              <img
                src={getPictureSrc(user.picture)}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || "admin@email.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-semibold hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <p className="text-slate-500 font-medium">
            Welcome,{" "}
            <span className="text-slate-800 font-bold">{user?.name || "Admin"}</span>
          </p>

          <NavLink
            to="/admin/notifications"
            className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>

        </header>

        {/* CONTENT */}
        <section className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}