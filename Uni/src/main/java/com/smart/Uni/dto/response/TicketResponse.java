package com.smart.Uni.dto.response;

import com.smart.Uni.enums.TicketCategory;
import com.smart.Uni.enums.TicketPriority;
import com.smart.Uni.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private Long assigneeId;
    private String assigneeName;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private List<String> images;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private Long responseTimeMinutes;
}
