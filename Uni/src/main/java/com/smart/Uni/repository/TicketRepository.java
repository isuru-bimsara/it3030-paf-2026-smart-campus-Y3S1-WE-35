package com.smart.Uni.repository;

import com.smart.Uni.entity.Ticket;
import com.smart.Uni.enums.TicketCategory;
import com.smart.Uni.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByReporterId(Long reporterId);
    List<Ticket> findByAssigneeId(Long assigneeId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByTitleContainingIgnoreCase(String title);
    List<Ticket> findByCategory(TicketCategory category);
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Ticket> findByAssigneeIdAndCategory(Long assigneeId, TicketCategory category);
}
