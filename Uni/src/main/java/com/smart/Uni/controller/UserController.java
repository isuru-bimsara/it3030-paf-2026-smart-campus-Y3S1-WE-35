package com.smart.Uni.controller;

import com.smart.Uni.dto.response.ApiResponse;
import com.smart.Uni.dto.response.UserResponse;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.BookingStatus;
import com.smart.Uni.repository.BookingRepository;
import com.smart.Uni.repository.TicketRepository;
import com.smart.Uni.repository.UserRepository;
import com.smart.Uni.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long myBookings = bookingRepository.findByUserId(user.getId()).size();
        long pendingBookings = bookingRepository.findByUserId(user.getId()).stream()
                .filter(booking -> booking.getStatus() == BookingStatus.PENDING)
                .count();
        long tickets = ticketRepository.findByReporterId(user.getId()).size();

        return ResponseEntity.ok(java.util.Map.of(
                "myBookings", myBookings,
                "pendingBookings", pendingBookings,
                "tickets", tickets
        ));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            UserResponse updatedUser = userService.updateProfile(userDetails.getUsername(), name, image);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Error uploading image: " + e.getMessage()));
        }
    }
}
