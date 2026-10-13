package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.DTO.InquiryDTO;
import com.estatehub.estatehub.Service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
public class InquiryCtrl {

    private final InquiryService inquiryService;

    public InquiryCtrl(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }


    @PreAuthorize("@Authorization.isUser()")
    @PostMapping("/addInquiry")
    public InquiryDTO createInquiry(
            @Valid @RequestBody InquiryDTO dto
    ) {
        return inquiryService.createInquiry(dto);
    }


    @GetMapping("/getInquiry/{id}")
    public InquiryDTO getInquiryById(
            @PathVariable Integer id
    ) {
        return inquiryService.getInquiryById(id);
    }


    @PreAuthorize("@Authorization.isUser()")
    @GetMapping("/getInquiry/user/{userId}")
    public List<InquiryDTO> getUserInquiries(
            @PathVariable Integer userId
    ) {
        return inquiryService.getUserInquiries(userId);
    }


    @PreAuthorize("@Authorization.isAgent()")
    @GetMapping("/getInquiry/agent/{agentId}")
    public List<InquiryDTO> getAgentInquiries(
            @PathVariable Integer agentId
    ) {
        return inquiryService.getAgentInquiries(agentId);
    }

    @DeleteMapping("/inquiry/{id}")
    public void deleteInquiry(
            @PathVariable Integer id
    ) {
        inquiryService.deleteInquiry(id);
    }
}