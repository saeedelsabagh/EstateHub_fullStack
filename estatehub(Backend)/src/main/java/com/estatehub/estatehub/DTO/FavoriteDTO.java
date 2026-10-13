package com.estatehub.estatehub.DTO;

import jakarta.validation.constraints.NotNull;

public class FavoriteDTO {

    private Integer id;

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Property ID is required")
    private Integer propertyId;


    // No Args Constructor
    public FavoriteDTO() {
    }


    // All Args Constructor
    public FavoriteDTO(Integer id, Integer userId, Integer propertyId) {
        this.id = id;
        this.userId = userId;
        this.propertyId = propertyId;
    }


    // Getters & Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Integer propertyId) {
        this.propertyId = propertyId;
    }
}