//package com.smart.Uni.dto.response;
//
//import com.smart.Uni.enums.UserRole;
//import lombok.Builder;
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//public class UserResponse {
//    private Long id;
//    private String email;
//    private String name;
//    private String picture;
//    private UserRole role;
//    private LocalDateTime createdAt;
//}


package com.smart.Uni.dto.response;

import com.smart.Uni.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String picture;
    private UserRole role;
    private LocalDateTime createdAt;

    // NEW
    private boolean banned;
    private String banReason;
}