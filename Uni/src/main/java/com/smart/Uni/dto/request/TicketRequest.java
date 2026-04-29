package com.smart.Uni.dto.request;

import com.smart.Uni.enums.TicketCategory;
import com.smart.Uni.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Contact details are required")
    private String contactDetails;
    private TicketCategory category;
    private TicketPriority priority;
    private Long resourceId;
    private Long bookingId;
    private Boolean isOther;
}
