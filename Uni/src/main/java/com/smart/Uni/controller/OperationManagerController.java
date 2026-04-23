package com.smart.Uni.controller;

import com.smart.Uni.enums.BookingStatus;
import com.smart.Uni.repository.BookingRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.smart.Uni.repository.ResourceRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;

/**
 * REST controller for OPERATION_MANAGER role.
 * Provides operational stats (bookings, resources) for the Operations Dashboard.
 * All endpoints are restricted to OPERATION_MANAGER via @PreAuthorize and SecurityConfig.
 */
@RestController
@RequestMapping("/api/operation-manager")
@PreAuthorize("hasRole('OPERATION_MANAGER')")
@RequiredArgsConstructor
public class OperationManagerController {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    /**
     * GET /api/operation-manager/stats
     * Returns aggregated stats for the Operations dashboard.
     */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        long totalBookings    = bookingRepository.count();
        long pendingBookings  = bookingRepository.countByStatus(BookingStatus.PENDING);
        long approvedBookings = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long rejectedBookings = bookingRepository.countByStatus(BookingStatus.REJECTED);
        long totalResources   = resourceRepository.count();
        long totalUsers       = userRepository.count();

        // Booking status distribution for pie chart
        List<Map<String, Object>> distribution = List.of(
                Map.of("name", "Approved", "value", approvedBookings),
                Map.of("name", "Pending",  "value", pendingBookings),
                Map.of("name", "Rejected", "value", rejectedBookings)
        );

        // Last 7 days booking trend
        List<Map<String, Object>> bookingTrend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date       = LocalDate.now().minusDays(i);
            LocalDateTime start  = date.atStartOfDay();
            LocalDateTime end    = date.atTime(LocalTime.MAX);
            String dayName       = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            long daily = bookingRepository.countByCreatedAtBetween(start, end);
            bookingTrend.add(Map.of("name", dayName, "bookings", daily));
        }

        return Map.of(
                "totalBookings",   totalBookings,
                "pendingBookings", pendingBookings,
                "approvedBookings",approvedBookings,
                "rejectedBookings",rejectedBookings,
                "totalResources",  totalResources,
                "totalUsers",      totalUsers,
                "distribution",    distribution,
                "bookingTrend",    bookingTrend
        );
    }
}
