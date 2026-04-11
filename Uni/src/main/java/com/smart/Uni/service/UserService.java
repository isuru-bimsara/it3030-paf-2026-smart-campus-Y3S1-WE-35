
package com.smart.Uni.service;

import com.smart.Uni.dto.request.LoginRequest;
import com.smart.Uni.dto.request.RegisterRequest;
import com.smart.Uni.dto.response.AuthResponse;
import com.smart.Uni.dto.response.UserResponse;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.UserRole;
import com.smart.Uni.repository.UserRepository;
import com.smart.Uni.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final NotificationService notificationService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToResponse(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .provider("local")
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .user(mapToResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .user(mapToResponse(user))
                .build();
    }

    /** NEW: list all users for admin */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /** NEW: update role for a specific user */
    @Transactional
    public UserResponse updateRole(Long id, UserRole role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(role);
        // return mapToResponse(userRepository.save(user));
        User saved = userRepository.save(user);
        notificationService.notifyRoleChanged(saved, role, "Admin");
        return mapToResponse(saved);
    }

    /** NEW: update user profile (name and an optional image) */
    @Transactional
    public UserResponse updateProfile(String email, String name, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }

        if (file != null && !file.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename to prevent collisions
            String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Store the path that matches the WebConfig resource handler
            user.setPicture("/uploads/" + fileName);
        }

        return mapToResponse(userRepository.save(user));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .picture(user.getPicture())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}