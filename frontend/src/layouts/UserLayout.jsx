

// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axios";
// import {
//   LayoutDashboard,
//   CalendarCheck,
//   Box,
//   Ticket,
//   Bell,
//   LogOut,
//   UserCircle,
//   Settings,
// } from "lucide-react";
// import { useNotifications } from "../context/NotificationContext";
// import { Link } from "react-router-dom";


// export default function UserLayout() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const { unreadCount } = useNotifications();


//   // Fetch logged-in user once
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get("/auth/me");
//         setUser(res.data.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   // Active link style
//   const navItemClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
//       isActive
//         ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
//         : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
//     }`;

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans">
//       {/* SIDEBAR */}
//       <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
//         {/* Logo */}
//         <div className="p-8">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
//               <Box className="text-white w-6 h-6" />
//             </div>
//             <span className="text-xl font-black text-slate-800 tracking-tight">
//               Reserva<span className="text-indigo-600">Hub</span>
//             </span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 space-y-2">
//           <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
//             Main Menu
//           </p>

//           <NavLink to="/user/dashboard" className={navItemClass}>
//             <LayoutDashboard className="w-5 h-5" />
//             <span className="font-semibold">Dashboard</span>
//           </NavLink>

//           <NavLink to="/user/bookings" className={navItemClass}>
//             <CalendarCheck className="w-5 h-5" />
//             <span className="font-semibold">My Bookings</span>
//           </NavLink>

//           <NavLink to="/user/resources" className={navItemClass}>
//             <Box className="w-5 h-5" />
//             <span className="font-semibold">Resources</span>
//           </NavLink>

//           <NavLink to="/user/tickets" className={navItemClass}>
//             <Ticket className="w-5 h-5" />
//             <span className="font-semibold">My Tickets</span>
//           </NavLink>

//           <NavLink to="/user/notifications" className={navItemClass}>
//             <div className="relative">
//               <Bell className="w-5 h-5" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
//                   {unreadCount > 9 ? "9+" : unreadCount}
//                 </span>
//               )}
//             </div>
//             <span className="font-semibold">Notifications</span>
//           </NavLink>


//           <NavLink to="/user/profile" className={navItemClass}>
//             <Settings className="w-5 h-5" />
//             <span className="font-semibold">Profile Settings</span>
//           </NavLink>
//         </nav>

//         {/* Profile + Logout */}
//         <div className="p-4 border-t border-slate-100">
//           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
//             {user?.picture ? (
//               <img
//                 src={
//                   user.picture?.startsWith("http")
//                     ? user.picture
//                     : `http://localhost:8083${user.picture}`
//                 }
//                 alt="profile"
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <UserCircle className="w-10 h-10 text-slate-400" />
//             )}
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-bold text-slate-800 truncate">
//                 {user?.name || "User"}
//               </p>
//               <p className="text-xs text-slate-500 truncate">
//                 {user?.email || "you@example.com"}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-semibold hover:bg-rose-50 rounded-xl transition-colors"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* TOP BAR */}
//         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
//           <h1 className="text-slate-500 font-medium">
//             Welcome,{" "}
//             <span className="text-slate-800 font-bold">
//               {user?.name || "User"}
//             </span>
//           </h1>
//           <Link
//             to="/user/notifications"
//             className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
//           >
//             <Bell className="w-6 h-6" />
//             {unreadCount > 0 && (
//               <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
//                 {unreadCount > 9 ? "9+" : unreadCount}
//               </span>
//             )}
//           </Link>

//         </header>

//         {/* CONTENT */}
//         <section className="flex-1 overflow-y-auto p-8">
//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// }


// src/layouts/UserLayout.jsx
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  LayoutDashboard,
  CalendarCheck,
  Box,
  Ticket,
  Bell,
  LogOut,
  UserCircle,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function UserLayout() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth(); // Assuming setUser is in context
  const { unreadCount } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Modern Tab Style
  const navItemClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-1 py-4 text-sm font-bold transition-all duration-200 border-b-2 ${
      isActive
        ? "text-indigo-600 border-indigo-600"
        : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link to="/user/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                  <Box className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-black text-slate-800 tracking-tight hidden md:block">
                  Reserva<span className="text-indigo-600">Hub</span>
                </span>
              </Link>

              {/* Desktop Tabs */}
              <nav className="hidden lg:flex items-center gap-6 h-16">
                <NavLink to="/user/dashboard" className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/user/resources" className={navItemClass}>
                  <Box className="w-4 h-4" />
                  Resources
                </NavLink>
                <NavLink to="/user/bookings" className={navItemClass}>
                  <CalendarCheck className="w-4 h-4" />
                  My Bookings
                </NavLink>
                <NavLink to="/user/tickets" className={navItemClass}>
                  <Ticket className="w-4 h-4" />
                  Support
                </NavLink>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-5">
              {/* Notification Bell */}
              <Link
                to="/user/notifications"
                className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {user?.picture ? (
                      <img
                        src={user.picture?.startsWith("http") ? user.picture : `http://localhost:8083${user.picture}`}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                        <p className="text-sm font-bold text-slate-800 truncate mt-1">{user?.name || "User"}</p>
                      </div>
                      
                      <Link 
                        to="/user/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Optional: Page Breadcrumb or Greeting */}
          <div className="mb-6">
             <h2 className="text-sm font-medium text-slate-500 italic">
               Happy Thursday, <span className="text-slate-900 font-bold not-italic">{user?.name?.split(' ')[0]}!</span>
             </h2>
          </div>
          
          <Outlet />
        </div>
      </main>

      {/* --- MOBILE NAVIGATION BAR (Visible only on small screens) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
          <NavLink to="/user/dashboard" className={({isActive}) => isActive ? "text-indigo-600" : "text-slate-400"}>
            <LayoutDashboard className="w-6 h-6" />
          </NavLink>
          <NavLink to="/user/resources" className={({isActive}) => isActive ? "text-indigo-600" : "text-slate-400"}>
            <Box className="w-6 h-6" />
          </NavLink>
          <NavLink to="/user/bookings" className={({isActive}) => isActive ? "text-indigo-600" : "text-slate-400"}>
            <CalendarCheck className="w-6 h-6" />
          </NavLink>
          <NavLink to="/user/tickets" className={({isActive}) => isActive ? "text-indigo-600" : "text-slate-400"}>
            <Ticket className="w-6 h-6" />
          </NavLink>
      </nav>
    </div>
  );
}