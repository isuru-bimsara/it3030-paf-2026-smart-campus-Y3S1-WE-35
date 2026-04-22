package com.smart.Uni.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smart.Uni.entity.User;
import com.smart.Uni.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class BannedUserFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Always allow auth endpoints
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1) Bypass banned check for ADMIN authority from security context
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> "ROLE_ADMIN".equals(a));

        // 2) Also bypass all /api/admin/** endpoints (they are already protected by hasRole('ADMIN'))
        if (isAdmin || path.startsWith("/api/admin/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check banned for non-admin authenticated users
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            User currentUser = userRepository.findByEmailAndDeletedFalse(email).orElse(null);

            if (currentUser != null && currentUser.isBanned()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write(objectMapper.writeValueAsString(
                        Map.of(
                                "success", false,
                                "message", currentUser.getBanReason() != null && !currentUser.getBanReason().isBlank()
                                        ? currentUser.getBanReason()
                                        : "Your account has been banned by admin.",
                                "code", "USER_BANNED"
                        )
                ));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}