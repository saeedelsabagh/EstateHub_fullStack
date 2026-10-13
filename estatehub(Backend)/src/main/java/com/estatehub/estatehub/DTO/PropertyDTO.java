package com.estatehub.estatehub.DTO;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PropertyDTO {

    private Integer id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "Listing type is required")
    private String listingType;

    @NotNull(message = "Bedrooms is required")
    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms;

    @NotNull(message = "Bathrooms is required")
    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms;

    @Positive(message = "Area must be greater than 0")
    private BigDecimal area;

    private String imageUrl;

    private String description;

    private String propertyStatus;

    private Integer agentId;


    // No Args Constructor
    public PropertyDTO() {
    }


    // All Args Constructor
    public PropertyDTO(
            Integer id,
            String title,
            String location,
            BigDecimal price,
            String propertyType,
            String listingType,
            Integer bedrooms,
            Integer bathrooms,
            BigDecimal area,
            String imageUrl,
            String description,
            String propertyStatus,
            Integer agentId
    ) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.price = price;
        this.propertyType = propertyType;
        this.listingType = listingType;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.area = area;
        this.imageUrl = imageUrl;
        this.description = description;
        this.propertyStatus = propertyStatus;
        this.agentId = agentId;
    }


    // Getters & Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getListingType() {
        return listingType;
    }

    public void setListingType(String listingType) {
        this.listingType = listingType;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPropertyStatus() {
        return propertyStatus;
    }

    public void setPropertyStatus(String propertyStatus) {
        this.propertyStatus = propertyStatus;
    }

    public Integer getAgentId() {
        return agentId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }
}