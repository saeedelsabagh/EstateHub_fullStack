package com.estatehub.estatehub.Service;

import com.estatehub.estatehub.DTO.InquiryDTO;
import com.estatehub.estatehub.Exception.PropertyNotFoundException;
import com.estatehub.estatehub.Exception.UserNotFoundException;
import com.estatehub.estatehub.Repository.InquiryRepo;
import com.estatehub.estatehub.Repository.ProperityRepo;
import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.model.Inquiry;
import com.estatehub.estatehub.model.Property;
import com.estatehub.estatehub.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import com.estatehub.estatehub.Security.Authorization;
@Service
public class InquiryService {

    private final InquiryRepo inquiryRepository;
    private final UserRepo userRepository;
    private final ProperityRepo propertyRepository;
    private final Authorization authorization;
    public InquiryService(
            InquiryRepo inquiryRepository,
            UserRepo userRepository,
            ProperityRepo propertyRepository,
            Authorization authorization
    ) {
        this.inquiryRepository = inquiryRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.authorization = authorization;
    }

    private InquiryDTO convertToDTO(Inquiry inquiry) {

        InquiryDTO dto = new InquiryDTO();

        dto.setId(inquiry.getId());
        dto.setUserId(inquiry.getUser().getId());
        dto.setAgentId(inquiry.getAgent().getId());
        dto.setPropertyId(inquiry.getProperty().getId());
        dto.setStatus(inquiry.getStatus());
        dto.setCreatedAt(inquiry.getCreatedAt());

        return dto;
    }

    private Inquiry convertToEntity(InquiryDTO dto) {

        User user = getCurrentUser();

        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() ->
                        new PropertyNotFoundException("Property not found"));

        Inquiry inquiry = new Inquiry();

        inquiry.setUser(user);
        inquiry.setAgent(property.getAgent());
        inquiry.setProperty(property);
        inquiry.setStatus("ACTIVE");

        return inquiry;
    }

    public InquiryDTO createInquiry(InquiryDTO dto) {

        Inquiry inquiry = convertToEntity(dto);

        Inquiry savedInquiry = inquiryRepository.save(inquiry);

        return convertToDTO(savedInquiry);
    }

    public InquiryDTO getInquiryById(Integer id) {

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inquiry not found"));

        User currentUser = getCurrentUser();
        checkInquiryAccess(inquiry, currentUser);

        return convertToDTO(inquiry);
    }

    public List<InquiryDTO> getUserInquiries(Integer userId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You can only view your own inquiries"
            );
        }

        List<InquiryDTO> response = new ArrayList<>();

        for (Inquiry inquiry : inquiryRepository.findByUser(currentUser)) {
            response.add(convertToDTO(inquiry));
        }

        return response;
    }


    public List<InquiryDTO> getAgentInquiries(Integer agentId) {

        User currentUser = getCurrentUser();

        if (!currentUser.getId().equals(agentId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You can only view your own inquiries"
            );
        }

        if (!"AGENT".equals(currentUser.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Only agents can view agent inquiries"
            );
        }

        List<InquiryDTO> response = new ArrayList<>();

        for (Inquiry inquiry : inquiryRepository.findByAgent(currentUser)) {
            response.add(convertToDTO(inquiry));
        }

        return response;
    }

    public void deleteInquiry(Integer id) {

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inquiry not found"));

        User currentUser = getCurrentUser();
        checkInquiryAccess(inquiry, currentUser);

        inquiryRepository.delete(inquiry);
    }




    private User getCurrentUser() {
        User user = authorization.getCurrentUser();

        if (user == null) {
            throw new org.springframework.security.authentication
                    .AuthenticationCredentialsNotFoundException(
                    "Authenticated user not found"
            );
        }

        return user;
    }

    private void checkInquiryAccess(Inquiry inquiry, User currentUser) {

        boolean isOwner =
                inquiry.getUser().getId().equals(currentUser.getId());

        boolean isAgent =
                inquiry.getAgent().getId().equals(currentUser.getId());

        if (!isOwner && !isAgent) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to access this inquiry"
            );
        }
    }

}