package com.smart.Uni.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectRequest {
    @NotBlank(message = "Reject reason is required")
    private String reason;
}
