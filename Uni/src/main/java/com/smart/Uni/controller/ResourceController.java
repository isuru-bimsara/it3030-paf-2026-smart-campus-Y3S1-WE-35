package com.smart.Uni.controller;

import com.smart.Uni.dto.request.ResourceRequest;
import com.smart.Uni.entity.Resource;
import com.smart.Uni.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/available")
    public List<Resource> getAvailableResources() {
        return resourceService.getAvailableResources();
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATION_MANAGER', 'ADMIN')")
    public ResponseEntity<Resource> createResource(
            @Valid @RequestBody ResourceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.createResource(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATION_MANAGER', 'ADMIN')")
    public Resource updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return resourceService.updateResource(id, request, userDetails.getUsername());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATION_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        resourceService.deleteResource(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('OPERATION_MANAGER', 'ADMIN')")
    public String uploadImage(@RequestPart("file") MultipartFile file) {
        return resourceService.uploadImage(file);
    }
}
