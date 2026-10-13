package com.estatehub.estatehub.AllTests;

import com.estatehub.estatehub.Service.MessageService;
import com.estatehub.estatehub.Service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PropertyService propertyService;

    @MockitoBean
    private MessageService messageService;

    @Test
    void unauthenticatedUserCannotAccessProperties() throws Exception {
        mockMvc.perform(get("/property"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "saeed", roles = "USER")
    void authenticatedUserCanAccessProperties() throws Exception {
        when(propertyService.getAllProperties())
                .thenReturn(List.of());

        mockMvc.perform(get("/property"))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedUserCannotAccessMessages() throws Exception {
        mockMvc.perform(get("/message/inquiry/10"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "saeed", roles = "USER")
    void authenticatedUserCanAccessMessages() throws Exception {
        when(messageService.getMessagesByInquiry(10))
                .thenReturn(List.of());

        mockMvc.perform(get("/message/inquiry/10"))
                .andExpect(status().isOk());
    }
}