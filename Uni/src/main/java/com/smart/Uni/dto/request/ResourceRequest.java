//package com.smart.Uni.dto.request;
//
//import com.smart.Uni.enums.ResourceStatus;
//import com.smart.Uni.enums.ResourceType;
//import jakarta.validation.constraints.Min;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import lombok.Data;
//
//@Data
//public class ResourceRequest {
//    @NotBlank(message = "Name is required")
//    private String name;
//    private String description;
//    @NotNull(message = "Type is required")
//    private ResourceType type;
//    private String location;
//    @Min(value = 1, message = "Capacity must be at least 1")
//    private Integer capacity;
//    private ResourceStatus status;
//}


package com.smart.Uni.dto.request;

import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Type is required")
    private ResourceType type;

    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private ResourceStatus status;

    private String imageUrl; // optional image
}