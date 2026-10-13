package com.estatehub.estatehub.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class InquiryDTO {

    private Integer id;

    private Integer userId;

    private Integer agentId;

    @NotNull(message = "Property ID is required")
    private Integer propertyId;

    private String status;

    private LocalDateTime createdAt;

    public InquiryDTO() {
    }

    public InquiryDTO(
            Integer id,
            Integer userId,
            Integer agentId,
            Integer propertyId,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.userId = userId;
        this.agentId = agentId;
        this.propertyId = propertyId;
        this.status = status;
        this.createdAt = createdAt;
    }

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

    public Integer getAgentId() {
        return agentId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }

    public Integer getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Integer propertyId) {
        this.propertyId = propertyId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}