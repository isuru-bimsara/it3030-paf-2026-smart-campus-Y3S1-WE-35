

package com.smart.Uni.service;

import com.smart.Uni.dto.request.ResourceRequest;
import com.smart.Uni.dto.response.ResourceResponse;
import com.smart.Uni.entity.Resource;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.exception.ResourceNotFoundException;
import com.smart.Uni.repository.ResourceRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User findUser(String email) {
        return email == null ? null : userRepository.findByEmail(email).orElse(null);
    }

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ResourceResponse getResourceById(Long id) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return toResponse(r);
    }

//    public ResourceResponse createResource(ResourceRequest request) {
//        Resource r = Resource.builder()
//                .name(request.getName())
//                .description(request.getDescription())
//                .type(request.getType())
//                .location(request.getLocation())
//                .capacity(request.getCapacity())
//                .status(request.getStatus() != null ? request.getStatus() : ResourceStatus.AVAILABLE)
//                .imageUrl(request.getImageUrl())
//                .build();
//        return toResponse(resourceRepository.save(r));
//    }
//
//    public ResourceResponse updateResource(Long id, ResourceRequest request) {
//        Resource r = resourceRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
//        r.setName(request.getName());
//        r.setDescription(request.getDescription());
//        r.setType(request.getType());
//        r.setLocation(request.getLocation());
//        r.setCapacity(request.getCapacity());
//        if(request.getStatus() != null) r.setStatus(request.getStatus());
//        if(request.getImageUrl() != null) r.setImageUrl(request.getImageUrl());
//        return toResponse(resourceRepository.save(r));
//    }
//
//    public void deleteResource(Long id) {
//        if(!resourceRepository.existsById(id)) throw new ResourceNotFoundException("Resource not found with id: " + id);
//        resourceRepository.deleteById(id);
//    }

    public ResourceResponse createResource(ResourceRequest request, String actorEmail) {
        Resource r = Resource.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .status(request.getStatus() != null ? request.getStatus() : ResourceStatus.AVAILABLE)
                .imageUrl(request.getImageUrl())
                .build();
        Resource saved = resourceRepository.save(r);
        notificationService.notifyResourceCreated(saved, findUser(actorEmail));
        return toResponse(saved);
    }

    public ResourceResponse updateResource(Long id, ResourceRequest request, String actorEmail) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        r.setName(request.getName());
        r.setDescription(request.getDescription());
        r.setType(request.getType());
        r.setLocation(request.getLocation());
        r.setCapacity(request.getCapacity());
        if(request.getStatus() != null) r.setStatus(request.getStatus());
        if(request.getImageUrl() != null) r.setImageUrl(request.getImageUrl());
        Resource saved = resourceRepository.save(r);
        notificationService.notifyResourceUpdated(saved, findUser(actorEmail));
        return toResponse(saved);
    }

    public void deleteResource(Long id, String actorEmail) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.deleteById(id);
        notificationService.notifyResourceDeleted(id, r.getName(), findUser(actorEmail));
    }

    private ResourceResponse toResponse(Resource r) {
        return ResourceResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .type(r.getType())
                .location(r.getLocation())
                .capacity(r.getCapacity())
                .status(r.getStatus())
                .imageUrl(r.getImageUrl())
                .createdAt(r.getCreatedAt())
                .build();
    }
}