package com.smart.Uni.service;

import com.smart.Uni.dto.request.ResourceRequest;
import com.smart.Uni.entity.Resource;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.ResourceStatus;
import com.smart.Uni.exception.ResourceNotFoundException;
import com.smart.Uni.repository.ResourceRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::normalizeImageUrl)
                .toList();
    }

    public List<Resource> getAvailableResources() {
        return resourceRepository.findByStatus(ResourceStatus.AVAILABLE)
                .stream()
                .sorted(Comparator.comparing(Resource::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::normalizeImageUrl)
                .toList();
    }

    public Resource getResourceById(Long id) {
        return normalizeImageUrl(findResource(id));
    }

    public Resource createResource(ResourceRequest request, String actorEmail) {
        Resource saved = resourceRepository.save(mapRequest(Resource.builder(), request).build());
        notificationService.notifyResourceCreated(saved, findActor(actorEmail));
        return normalizeImageUrl(saved);
    }

    public Resource updateResource(Long id, ResourceRequest request, String actorEmail) {
        Resource existing = findResource(id);

        existing.setName(request.getName().trim());
        existing.setDescription(trimToNull(request.getDescription()));
        existing.setType(request.getType());
        existing.setLocation(normalizeLocation(request));
        existing.setCapacity(request.getCapacity());
        existing.setStatus(request.getStatus());
        existing.setImageUrl(normalizeImagePath(request.getImageUrl()));

        Resource saved = resourceRepository.save(existing);
        notificationService.notifyResourceUpdated(saved, findActor(actorEmail));
        return normalizeImageUrl(saved);
    }

    public void deleteResource(Long id, String actorEmail) {
        Resource existing = findResource(id);
        resourceRepository.delete(existing);
        notificationService.notifyResourceDeleted(existing.getId(), existing.getName(), findActor(actorEmail));
    }

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "resource" : file.getOriginalFilename());
        String extension = "";
        int lastDot = originalName.lastIndexOf('.');
        if (lastDot >= 0) {
            extension = originalName.substring(lastDot);
        }

        String storedFileName = UUID.randomUUID() + extension;
        Path targetDir = Path.of(uploadDir);
        Path targetFile = targetDir.resolve(storedFileName);

        try {
            Files.createDirectories(targetDir);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new UncheckedIOException("Failed to store uploaded image", ex);
        }

        return "/uploads/" + storedFileName;
    }

    private Resource.ResourceBuilder mapRequest(Resource.ResourceBuilder builder, ResourceRequest request) {
        return builder
                .name(request.getName().trim())
                .description(trimToNull(request.getDescription()))
                .type(request.getType())
                .location(normalizeLocation(request))
                .capacity(request.getCapacity())
                .status(request.getStatus())
                .imageUrl(normalizeImagePath(request.getImageUrl()));
    }

    private String normalizeLocation(ResourceRequest request) {
        if (request.getType() != null && request.getType().name().equals("EQUIPMENT")) {
            return null;
        }
        return trimToNull(request.getLocation());
    }

    private Resource findResource(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private User findActor(String actorEmail) {
        if (actorEmail == null || actorEmail.isBlank()) {
            return null;
        }
        return userRepository.findByEmail(actorEmail).orElse(null);
    }

    private Resource normalizeImageUrl(Resource resource) {
        String imageUrl = resource.getImageUrl();
        if (imageUrl != null && !imageUrl.isBlank()) {
            resource.setImageUrl(normalizeImagePath(imageUrl));
        }
        return resource;
    }

    private String normalizeImagePath(String imageUrl) {
        String value = trimToNull(imageUrl);
        if (value == null) {
            return null;
        }
        if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/uploads/")) {
            return value;
        }
        if (value.startsWith("/")) {
            return value;
        }
        return "/uploads/" + value;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
