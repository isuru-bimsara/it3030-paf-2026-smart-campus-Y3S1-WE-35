package com.smart.Uni.controller;

import com.smart.Uni.dto.request.LoginRequest;
import com.smart.Uni.dto.request.RegisterRequest;
import com.smart.Uni.dto.response.ApiResponse;
import com.smart.Uni.dto.response.AuthResponse;
import com.smart.Uni.dto.response.UserResponse;
import com.smart.Uni.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.getCurrentUser(userDetails.getUsername())));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.login(request)));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<String>> deleteCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully"));
    }
}
