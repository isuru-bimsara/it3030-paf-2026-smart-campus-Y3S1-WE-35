

package com.smart.Uni.service;

import com.smart.Uni.dto.response.NotificationResponse;
import com.smart.Uni.entity.*;
import com.smart.Uni.enums.NotificationType;
import com.smart.Uni.enums.UserRole;
import com.smart.Uni.exception.ResourceNotFoundException;
import com.smart.Uni.repository.NotificationRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /* ---------- PUBLIC NOTIFIERS ---------- */

    public void notifyBookingPending(Booking booking) {
        notifyAdminsAndOps(
                "New booking pending approval for resource: " + booking.getResource().getName(),
                NotificationType.BOOKING_PENDING,
                booking.getId());
    }

    public void notifyBookingApproved(Booking booking) {
        createNotification(booking.getUser(), NotificationType.BOOKING_APPROVED,
                "Your booking for " + booking.getResource().getName() + " has been approved.", booking.getId());
    }

    public void notifyBookingRejected(Booking booking) {
        String msg = "Your booking for " + booking.getResource().getName() + " has been rejected.";
        if (booking.getRejectReason() != null && !booking.getRejectReason().isBlank()) {
            msg += " Reason: " + booking.getRejectReason();
        }
        createNotification(booking.getUser(), NotificationType.BOOKING_REJECTED, msg, booking.getId());
    }

    public void notifyBookingCancelled(Booking booking) {
        createNotification(booking.getUser(), NotificationType.BOOKING_CANCELLED,
                "Your booking for " + booking.getResource().getName() + " was cancelled.", booking.getId());
    }

    public void notifyTicketUpdated(Ticket ticket) {
        createNotification(ticket.getReporter(), NotificationType.TICKET_UPDATED,
                "Your ticket '" + ticket.getTitle() + "' status updated to: " + ticket.getStatus(), ticket.getId());
    }

    public void notifyTicketAssigned(Ticket ticket) {
        if (ticket.getAssignee() != null) {
            createNotification(ticket.getAssignee(), NotificationType.TICKET_ASSIGNED,
                    "Ticket '" + ticket.getTitle() + "' has been assigned to you.", ticket.getId());
        }
    }

    /* NEW: ticket created -> technicians */
    public void notifyTicketCreated(Ticket ticket) {
        notifyByRole(UserRole.TECHNICIAN,
                "New ticket: " + ticket.getTitle(),
                NotificationType.TICKET_CREATED,
                ticket.getId());
    }

    /* NEW: ticket status change -> reporter + assignee */
    public void notifyTicketStatusChanged(Ticket ticket) {
        createNotification(ticket.getReporter(), NotificationType.TICKET_STATUS_CHANGED,
                "Ticket '" + ticket.getTitle() + "' status: " + ticket.getStatus(), ticket.getId());
        if (ticket.getAssignee() != null &&
                !ticket.getAssignee().getId().equals(ticket.getReporter().getId())) {
            createNotification(ticket.getAssignee(), NotificationType.TICKET_STATUS_CHANGED,
                    "Ticket '" + ticket.getTitle() + "' status: " + ticket.getStatus(), ticket.getId());
        }
    }

    /* NEW: comment added -> reporter + assignee (except commenter) */
//    public void notifyCommentAdded(Ticket ticket, User commenter) {
//        if (!commenter.getId().equals(ticket.getReporter().getId())) {
//            createNotification(ticket.getReporter(), NotificationType.COMMENT_ADDED,
//                    commenter.getName() + " commented on your ticket '" + ticket.getTitle() + "'", ticket.getId());
//        }
//        if (ticket.getAssignee() != null &&
//                !commenter.getId().equals(ticket.getAssignee().getId())) {
//            createNotification(ticket.getAssignee(), NotificationType.COMMENT_ADDED,
//                    commenter.getName() + " commented on ticket '" + ticket.getTitle() + "'", ticket.getId());
//        }
//    }

    public void notifyCommentAdded(Ticket ticket, User commenter) {
        // Notify reporter (except if reporter is the commenter)
        if (!commenter.getId().equals(ticket.getReporter().getId())) {
            createNotification(
                    ticket.getReporter(),
                    NotificationType.COMMENT_ADDED,
                    commenter.getName() + " commented on your ticket '" + ticket.getTitle() + "'",
                    ticket.getId()
            );
        }

        // If ticket has assignee -> notify assignee (except commenter)
        if (ticket.getAssignee() != null) {
            if (!commenter.getId().equals(ticket.getAssignee().getId())) {
                createNotification(
                        ticket.getAssignee(),
                        NotificationType.COMMENT_ADDED,
                        commenter.getName() + " commented on ticket '" + ticket.getTitle() + "'",
                        ticket.getId()
                );
            }
            return; // important: don't also broadcast to all technicians
        }

        // Fallback: no assignee yet -> notify all technicians except commenter
        userRepository.findByRole(UserRole.TECHNICIAN).forEach(tech -> {
            if (!tech.getId().equals(commenter.getId())) {
                createNotification(
                        tech,
                        NotificationType.COMMENT_ADDED,
                        commenter.getName() + " commented on unassigned ticket '" + ticket.getTitle() + "'",
                        ticket.getId()
                );
            }
        });
    }

    public void notifyResourceCreated(Resource resource, User actor) {
        notifyAdminsAndOps(
                (actor != null ? actor.getName() : "An admin") + " created resource: " + resource.getName(),
                NotificationType.RESOURCE_CREATED,
                resource.getId());
    }

    public void notifyResourceUpdated(Resource resource, User actor) {
        notifyAdminsAndOps(
                (actor != null ? actor.getName() : "An admin") + " updated resource: " + resource.getName(),
                NotificationType.RESOURCE_UPDATED,
                resource.getId());
    }

    public void notifyResourceDeleted(Long resourceId, String resourceName, User actor) {
        notifyAdminsAndOps(
                (actor != null ? actor.getName() : "An admin") + " deleted resource: " + resourceName,
                NotificationType.RESOURCE_DELETED,
                resourceId);
    }

    public void notifyRoleChanged(User targetUser, UserRole newRole, String changedBy) {
        createNotification(targetUser, NotificationType.ROLE_CHANGED,
                "Your role was changed to " + newRole + " by " + changedBy, targetUser.getId());
    }

    /* ---------- QUERIES ---------- */

    public List<NotificationResponse> getUserNotifications(String email) {
        User user = findUserByEmail(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        User user = findUserByEmail(email);
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    public NotificationResponse markAsRead(Long id, String email) {
        User user = findUserByEmail(email);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    public void markAllAsRead(String email) {
        User user = findUserByEmail(email);
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    /* ---------- INTERNAL HELPERS ---------- */

    private void notifyAdmins(String message, NotificationType type, Long relatedId) {
        notifyByRole(UserRole.ADMIN, message, type, relatedId);
    }

    private void notifyAdminsAndOps(String message, NotificationType type, Long relatedId) {
        notifyByRole(UserRole.ADMIN, message, type, relatedId);
        notifyByRole(UserRole.OPERATION_MANAGER, message, type, relatedId);
    }

    private void notifyByRole(UserRole role, String message, NotificationType type, Long relatedId) {
        userRepository.findByRole(role)
                .forEach(u -> createNotification(u, type, message, relatedId));
    }

    private void createNotification(User user, NotificationType type, String message, Long relatedId) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .relatedId(relatedId)
                .build();
        notificationRepository.save(notification);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .read(n.getRead())
                .relatedId(n.getRelatedId())
                .createdAt(n.getCreatedAt())
                .build();
    }
}