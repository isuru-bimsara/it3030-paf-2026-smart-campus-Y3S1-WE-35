package com.smart.Uni.repository;

import com.smart.Uni.entity.User;
import com.smart.Uni.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    boolean existsByEmail(String email);
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
    List<User> findByRole(UserRole role);
    Optional<User> findByEmailAndDeletedFalse(String email);
    boolean existsByEmailAndDeletedFalse(String email);
    List<User> findByDeletedFalse();

}
