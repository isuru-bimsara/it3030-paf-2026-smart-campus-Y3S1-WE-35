package com.smart.Uni.dto.request;

import lombok.Data;

@Data
public class ResolutionAcknowledgeRequest {
    private boolean acknowledged; // true = user confirms resolution
}