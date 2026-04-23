// // // import { Navigate } from 'react-router-dom'
// // // import { useAuth } from '../context/AuthContext'

// // // export default function ProtectedRoute({ children, requiredRole }) {
// // //   const { user, loading } = useAuth()

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!user) return <Navigate to="/login" replace />

// // //   if (requiredRole && user.role !== requiredRole) {
// // //     return <Navigate to="/dashboard" replace />
// // //   }

// // //   return children
// // // }

// // //frontend/src/components/ProtectedRoute.jsx
// // import { Navigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";

// // export default function ProtectedRoute({ children, requiredRole }) {
// //   const { user, loading } = useAuth();

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   if (!user) return <Navigate to="/login" replace />;

// //   if (requiredRole && user.role !== requiredRole) {
// //     switch (user.role) {
// //       case "admin":
// //         return <Navigate to="/admin/dashboard" replace />;
// //       case "user":
// //         return <Navigate to="/user/dashboard" replace />;
// //       case "tech":
// //         return <Navigate to="/tech/dashboard" replace />;
// //       default:
// //         return <Navigate to="/login" replace />;
// //     }
// //   }

// //   return children;
// // }

// // frontend/src/components/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, requiredRole }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user) return <Navigate to="/login" replace />;

//   if (requiredRole && user.role !== requiredRole) {
//     // Redirect to correct dashboard if user role doesn't match
//     switch (user.role) {
//       case "admin":
//         return <Navigate to="/admin/dashboard" replace />;
//       case "user":
//         return <Navigate to="/user/dashboard" replace />;
//       case "tech":
//         return <Navigate to="/tech/dashboard" replace />;
//       default:
//         return <Navigate to="/login" replace />;
//     }
//   }

//   return <>{children}</>; // Ensure JSX fragment wraps children
// }

// frontend/src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/login" replace />;

  return children;
}
