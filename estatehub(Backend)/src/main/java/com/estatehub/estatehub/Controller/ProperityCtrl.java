package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.DTO.PropertyDTO;
import com.estatehub.estatehub.Service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.estatehub.estatehub.model.User;
import com.estatehub.estatehub.Security.Authorization;

@RestController
public class ProperityCtrl {

    private final PropertyService propertyService;
    private final Authorization authorization;

    public ProperityCtrl(
            PropertyService propertyService,
            Authorization authorization
    ) {
        this.propertyService = propertyService;
        this.authorization = authorization;
    }


    // Add Property

    @PreAuthorize("@Authorization.isAgent()")
    @PostMapping("/property")
    public PropertyDTO addProperty(
            @Valid @RequestBody PropertyDTO dto
    ) {
        User currentUser = authorization.getCurrentUser();

        if (currentUser == null) {
            throw new org.springframework.security.authentication
                    .AuthenticationCredentialsNotFoundException(
                    "Authenticated user not found"
            );
        }

        return propertyService.addProperty(currentUser, dto);
    }


    // Get Property By ID
    @GetMapping("/property/{id}")
    public PropertyDTO getPropertyById(
            @PathVariable Integer id
    ) {
        return propertyService.getPropertyById(id);
    }

    // Get All Properties
    @GetMapping("/property")
    public List<PropertyDTO> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/property/my")
    @PreAuthorize("hasRole('AGENT')")
    public List<PropertyDTO> getMyProperties() {
        User currentUser = authorization.getCurrentUser();

        if (currentUser == null) {
            throw new org.springframework.security.authentication
                    .AuthenticationCredentialsNotFoundException(
                    "Authenticated user not found"
            );
        }

        return propertyService.getPropertiesByAgent(currentUser.getId());
    }

    // Update Property
    @PreAuthorize("hasRole('AGENT')")
    @PutMapping("/property/{id}")
    public PropertyDTO updateProperty(
            @PathVariable Integer id,
            @Valid @RequestBody PropertyDTO dto
    ) {
        User currentUser = authorization.getCurrentUser();

        if (currentUser == null) {
            throw new org.springframework.security.authentication
                    .AuthenticationCredentialsNotFoundException(
                    "Authenticated user not found"
            );
        }

        return propertyService.updateProperty(
                id,
                dto,
                currentUser.getId()
        );
    }

    // Delete Property
    @PreAuthorize("hasRole('AGENT')")
    @DeleteMapping("/property/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Integer id
    ) {
        User currentUser = authorization.getCurrentUser();

        if (currentUser == null) {
            throw new org.springframework.security.authentication
                    .AuthenticationCredentialsNotFoundException(
                    "Authenticated user not found"
            );
        }

        propertyService.deleteProperty(id, currentUser.getId());

        return ResponseEntity.noContent().build();
    }




    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/property/{id}/status")
    public ResponseEntity<Void> updatePropertyStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        propertyService.updatePropertyStatus(id, body.get("status"));
        return ResponseEntity.noContent().build();
    }
}