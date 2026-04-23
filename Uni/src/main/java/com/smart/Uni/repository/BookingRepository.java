
package com.smart.Uni.repository;

import com.smart.Uni.entity.Booking;
import com.smart.Uni.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);
    long countByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
            "AND b.status NOT IN ('CANCELLED','REJECTED') " +
            "AND ((b.startTime < :endTime) AND (b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Booking> findByResourceIdAndStartTimeBetween(Long resourceId, LocalDateTime start, LocalDateTime end);
}