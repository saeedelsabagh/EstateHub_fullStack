package com.estatehub.estatehub.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class MessageDTO {

    private Integer id;

    @NotNull(message = "Inquiry ID is required")
    private Integer inquiryId;

    private Integer senderId;

    @NotBlank(message = "Message content is required")
    private String content;

    private LocalDateTime createdAt;

    public MessageDTO() {
    }

    public MessageDTO(
            Integer id,
            Integer inquiryId,
            Integer senderId,
            String content,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.inquiryId = inquiryId;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(Integer inquiryId) {
        this.inquiryId = inquiryId;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}