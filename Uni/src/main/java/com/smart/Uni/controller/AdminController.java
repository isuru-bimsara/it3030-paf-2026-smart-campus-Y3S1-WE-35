
package com.smart.Uni.controller;

import com.smart.Uni.dto.response.ApiResponse;
import com.smart.Uni.dto.response.UserResponse;
import com.smart.Uni.enums.BookingStatus;
import com.smart.Uni.enums.UserRole;
import com.smart.Uni.repository.BookingRepository;
import com.smart.Uni.repository.TicketRepository;
import com.smart.Uni.repository.UserRepository;
import com.smart.Uni.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String roleValue = body == null ? null : body.get("role");
        if (roleValue == null || roleValue.isBlank()) {
            throw new IllegalArgumentException("Role is required");
        }

        UserRole role = UserRole.valueOf(roleValue.trim().toUpperCase(Locale.ROOT));
        return ResponseEntity.ok(ApiResponse.success("User role updated", userService.updateRole(id, role)));
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long users = userRepository.findByDeletedFalse().size();
        long bookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long tickets = ticketRepository.count();

        List<Map<String, Object>> distribution = List.of(
                Map.of("name", "Approved", "value", bookingRepository.countByStatus(BookingStatus.APPROVED)),
                Map.of("name", "Pending", "value", pendingBookings),
                Map.of("name", "Rejected", "value", bookingRepository.countByStatus(BookingStatus.REJECTED))
        );

        List<Map<String, Object>> userGrowth = new ArrayList<>();
        List<Map<String, Object>> activityTrends = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            userGrowth.add(Map.of(
                    "name", dayName,
                    "count", userRepository.countByCreatedAtBetween(start, end)
            ));

            activityTrends.add(Map.of(
                    "name", dayName,
                    "bookings", bookingRepository.countByCreatedAtBetween(start, end),
                    "tickets", ticketRepository.countByCreatedAtBetween(start, end)
            ));
        }

        return Map.of(
                "users", users,
                "bookings", bookings,
                "pendingBookings", pendingBookings,
                "tickets", tickets,
                "distribution", distribution,
                "userGrowth", userGrowth,
                "activityTrends", activityTrends
        );
    }

    // NEW: ban user
    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<ApiResponse<UserResponse>> banUser(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body == null ? null : body.get("reason");
        return ResponseEntity.ok(ApiResponse.success("User banned", userService.banUser(id, reason)));
    }

    // NEW: unban user
    @PatchMapping("/users/{id}/unban")
    public ResponseEntity<ApiResponse<UserResponse>> unbanUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User unbanned", userService.unbanUser(id)));
    }

}
