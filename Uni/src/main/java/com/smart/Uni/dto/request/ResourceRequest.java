package com.smart.Uni.dto.request;

import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {

    @NotBlank(message = "Resource name is required")
    private String name;

    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 0, message = "Capacity cannot be negative")
    private Integer capacity;

    @NotNull(message = "Resource status is required")
    private ResourceStatus status;

    private String imageUrl;
}
