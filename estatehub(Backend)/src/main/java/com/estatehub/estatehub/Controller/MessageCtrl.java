package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.DTO.MessageDTO;
import com.estatehub.estatehub.Service.MessageService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.estatehub.estatehub.DTO.InquiryDTO;
import com.estatehub.estatehub.Service.InquiryService;
@RestController
public class MessageCtrl {

    private final MessageService messageService;
    private final InquiryService inquiryService;

    public MessageCtrl(
            MessageService messageService,
            InquiryService inquiryService
    ) {
        this.messageService = messageService;
        this.inquiryService = inquiryService;
    }
    @PreAuthorize("hasAnyRole('USER', 'AGENT')")
    @PostMapping("/addmessage")
    public MessageDTO addMessage(
            @Valid @RequestBody MessageDTO dto
    ) {
        return messageService.addMessage(dto);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/message/inquiry/{inquiryId}")
    public List<MessageDTO> getMessagesByInquiry(
            @PathVariable Integer inquiryId
    ) {
        return messageService.getMessagesByInquiry(inquiryId);
    }
}