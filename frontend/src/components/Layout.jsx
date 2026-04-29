// //frontend/src/components/Layout.jsx
// import { Outlet, NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { useState, useEffect } from 'react'
// import { notificationsApi } from '../api/notifications'

// export default function Layout() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [unreadCount, setUnreadCount] = useState(0)

//   useEffect(() => {
//     notificationsApi.getUnreadCount()
//       .then(res => setUnreadCount(res.data.data.count))
//       .catch(() => {})
//     const interval = setInterval(() => {
//       notificationsApi.getUnreadCount()
//         .then(res => setUnreadCount(res.data.data.count))
//         .catch(() => {})
//     }, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const navItems = [
//     { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
//     { to: '/resources', label: 'Resources', icon: '🏛️' },
//     { to: '/bookings', label: 'Bookings', icon: '📅' },
//     { to: '/tickets', label: 'Tickets', icon: '🔧' },
//     { to: '/notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
//     ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin', icon: '⚙️' }] : []),
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-sm border-r border-gray-100 flex flex-col">
//         <div className="p-6 border-b border-gray-100">
//           <h1 className="text-xl font-bold text-blue-600">🎓 Smart Campus</h1>
//           <p className="text-xs text-gray-500 mt-1">Operations Hub</p>
//         </div>

//         <nav className="flex-1 p-4 space-y-1">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                   isActive
//                     ? 'bg-blue-50 text-blue-600'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`
//               }
//             >
//               <span>{item.icon}</span>
//               <span>{item.label}</span>
//               {item.badge > 0 && (
//                 <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {item.badge > 99 ? '99+' : item.badge}
//                 </span>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-gray-100">
//           <div className="flex items-center gap-3 mb-3">
//             {user?.picture ? (
//               <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
//             ) : (
//               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
//                 {user?.name?.[0]?.toUpperCase()}
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
//               <p className="text-xs text-gray-500 truncate">{user?.role}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full text-left text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 overflow-auto">
//         <div className="p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   )
// }
