//package com.smart.Uni.repository;
//
//import com.smart.Uni.entity.Resource;
//import com.smart.Uni.enums.ResourceStatus;
//import com.smart.Uni.enums.ResourceType;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//
//@Repository
//public interface ResourceRepository extends JpaRepository<Resource, Long> {
//    List<Resource> findByStatus(ResourceStatus status);
//    List<Resource> findByType(ResourceType type);
//    List<Resource> findByNameContainingIgnoreCase(String name);
//}

package com.smart.Uni.repository;

import com.smart.Uni.entity.Resource;
import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByType(ResourceType type);
    List<Resource> findByNameContainingIgnoreCase(String name);
}