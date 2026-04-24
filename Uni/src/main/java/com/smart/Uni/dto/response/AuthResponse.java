//package com.smart.Uni.dto.response;
//
//import lombok.Builder;
//import lombok.Data;
//
//@Data
//@Builder
//public class AuthResponse {
//    private String token;
//    private UserResponse user;
//}

package com.smart.Uni.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserResponse user;

    // NEW
    private boolean banned;
    private String message;
}