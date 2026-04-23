package com.smart.Uni.controller;

import com.smart.Uni.dto.request.BookingRequest;
import com.smart.Uni.dto.response.ApiResponse;
import com.smart.Uni.dto.response.BookingResponse;
import com.smart.Uni.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.smart.Uni.dto.request.RejectRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Booking created", bookingService.createBooking(request, userDetails.getUsername())));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(userDetails.getUsername())));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATION_MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id)));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('OPERATION_MANAGER')")
    public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking approved", bookingService.approveBooking(id)));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('OPERATION_MANAGER')")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest rejectRequest) {
        return ResponseEntity.ok(ApiResponse.success("Booking rejected", bookingService.rejectBooking(id, rejectRequest.getReason())));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Check for OPERATION_MANAGER role (has admin-level cancel rights)
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_OPERATION_MANAGER"));
        return ResponseEntity.ok(ApiResponse.success(
                "Booking cancelled",
                bookingService.cancelBooking(id, userDetails.getUsername(), isAdmin)
        ));
    }

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByResource(
            @PathVariable Long resourceId) {

        return ResponseEntity.ok(
                ApiResponse.success(bookingService.getBookingsByResource(resourceId))
        );
    }

    @GetMapping("/resource/{resourceId}/date/{date}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByResourceAndDate(
            @PathVariable Long resourceId,
            @PathVariable LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingsByResourceAndDate(resourceId, date)));
    }
}
