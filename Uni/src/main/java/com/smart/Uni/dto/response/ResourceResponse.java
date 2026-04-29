//package com.smart.Uni.dto.response;
//
//import com.smart.Uni.enums.ResourceStatus;
//import com.smart.Uni.enums.ResourceType;
//import lombok.Builder;
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//public class ResourceResponse {
//    private Long id;
//    private String name;
//    private String description;
//    private ResourceType type;
//    private String location;
//    private Integer capacity;
//    private ResourceStatus status;
//    private LocalDateTime createdAt;
//}

package com.smart.Uni.dto.response;

import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.enums.ResourceType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResourceResponse {
    private Long id;
    private String name;
    private String description;
    private ResourceType type;
    private String location;
    private Integer capacity;
    private ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
}