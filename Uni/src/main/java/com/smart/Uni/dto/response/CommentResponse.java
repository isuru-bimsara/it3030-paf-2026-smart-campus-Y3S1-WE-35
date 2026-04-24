package com.smart.Uni.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long ticketId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
}
