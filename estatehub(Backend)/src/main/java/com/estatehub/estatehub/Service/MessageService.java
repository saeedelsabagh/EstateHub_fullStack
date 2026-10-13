package com.estatehub.estatehub.Service;

import com.estatehub.estatehub.DTO.MessageDTO;
import com.estatehub.estatehub.Exception.UserNotFoundException;
import com.estatehub.estatehub.Repository.InquiryRepo;
import com.estatehub.estatehub.Repository.MessageRepo;
import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.model.Inquiry;
import com.estatehub.estatehub.model.Message;
import com.estatehub.estatehub.model.User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.estatehub.estatehub.Security.Authorization;

@Service
public class MessageService {


    private final MessageRepo messageRepository;
    private final InquiryRepo inquiryRepository;
    private final Authorization authorization;

    public MessageService(
            MessageRepo messageRepository,
            InquiryRepo inquiryRepository,
            Authorization authorization
    ) {
        this.messageRepository = messageRepository;
        this.inquiryRepository = inquiryRepository;
        this.authorization = authorization;
    }

    private MessageDTO convertToDTO(Message message) {

        MessageDTO dto = new MessageDTO();

        dto.setId(message.getId());
        dto.setInquiryId(message.getInquiry().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());

        return dto;
    }

    private Message convertToEntity(MessageDTO dto) {

        Inquiry inquiry = inquiryRepository.findById(dto.getInquiryId())
                .orElseThrow(() ->
                        new RuntimeException("Inquiry not found"));

        User sender = getCurrentUser();

        checkInquiryAccess(inquiry, sender);

        Message message = new Message();
        message.setInquiry(inquiry);
        message.setSender(sender);
        message.setContent(dto.getContent());

        return message;
    }

    public MessageDTO addMessage(MessageDTO dto) {

        Message message = convertToEntity(dto);

        Message savedMessage = messageRepository.save(message);

        return convertToDTO(savedMessage);
    }

    public List<MessageDTO> getMessagesByInquiry(Integer inquiryId) {

        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() ->
                        new RuntimeException("Inquiry not found"));

        User currentUser = getCurrentUser();

        checkInquiryAccess(inquiry, currentUser);

        List<MessageDTO> response = new ArrayList<>();

        for (Message message : messageRepository.findByInquiry(inquiry)) {
            response.add(convertToDTO(message));
        }

        return response;
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
