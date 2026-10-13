package com.estatehub.estatehub.AllTests;

import com.estatehub.estatehub.DTO.FavoriteDTO;
import com.estatehub.estatehub.DTO.InquiryDTO;
import com.estatehub.estatehub.DTO.LoginDTO;
import com.estatehub.estatehub.DTO.MessageDTO;
import com.estatehub.estatehub.DTO.PropertyDTO;
import com.estatehub.estatehub.DTO.UserDTO;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class DTOTest {

    private static Validator validator;
    private static ValidatorFactory factory;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    // =========================================================
    // FavoriteDTO
    // =========================================================

    @Test
    void favoriteDTO_NoArgsConstructorAndSettersGetters() {

        FavoriteDTO dto = new FavoriteDTO();

        dto.setId(1);
        dto.setUserId(10);
        dto.setPropertyId(20);

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getUserId());
        assertEquals(20, dto.getPropertyId());
    }

    @Test
    void favoriteDTO_AllArgsConstructor() {

        FavoriteDTO dto =
                new FavoriteDTO(1, 10, 20);

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getUserId());
        assertEquals(20, dto.getPropertyId());
    }

    @Test
    void favoriteDTO_ValidationShouldFailWhenRequiredFieldsAreNull() {

        FavoriteDTO dto = new FavoriteDTO();

        var violations = validator.validate(dto);

        assertEquals(2, violations.size());
    }

    @Test
    void favoriteDTO_ValidationShouldPassWithValidData() {

        FavoriteDTO dto =
                new FavoriteDTO(1, 10, 20);

        assertTrue(validator.validate(dto).isEmpty());
    }


    // =========================================================
    // InquiryDTO
    // =========================================================

    @Test
    void inquiryDTO_NoArgsConstructorAndSettersGetters() {

        InquiryDTO dto = new InquiryDTO();

        LocalDateTime date = LocalDateTime.now();

        dto.setId(1);
        dto.setUserId(10);
        dto.setAgentId(20);
        dto.setPropertyId(30);
        dto.setStatus("PENDING");
        dto.setCreatedAt(date);

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getUserId());
        assertEquals(20, dto.getAgentId());
        assertEquals(30, dto.getPropertyId());
        assertEquals("PENDING", dto.getStatus());
        assertEquals(date, dto.getCreatedAt());
    }

    @Test
    void inquiryDTO_AllArgsConstructor() {

        LocalDateTime date = LocalDateTime.now();

        InquiryDTO dto =
                new InquiryDTO(
                        1,
                        10,
                        20,
                        30,
                        "PENDING",
                        date
                );

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getUserId());
        assertEquals(20, dto.getAgentId());
        assertEquals(30, dto.getPropertyId());
        assertEquals("PENDING", dto.getStatus());
        assertEquals(date, dto.getCreatedAt());
    }

    @Test
    void inquiryDTO_ValidationShouldFailWhenRequiredFieldsAreMissing() {

        InquiryDTO dto = new InquiryDTO();

        var violations = validator.validate(dto);

        assertEquals(4, violations.size());
    }

    @Test
    void inquiryDTO_ValidationShouldFailWhenStatusIsBlank() {

        InquiryDTO dto =
                new InquiryDTO(
                        null,
                        10,
                        20,
                        30,
                        "",
                        null
                );

        var violations = validator.validate(dto);

        assertEquals(1, violations.size());
    }

    @Test
    void inquiryDTO_ValidationShouldPassWithValidData() {

        InquiryDTO dto =
                new InquiryDTO(
                        1,
                        10,
                        20,
                        30,
                        "PENDING",
                        LocalDateTime.now()
                );

        assertTrue(validator.validate(dto).isEmpty());
    }


    // =========================================================
    // LoginDTO
    // =========================================================

    @Test
    void loginDTO_NoArgsConstructorAndSettersGetters() {

        LoginDTO dto = new LoginDTO();

        dto.setEmail("test@gmail.com");
        dto.setPassword("123456");

        assertEquals("test@gmail.com", dto.getEmail());
        assertEquals("123456", dto.getPassword());
    }

    @Test
    void loginDTO_AllArgsConstructor() {

        LoginDTO dto =
                new LoginDTO(
                        "test@gmail.com",
                        "123456"
                );

        assertEquals("test@gmail.com", dto.getEmail());
        assertEquals("123456", dto.getPassword());
    }

    @Test
    void loginDTO_ValidationShouldFailWhenEmpty() {

        LoginDTO dto =
                new LoginDTO("", "");

        var violations = validator.validate(dto);

        assertEquals(2, violations.size());
    }

    @Test
    void loginDTO_ValidationShouldFailForInvalidEmail() {

        LoginDTO dto =
                new LoginDTO(
                        "wrong-email",
                        "123456"
                );

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage().equals("Invalid email"))
        );
    }

    @Test
    void loginDTO_ValidationShouldPassWithValidData() {

        LoginDTO dto =
                new LoginDTO(
                        "test@gmail.com",
                        "123456"
                );

        assertTrue(validator.validate(dto).isEmpty());
    }


    // =========================================================
    // MessageDTO
    // =========================================================

    @Test
    void messageDTO_NoArgsConstructorAndSettersGetters() {

        MessageDTO dto = new MessageDTO();

        LocalDateTime date = LocalDateTime.now();

        dto.setId(1);
        dto.setInquiryId(10);
        dto.setSenderId(20);
        dto.setContent("Hello");
        dto.setCreatedAt(date);

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getInquiryId());
        assertEquals(20, dto.getSenderId());
        assertEquals("Hello", dto.getContent());
        assertEquals(date, dto.getCreatedAt());
    }

    @Test
    void messageDTO_AllArgsConstructor() {

        LocalDateTime date = LocalDateTime.now();

        MessageDTO dto =
                new MessageDTO(
                        1,
                        10,
                        20,
                        "Hello",
                        date
                );

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getInquiryId());
        assertEquals(20, dto.getSenderId());
        assertEquals("Hello", dto.getContent());
        assertEquals(date, dto.getCreatedAt());
    }

    @Test
    void messageDTO_ValidationShouldFailWhenRequiredFieldsAreMissing() {

        MessageDTO dto = new MessageDTO();

        var violations = validator.validate(dto);

        assertEquals(3, violations.size());
    }

    @Test
    void messageDTO_ValidationShouldFailWhenContentIsBlank() {

        MessageDTO dto =
                new MessageDTO(
                        null,
                        10,
                        20,
                        "",
                        null
                );

        var violations = validator.validate(dto);

        assertEquals(1, violations.size());
    }

    @Test
    void messageDTO_ValidationShouldPassWithValidData() {

        MessageDTO dto =
                new MessageDTO(
                        1,
                        10,
                        20,
                        "Hello",
                        LocalDateTime.now()
                );

        assertTrue(validator.validate(dto).isEmpty());
    }


    // =========================================================
    // PropertyDTO
    // =========================================================

    private PropertyDTO createValidProperty() {

        return new PropertyDTO(
                1,
                "Modern Apartment",
                "Cairo",
                new BigDecimal("1000000"),
                "Apartment",
                "SALE",
                3,
                2,
                new BigDecimal("150"),
                "image.jpg",
                "Nice apartment",
                "AVAILABLE",
                10
        );
    }

    @Test
    void propertyDTO_NoArgsConstructorAndSettersGetters() {

        PropertyDTO dto = new PropertyDTO();

        dto.setId(1);
        dto.setTitle("House");
        dto.setLocation("Cairo");
        dto.setPrice(new BigDecimal("500000"));
        dto.setPropertyType("House");
        dto.setListingType("SALE");
        dto.setBedrooms(3);
        dto.setBathrooms(2);
        dto.setArea(new BigDecimal("200"));
        dto.setImageUrl("image.jpg");
        dto.setDescription("Nice house");
        dto.setPropertyStatus("AVAILABLE");
        dto.setAgentId(10);

        assertEquals(1, dto.getId());
        assertEquals("House", dto.getTitle());
        assertEquals("Cairo", dto.getLocation());
        assertEquals(new BigDecimal("500000"), dto.getPrice());
        assertEquals("House", dto.getPropertyType());
        assertEquals("SALE", dto.getListingType());
        assertEquals(3, dto.getBedrooms());
        assertEquals(2, dto.getBathrooms());
        assertEquals(new BigDecimal("200"), dto.getArea());
        assertEquals("image.jpg", dto.getImageUrl());
        assertEquals("Nice house", dto.getDescription());
        assertEquals("AVAILABLE", dto.getPropertyStatus());
        assertEquals(10, dto.getAgentId());
    }

    @Test
    void propertyDTO_AllArgsConstructor() {

        PropertyDTO dto = createValidProperty();

        assertEquals(1, dto.getId());
        assertEquals("Modern Apartment", dto.getTitle());
        assertEquals("Cairo", dto.getLocation());
        assertEquals(new BigDecimal("1000000"), dto.getPrice());
        assertEquals("Apartment", dto.getPropertyType());
        assertEquals("SALE", dto.getListingType());
        assertEquals(3, dto.getBedrooms());
        assertEquals(2, dto.getBathrooms());
        assertEquals(new BigDecimal("150"), dto.getArea());
        assertEquals("image.jpg", dto.getImageUrl());
        assertEquals("Nice apartment", dto.getDescription());
        assertEquals("AVAILABLE", dto.getPropertyStatus());
        assertEquals(10, dto.getAgentId());
    }

    @Test
    void propertyDTO_ValidationShouldPassWithValidData() {

        PropertyDTO dto = createValidProperty();

        assertTrue(validator.validate(dto).isEmpty());
    }

    @Test
    void propertyDTO_ValidationShouldFailWhenRequiredFieldsAreMissing() {

        PropertyDTO dto = new PropertyDTO();

        var violations = validator.validate(dto);

        assertTrue(violations.size() >= 7);
    }

    @Test
    void propertyDTO_ValidationShouldFailForNegativePrice() {

        PropertyDTO dto = createValidProperty();

        dto.setPrice(new BigDecimal("-1"));

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Price must be greater than 0"))
        );
    }

    @Test
    void propertyDTO_ValidationShouldFailForNegativeBedrooms() {

        PropertyDTO dto = createValidProperty();

        dto.setBedrooms(-1);

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Bedrooms cannot be negative"))
        );
    }

    @Test
    void propertyDTO_ValidationShouldFailForNegativeBathrooms() {

        PropertyDTO dto = createValidProperty();

        dto.setBathrooms(-1);

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Bathrooms cannot be negative"))
        );
    }

    @Test
    void propertyDTO_ValidationShouldFailForZeroArea() {

        PropertyDTO dto = createValidProperty();

        dto.setArea(BigDecimal.ZERO);

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Area must be greater than 0"))
        );
    }


    // =========================================================
    // UserDTO
    // =========================================================

    private UserDTO createValidUser() {

        return new UserDTO(
                1,
                "Saeed",
                "saeed@gmail.com",
                "123456",
                "USER"
        );
    }

    @Test
    void userDTO_NoArgsConstructorAndSettersGetters() {

        UserDTO dto = new UserDTO();

        dto.setId(1);
        dto.setName("Saeed");
        dto.setEmail("saeed@gmail.com");
        dto.setPassword("123456");
        dto.setRole("USER");

        assertEquals(1, dto.getId());
        assertEquals("Saeed", dto.getName());
        assertEquals("saeed@gmail.com", dto.getEmail());
        assertEquals("123456", dto.getPassword());
        assertEquals("USER", dto.getRole());
    }

    @Test
    void userDTO_AllArgsConstructor() {

        UserDTO dto = createValidUser();

        assertEquals(1, dto.getId());
        assertEquals("Saeed", dto.getName());
        assertEquals("saeed@gmail.com", dto.getEmail());
        assertEquals("123456", dto.getPassword());
        assertEquals("USER", dto.getRole());
    }

    @Test
    void userDTO_ValidationShouldPassWithValidUser() {

        UserDTO dto = createValidUser();

        assertTrue(validator.validate(dto).isEmpty());
    }

    @Test
    void userDTO_ValidationShouldFailWhenRequiredFieldsAreMissing() {

        UserDTO dto = new UserDTO();

        var violations = validator.validate(dto);

        assertEquals(4, violations.size());
    }

    @Test
    void userDTO_ValidationShouldFailForInvalidEmail() {

        UserDTO dto = createValidUser();

        dto.setEmail("wrong-email");

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Invalid email"))
        );
    }

    @Test
    void userDTO_ValidationShouldFailForInvalidRole() {

        UserDTO dto = createValidUser();

        dto.setRole("ADMIN");

        var violations = validator.validate(dto);

        assertTrue(
                violations.stream()
                        .anyMatch(v ->
                                v.getMessage()
                                        .equals("Role must be USER or AGENT"))
        );
    }

    @Test
    void userDTO_ValidationShouldAcceptAgentRole() {

        UserDTO dto = createValidUser();

        dto.setRole("AGENT");

        assertTrue(validator.validate(dto).isEmpty());
    }
}