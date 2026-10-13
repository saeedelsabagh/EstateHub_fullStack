package com.estatehub.estatehub.Service;

import com.estatehub.estatehub.DTO.PropertyDTO;
import com.estatehub.estatehub.Repository.ProperityRepo;
import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.Exception.UserNotFoundException;
import com.estatehub.estatehub.model.Property;
import com.estatehub.estatehub.model.User;
import org.springframework.stereotype.Service;
import com.estatehub.estatehub.Exception.PropertyNotFoundException;

import java.util.List;
import java.util.ArrayList;

@Service
public class PropertyService {

    private final ProperityRepo propertyRepository;
    private final UserRepo userRepository;

    public PropertyService(
            ProperityRepo propertyRepository,
            UserRepo userRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    private PropertyDTO convertToDTO(Property property) {

        PropertyDTO dto = new PropertyDTO();

        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setLocation(property.getLocation());
        dto.setPrice(property.getPrice());
        dto.setPropertyType(property.getPropertyType());
        dto.setListingType(property.getListingType());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setArea(property.getArea());
        dto.setImageUrl(property.getImageUrl());
        dto.setDescription(property.getDescription());
        dto.setPropertyStatus(property.getPropertyStatus());

        if (property.getAgent() != null) {
            dto.setAgentId(property.getAgent().getId());
        }

        return dto;
    }

    private Property convertToEntity(PropertyDTO dto) {

        Property property = new Property();

        property.setId(dto.getId());
        property.setTitle(dto.getTitle());
        property.setLocation(dto.getLocation());
        property.setPrice(dto.getPrice());
        property.setPropertyType(dto.getPropertyType());
        property.setListingType(dto.getListingType());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setArea(dto.getArea());
        property.setImageUrl(dto.getImageUrl());
        property.setDescription(dto.getDescription());
        property.setPropertyStatus(dto.getPropertyStatus());

        if (dto.getAgentId() != null) {

            User agent = userRepository.findById(dto.getAgentId())
                    .orElseThrow(() ->
                            new UserNotFoundException("User not found"));

            property.setAgent(agent);
        }

        return property;
    }

    public PropertyDTO addProperty(User agent, PropertyDTO dto) {

        Property property = convertToEntity(dto);

        property.setAgent(agent);
        property.setPropertyStatus("PENDING");

        Property savedProperty = propertyRepository.save(property);

        return convertToDTO(savedProperty);
    }

    public PropertyDTO getPropertyById(Integer id) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() ->
                        new PropertyNotFoundException("Property not found"));

        return convertToDTO(property);
    }

    public List<PropertyDTO> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();

        List<PropertyDTO> response = new ArrayList<>();

        for (Property property : properties) {
            response.add(convertToDTO(property));
        }

        return response;
    }

    public List<PropertyDTO> getPropertiesByAgent(Integer agentId) {
        return propertyRepository.findByAgent_Id(agentId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public PropertyDTO updateProperty(
            Integer id,
            PropertyDTO dto,
            Integer currentUserId
    ) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() ->
                        new PropertyNotFoundException("Property not found"));

        // Check property ownership
        if (property.getAgent() == null ||
                !property.getAgent().getId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to update this property"
            );
        }

        property.setTitle(dto.getTitle());
        property.setLocation(dto.getLocation());
        property.setPrice(dto.getPrice());
        property.setPropertyType(dto.getPropertyType());
        property.setListingType(dto.getListingType());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setArea(dto.getArea());
        property.setImageUrl(dto.getImageUrl());
        property.setDescription(dto.getDescription());

        Property updatedProperty = propertyRepository.save(property);

        return convertToDTO(updatedProperty);
    }

    public void deleteProperty(Integer id, Integer currentUserId) {

        Property property = propertyRepository.findById(id)
                .orElseThrow(() ->
                        new PropertyNotFoundException("Property not found"));

        // Check property ownership
        if (property.getAgent() == null ||
                !property.getAgent().getId().equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to delete this property"
            );
        }

        propertyRepository.delete(property);
    }






    public void updatePropertyStatus(Integer id, String status) {
        if (!List.of("APPROVED", "REJECTED", "PENDING").contains(status)) {
            throw new IllegalArgumentException("Invalid property status");
        }

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setPropertyStatus(status);
        propertyRepository.save(property);
    }
}