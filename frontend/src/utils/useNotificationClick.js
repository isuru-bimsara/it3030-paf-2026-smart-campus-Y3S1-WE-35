
// import { useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { notificationsApi } from "../api/notifications";
// import { getNotificationTarget } from "./notificationNavigation";

// export default function useNotificationClick(setNotifications, role) {
//   const navigate = useNavigate();

//   return useCallback(
//     (notification) => {
//       // 1) Navigate first (instant UX)
//       const target = getNotificationTarget(notification, role);
//       navigate(target);

//       // 2) Mark as read in background
//       if (!notification.read) {
//         notificationsApi
//           .markAsRead(notification.id)
//           .then(() => {
//             setNotifications((prev) =>
//               prev.map((n) =>
//                 n.id === notification.id ? { ...n, read: true } : n
//               )
//             );
//           })
//           .catch((err) => {
//             console.error("markAsRead failed:", err);
//           });
//       }
//     },
//     [navigate, role, setNotifications]
//   );
// }

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "../api/notifications";
import { getNotificationTarget } from "./notificationNavigation";

/**
 * Shared click handler for all roles.
 * role: "USER" | "ADMIN" | "TECHNICIAN"
 */
export default function useNotificationClick(setNotifications, role) {
  const navigate = useNavigate();

  return useCallback(
    (notification) => {
      const target = getNotificationTarget(notification, role);
      navigate(target);

      // mark read in background
      if (!notification.read) {
        notificationsApi
          .markAsRead(notification.id)
          .then(() => {
            if (setNotifications) {
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === notification.id ? { ...n, read: true } : n
                )
              );
            }
          })
          .catch((err) => {
            console.error("markAsRead failed:", err);
          });
      }
    },
    [navigate, role, setNotifications]
  );
}