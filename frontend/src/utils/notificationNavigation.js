

// export function getBaseByRole(role) {
//   const r = String(role || "").toUpperCase();
//   if (r === "ADMIN") return "/admin";
//   if (r === "TECHNICIAN") return "/tech";
//   return "/user";
// }

// export function getNotificationTarget(notification, role) {
//   const base = getBaseByRole(role);
//   if (!notification) return `${base}/notifications`;

//   const { type, relatedId } = notification;
//   const id = relatedId != null ? String(relatedId) : null;

//   switch (type) {
//     // Ticket notifications
//     case "TICKET_UPDATED":
//     case "TICKET_ASSIGNED":
//     case "TICKET_CREATED":
//     case "TICKET_STATUS_CHANGED":
//       return id ? `${base}/tickets?ticketId=${id}` : `${base}/tickets`;

//     // Comment notification -> open comments tab/section
//     case "COMMENT_ADDED":
//       return id
//         ? `${base}/tickets?ticketId=${id}&openComments=true`
//         : `${base}/tickets`;

//     // Booking notifications
//     case "BOOKING_PENDING":
//     case "BOOKING_APPROVED":
//     case "BOOKING_REJECTED":
//     case "BOOKING_CANCELLED":
//       return id ? `${base}/bookings?bookingId=${id}` : `${base}/bookings`;

//     // Resource notifications
//     case "RESOURCE_CREATED":
//     case "RESOURCE_UPDATED":
//     case "RESOURCE_DELETED":
//       return id ? `${base}/resources?resourceId=${id}` : `${base}/resources`;

//     case "ROLE_CHANGED":
//       return `${base}/dashboard`;

//     default:
//       return `${base}/notifications`;
//   }
// }

export function getBaseByRole(role) {
  const r = String(role || "").toUpperCase();
  if (r === "ADMIN") return "/admin";
  if (r === "TECHNICIAN") return "/tech";
  return "/user";
}

/**
 * Build route by role + notification type.
 * We use query params because your app routes are list pages, not /tickets/:id.
 */
export function getNotificationTarget(notification, role) {
  const base = getBaseByRole(role);
  if (!notification) return `${base}/notifications`;

  const { type, relatedId } = notification;
  const id = relatedId != null ? String(relatedId) : null;

  switch (type) {
    // Ticket
    case "TICKET_UPDATED":
    case "TICKET_ASSIGNED":
    case "TICKET_CREATED":
    case "TICKET_STATUS_CHANGED":
      return id ? `${base}/tickets?ticketId=${id}` : `${base}/tickets`;

    // Comment on ticket -> open comment modal/section
    case "COMMENT_ADDED":
      return id
        ? `${base}/tickets?ticketId=${id}&openComments=true`
        : `${base}/tickets`;

    // Booking
    case "BOOKING_PENDING":
    case "BOOKING_APPROVED":
    case "BOOKING_REJECTED":
    case "BOOKING_CANCELLED":
      return id ? `${base}/bookings?bookingId=${id}` : `${base}/bookings`;

    // Resource
    case "RESOURCE_CREATED":
    case "RESOURCE_UPDATED":
    case "RESOURCE_DELETED":
      return id ? `${base}/resources?resourceId=${id}` : `${base}/resources`;

    case "ROLE_CHANGED":
      return `${base}/dashboard`;

    default:
      return `${base}/notifications`;
  }
}