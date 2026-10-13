
package com.estatehub.estatehub.AllTests;

import com.estatehub.estatehub.Service.FavService;
import com.estatehub.estatehub.Service.FileStorageService;
import com.estatehub.estatehub.Service.InquiryService;
import com.estatehub.estatehub.Service.MessageService;
import com.estatehub.estatehub.Service.PropertyService;
import com.estatehub.estatehub.Service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CtrlTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FavService favService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @MockitoBean
    private InquiryService inquiryService;

    @MockitoBean
    private MessageService messageService;

    @MockitoBean
    private PropertyService propertyService;

    @MockitoBean
    private UserService userService;


    // FAVORITE CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void getFavoritePostsTest() throws Exception {
        when(favService.getFavoritePosts(1)).thenReturn(List.of());

        mockMvc.perform(get("/favorite/1"))
                .andExpect(status().isOk());

        verify(favService).getFavoritePosts(1);
    }


    // FILE CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void uploadFileTest() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.png",
                "image/png",
                "test image".getBytes()
        );

        when(fileStorageService.saveFile(any()))
                .thenReturn("/uploads/test.png");

        mockMvc.perform(multipart("/files/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("/uploads/test.png"));

        verify(fileStorageService).saveFile(any());
    }


    // INQUIRY CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void getInquiryByIdTest() throws Exception {
        mockMvc.perform(get("/getInquiry/1"))
                .andExpect(status().isOk());

        verify(inquiryService).getInquiryById(1);
    }

    @Test
    @WithMockUser(roles = "USER")
    void deleteInquiryTest() throws Exception {
        mockMvc.perform(delete("/inquiry/1"))
                .andExpect(status().isOk());

        verify(inquiryService).deleteInquiry(1);
    }


    // MESSAGE CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void getMessagesByInquiryTest() throws Exception {
        when(messageService.getMessagesByInquiry(1))
                .thenReturn(List.of());

        mockMvc.perform(get("/message/inquiry/1"))
                .andExpect(status().isOk());

        verify(messageService).getMessagesByInquiry(1);
    }


    // PROPERTY CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void getAllPropertiesTest() throws Exception {
        when(propertyService.getAllProperties())
                .thenReturn(List.of());

        mockMvc.perform(get("/property"))
                .andExpect(status().isOk());

        verify(propertyService).getAllProperties();
    }

    @Test
    @WithMockUser(roles = "USER")
    void getPropertyByIdTest() throws Exception {
        mockMvc.perform(get("/property/1"))
                .andExpect(status().isOk());

        verify(propertyService).getPropertyById(1);
    }


    // USER CONTROLLER

    @Test
    @WithMockUser(roles = "USER")
    void getAllUsersTest() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of());

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());

        verify(userService).getAllUsers();
    }

    @Test
    @WithMockUser(roles = "USER")
    void findUserByEmailNotFoundTest() throws Exception {
        when(userService.findUserByEmail("missing@example.com"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/users/email/missing@example.com"))
                .andExpect(status().isNotFound());

        verify(userService).findUserByEmail("missing@example.com");
    }
}
