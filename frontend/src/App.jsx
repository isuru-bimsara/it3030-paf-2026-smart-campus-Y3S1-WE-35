// frontend/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import TechLayout from "./layouts/TechLayout";
import OpsLayout from "./layouts/OpsLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminUsers from "./pages/admin/AdminUsers";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import UserBookings from "./pages/user/UserBookings";
import UserResources from "./pages/user/UserResources";
import UserTickets from "./pages/user/UserTickets";
import UserNotifications from "./pages/user/UserNotifications";
import BookResource from "./pages/user/BookResource";

// Tech Pages
import TechDashboard from "./pages/tech/TechDashboard";
import TechTickets from "./pages/tech/TechTickets";
import TechNotifications from "./pages/tech/TechNotifications";

// Ops Pages
import OpsDashboard from "./pages/ops/OpsDashboard";
import OpsResources from "./pages/ops/OpsResources";
import OpsBookings from "./pages/ops/OpsBookings";
import OpsTickets from "./pages/ops/OpsTickets";
import OpsNotifications from "./pages/ops/OpsNotifications";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// Profile Page (shared)
import UpdateProfile from "./pages/UpdateProfile";

import BannedPage from "./pages/BannedPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/banned" element={<BannedPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Operation Manager Routes */}
        <Route
          path="/operation-manager/*"
          element={
            <ProtectedRoute requiredRole="OPERATION_MANAGER">
              <OpsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OpsDashboard />} />
          <Route path="resources" element={<OpsResources />} />
          <Route path="bookings" element={<OpsBookings />} />
          <Route path="tickets" element={<OpsTickets />} />
          <Route path="notifications" element={<OpsNotifications />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="USER">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="resources" element={<UserResources />} />
          <Route path="book/:id" element={<BookResource />} />
          <Route path="tickets" element={<UserTickets />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Tech Routes */}
        <Route
          path="/tech/*"
          element={
            <ProtectedRoute requiredRole="TECHNICIAN">
              <TechLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TechDashboard />} />
          <Route path="tickets" element={<TechTickets />} />
          <Route path="notifications" element={<TechNotifications />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
