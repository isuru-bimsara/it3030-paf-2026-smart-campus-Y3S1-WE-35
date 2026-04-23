


package com.smart.Uni.service;

import com.smart.Uni.dto.request.BookingRequest;
import com.smart.Uni.dto.response.BookingResponse;
import com.smart.Uni.entity.Booking;
import com.smart.Uni.entity.Resource;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.BookingStatus;
import com.smart.Uni.exception.BookingConflictException;
import com.smart.Uni.repository.BookingRepository;
import com.smart.Uni.repository.ResourceRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        // Check conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resource.getId(), request.getStartTime(), request.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyBookingPending(saved);
        return mapToResponse(saved);

    }

    public List<BookingResponse> getUserBookings(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ✅ Missing method - Get all bookings
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ✅ Missing method - Get booking by ID
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    // ✅ Missing method - Approve booking
    @Transactional
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.APPROVED);
        Booking updated = bookingRepository.save(booking);
        notificationService.notifyBookingApproved(updated);
        return mapToResponse(updated);
    }

    // ✅ Updated method - Reject booking with reason
    @Transactional
    public BookingResponse rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectReason(reason);
        Booking updated = bookingRepository.save(booking);
        notificationService.notifyBookingRejected(updated);
        return mapToResponse(updated);
    }

    // ✅ Missing method - Cancel booking (by user)
    @Transactional
    public BookingResponse cancelBooking(Long id, String username, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (!isAdmin) {
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Only the *owner* can cancel if not admin
            if (!booking.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("You can only cancel your own bookings");
            }
        }

        // Only PENDING or APPROVED bookings can be cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        notificationService.notifyBookingCancelled(updated);
        return mapToResponse(updated);
    }

    public List<BookingResponse> getBookingsByResource(Long resourceId) {
        return bookingRepository.findAll()
                .stream()
                .filter(b -> b.getResource().getId().equals(resourceId))
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.REJECTED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByResourceAndDate(Long resourceId, java.time.LocalDate date) {
        java.time.LocalDateTime startOfDay = date.atStartOfDay();
        java.time.LocalDateTime endOfDay = date.atTime(23, 59, 59);

        return bookingRepository.findByResourceIdAndStartTimeBetween(resourceId, startOfDay, endOfDay)
                .stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.REJECTED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .resourceId(b.getResource().getId())
                .resourceName(b.getResource().getName())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .status(b.getStatus())
                .purpose(b.getPurpose())
                .rejectReason(b.getRejectReason())
                .createdAt(b.getCreatedAt())
                .build();
    }


}