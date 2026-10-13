//
//package com.estatehub.estatehub.AllTests;
//
//import com.estatehub.estatehub.DTO.*;
//import com.estatehub.estatehub.Exception.LoginException;
//import com.estatehub.estatehub.Exception.PropertyNotFoundException;
//import com.estatehub.estatehub.Exception.UserNotFoundException;
//import com.estatehub.estatehub.Repository.*;
//import com.estatehub.estatehub.Security.JwtService;
//import com.estatehub.estatehub.Service.*;
//import com.estatehub.estatehub.model.*;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.junit.jupiter.api.io.TempDir;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.context.bean.override.mockito.MockitoBean;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class Test {
//
//    @Mock
//    private UserRepo userRepo;
//
//    @InjectMocks
//    private UserService userService;
//
//    private User user1;
//    private User user2;
//
//    @BeforeEach
//    void setUp() {
//        user1 = new User();
//        user1.setId(1);
//        user2 = new User();
//        user2.setId(2);
//    }
//
//    @org.junit.jupiter.api.Test
//    void getAllUsersSuccessfully() {
//        when(userRepo.findAll()).thenReturn(List.of(user1, user2));
//
//        List<User> result = userService.getAllUsers();
//
//        assertNotNull(result);
//        assertEquals(2, result.size());
//        assertEquals(1, result.get(0).getId());
//        assertEquals(2, result.get(1).getId());
//
//        verify(userRepo).findAll();
//    }
//
//    @org.junit.jupiter.api.Test
//    void getAllUsersWhenEmpty() {
//        when(userRepo.findAll()).thenReturn(List.of());
//
//        List<User> result = userService.getAllUsers();
//
//        assertNotNull(result);
//        assertTrue(result.isEmpty());
//
//        verify(userRepo).findAll();
//    }
//
//    @org.junit.jupiter.api.Test
//    void findUserByEmailSuccessfully() {
//        String email = "saeed@example.com";
//
//        when(userRepo.findByEmail(email)).thenReturn(Optional.of(user1));
//
//        Optional<User> result = userService.findUserByEmail(email);
//
//        assertTrue(result.isPresent());
//        assertEquals(1, result.get().getId());
//
//        verify(userRepo).findByEmail(email);
//    }
//
//    @org.junit.jupiter.api.Test
//    void findUserByEmailWhenNotFound() {
//        String email = "notfound@example.com";
//
//        when(userRepo.findByEmail(email)).thenReturn(Optional.empty());
//
//        Optional<User> result = userService.findUserByEmail(email);
//
//        assertTrue(result.isEmpty());
//
//        verify(userRepo).findByEmail(email);
//    }
//
//    @SpringBootTest
//    static
//    class EstatehubApplicationTests {
//
//        @org.junit.jupiter.api.Test
//        void contextLoads() {
//        }
//
//    }
//
//    @SpringBootTest
//    static
//    class FavServiceTest {
//
//        @Autowired
//        private FavService favService;
//
//        @MockitoBean
//        private FavRepo favoriteRepository;
//
//        @MockitoBean
//        private UserRepo userRepository;
//
//        @MockitoBean
//        private ProperityRepo propertyRepository;
//
//
//        private User createUser() {
//            User user = new User();
//            user.setId(1);
//            user.setName("Saeed");
//            user.setEmail("saeed@test.com");
//            user.setRole("USER");
//            return user;
//        }
//
//
//        private Property createProperty() {
//            Property property = new Property();
//            property.setId(10);
//            property.setTitle("Modern Apartment");
//            property.setLocation("New Cairo");
//            property.setPropertyType("Apartment");
//            property.setListingType("SALE");
//            property.setDescription("Modern apartment");
//            property.setPropertyStatus("APPROVED");
//            return property;
//        }
//
//
//        private FavoriteDTO createFavoriteDTO() {
//            FavoriteDTO dto = new FavoriteDTO();
//            dto.setUserId(1);
//            dto.setPropertyId(10);
//            return dto;
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void toggleFavoriteAddSuccessfully() {
//
//            User user = createUser();
//            Property property = createProperty();
//            FavoriteDTO dto = createFavoriteDTO();
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(user));
//
//            when(propertyRepository.findById(10))
//                    .thenReturn(Optional.of(property));
//
//            when(favoriteRepository.findByUserAndProperty(user, property))
//                    .thenReturn(Optional.empty());
//
//            when(favoriteRepository.save(any(Favorite.class)))
//                    .thenAnswer(invocation -> {
//                        Favorite favorite = invocation.getArgument(0);
//                        favorite.setId(100);
//                        return favorite;
//                    });
//
//            FavoriteDTO result = favService.toggleFavorite(dto);
//
//            assertNotNull(result);
//            assertEquals(100, result.getId());
//            assertEquals(1, result.getUserId());
//            assertEquals(10, result.getPropertyId());
//
//            verify(favoriteRepository, times(1))
//                    .save(any(Favorite.class));
//
//            verify(favoriteRepository, never())
//                    .delete(any(Favorite.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void toggleFavoriteRemoveSuccessfully() {
//
//            User user = createUser();
//            Property property = createProperty();
//            FavoriteDTO dto = createFavoriteDTO();
//
//            Favorite existingFavorite = new Favorite();
//            existingFavorite.setId(100);
//            existingFavorite.setUser(user);
//            existingFavorite.setProperty(property);
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(user));
//
//            when(propertyRepository.findById(10))
//                    .thenReturn(Optional.of(property));
//
//            when(favoriteRepository.findByUserAndProperty(user, property))
//                    .thenReturn(Optional.of(existingFavorite));
//
//            FavoriteDTO result = favService.toggleFavorite(dto);
//
//            assertNull(result);
//
//            verify(favoriteRepository, times(1))
//                    .delete(existingFavorite);
//
//            verify(favoriteRepository, never())
//                    .save(any(Favorite.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void toggleFavoriteUserNotFound() {
//
//            FavoriteDTO dto = createFavoriteDTO();
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    UserNotFoundException.class,
//                    () -> favService.toggleFavorite(dto)
//            );
//
//            verify(favoriteRepository, never())
//                    .save(any(Favorite.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void toggleFavoritePropertyNotFound() {
//
//            FavoriteDTO dto = createFavoriteDTO();
//            User user = createUser();
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(user));
//
//            when(propertyRepository.findById(10))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    PropertyNotFoundException.class,
//                    () -> favService.toggleFavorite(dto)
//            );
//
//            verify(favoriteRepository, never())
//                    .save(any(Favorite.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getFavoritePostsSuccessfully() {
//
//            User user = createUser();
//            Property property1 = createProperty();
//
//            Property property2 = createProperty();
//            property2.setId(20);
//            property2.setTitle("Luxury Villa");
//
//            Favorite favorite1 = new Favorite();
//            favorite1.setId(100);
//            favorite1.setUser(user);
//            favorite1.setProperty(property1);
//
//            Favorite favorite2 = new Favorite();
//            favorite2.setId(101);
//            favorite2.setUser(user);
//            favorite2.setProperty(property2);
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(user));
//
//            when(favoriteRepository.findByUser(user))
//                    .thenReturn(List.of(favorite1, favorite2));
//
//            List<PropertyDTO> result = favService.getFavoritePosts(1);
//
//            assertNotNull(result);
//            assertEquals(2, result.size());
//            assertEquals(10, result.get(0).getId());
//            assertEquals("Modern Apartment", result.get(0).getTitle());
//            assertEquals(20, result.get(1).getId());
//            assertEquals("Luxury Villa", result.get(1).getTitle());
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getFavoritePostsWhenEmpty() {
//
//            User user = createUser();
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(user));
//
//            when(favoriteRepository.findByUser(user))
//                    .thenReturn(List.of());
//
//            List<PropertyDTO> result = favService.getFavoritePosts(1);
//
//            assertNotNull(result);
//            assertTrue(result.isEmpty());
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getFavoritePostsUserNotFound() {
//
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    UserNotFoundException.class,
//                    () -> favService.getFavoritePosts(1)
//            );
//
//            verify(favoriteRepository, never())
//                    .findByUser(any(User.class));
//        }
//    }
//
//    static class FileStorageServiceTest {
//
//        @TempDir
//        Path tempDir;
//
//        @org.junit.jupiter.api.Test
//        void saveFileSuccessfully() throws IOException {
//
//            FileStorageService fileStorageService =
//                    new FileStorageService(tempDir);
//
//            MockMultipartFile file = new MockMultipartFile(
//                    "file",
//                    "house.jpg",
//                    "image/jpeg",
//                    "image content".getBytes()
//            );
//
//            String result = fileStorageService.saveFile(file);
//
//            assertNotNull(result);
//            assertTrue(result.startsWith("/uploads/"));
//            assertTrue(result.endsWith("_house.jpg"));
//
//            Path savedFile = tempDir.resolve(
//                    result.substring("/uploads/".length())
//            );
//
//            assertTrue(Files.exists(savedFile));
//            assertArrayEquals(
//                    "image content".getBytes(),
//                    Files.readAllBytes(savedFile)
//            );
//        }
//
//        @org.junit.jupiter.api.Test
//        void saveEmptyFileSuccessfully() throws IOException {
//
//            FileStorageService fileStorageService =
//                    new FileStorageService(tempDir);
//
//            MockMultipartFile file = new MockMultipartFile(
//                    "file",
//                    "empty.jpg",
//                    "image/jpeg",
//                    new byte[0]
//            );
//
//            String result = fileStorageService.saveFile(file);
//
//            assertNotNull(result);
//            assertTrue(result.startsWith("/uploads/"));
//
//            Path savedFile = tempDir.resolve(
//                    result.substring("/uploads/".length())
//            );
//
//            assertTrue(Files.exists(savedFile));
//            assertEquals(0, Files.size(savedFile));
//        }
//    }
//
//    @ExtendWith(MockitoExtension.class)
//    static
//    class InquiryServiceTest {
//
//        @Mock
//        private InquiryRepo inquiryRepository;
//
//        @Mock
//        private UserRepo userRepository;
//
//        @Mock
//        private ProperityRepo propertyRepository;
//
//        @InjectMocks
//        private InquiryService inquiryService;
//
//        private User user;
//        private User agent;
//        private Property property;
//        private Inquiry inquiry;
//        private InquiryDTO dto;
//
//        @BeforeEach
//        void setUp() {
//            user = new User();
//            user.setId(1);
//
//            agent = new User();
//            agent.setId(2);
//
//            property = new Property();
//            property.setId(10);
//            property.setAgent(agent);
//
//            inquiry = new Inquiry();
//            inquiry.setId(100);
//            inquiry.setUser(user);
//            inquiry.setAgent(agent);
//            inquiry.setProperty(property);
//            inquiry.setStatus("ACTIVE");
//
//            dto = new InquiryDTO();
//            dto.setUserId(1);
//            dto.setPropertyId(10);
//        }
//
//        @org.junit.jupiter.api.Test
//        void createInquirySuccessfully() {
//            when(userRepository.findById(1)).thenReturn(Optional.of(user));
//            when(propertyRepository.findById(10)).thenReturn(Optional.of(property));
//            when(inquiryRepository.save(any(Inquiry.class))).thenReturn(inquiry);
//
//            InquiryDTO result = inquiryService.createInquiry(dto);
//
//            assertNotNull(result);
//            assertEquals(100, result.getId());
//            assertEquals(1, result.getUserId());
//            assertEquals(2, result.getAgentId());
//            assertEquals(10, result.getPropertyId());
//            assertEquals("ACTIVE", result.getStatus());
//
//            verify(inquiryRepository).save(any(Inquiry.class));
//        }
//
//        @org.junit.jupiter.api.Test
//        void createInquiryWhenUserNotFound() {
//            when(userRepository.findById(1)).thenReturn(Optional.empty());
//
//            assertThrows(UserNotFoundException.class,
//                    () -> inquiryService.createInquiry(dto));
//
//            verify(inquiryRepository, never()).save(any());
//        }
//
//        @org.junit.jupiter.api.Test
//        void createInquiryWhenPropertyNotFound() {
//            when(userRepository.findById(1)).thenReturn(Optional.of(user));
//            when(propertyRepository.findById(10)).thenReturn(Optional.empty());
//
//            assertThrows(PropertyNotFoundException.class,
//                    () -> inquiryService.createInquiry(dto));
//
//            verify(inquiryRepository, never()).save(any());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getInquiryByIdSuccessfully() {
//            when(inquiryRepository.findById(100)).thenReturn(Optional.of(inquiry));
//
//            InquiryDTO result = inquiryService.getInquiryById(100);
//
//            assertNotNull(result);
//            assertEquals(100, result.getId());
//            assertEquals(1, result.getUserId());
//            assertEquals(2, result.getAgentId());
//            assertEquals(10, result.getPropertyId());
//            assertEquals("ACTIVE", result.getStatus());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getInquiryByIdWhenNotFound() {
//            when(inquiryRepository.findById(100)).thenReturn(Optional.empty());
//
//            assertThrows(RuntimeException.class,
//                    () -> inquiryService.getInquiryById(100));
//        }
//
//        @org.junit.jupiter.api.Test
//        void getUserInquiriesSuccessfully() {
//            when(userRepository.findById(1)).thenReturn(Optional.of(user));
//            when(inquiryRepository.findByUser(user)).thenReturn(List.of(inquiry));
//
//            List<InquiryDTO> result = inquiryService.getUserInquiries(1);
//
//            assertNotNull(result);
//            assertEquals(1, result.size());
//            assertEquals(100, result.get(0).getId());
//            assertEquals(1, result.get(0).getUserId());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getUserInquiriesWhenUserNotFound() {
//            when(userRepository.findById(1)).thenReturn(Optional.empty());
//
//            assertThrows(UserNotFoundException.class,
//                    () -> inquiryService.getUserInquiries(1));
//        }
//
//        @org.junit.jupiter.api.Test
//        void getUserInquiriesWhenEmpty() {
//            when(userRepository.findById(1)).thenReturn(Optional.of(user));
//            when(inquiryRepository.findByUser(user)).thenReturn(List.of());
//
//            List<InquiryDTO> result = inquiryService.getUserInquiries(1);
//
//            assertNotNull(result);
//            assertTrue(result.isEmpty());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getAgentInquiriesSuccessfully() {
//            when(userRepository.findById(2)).thenReturn(Optional.of(agent));
//            when(inquiryRepository.findByAgent(agent)).thenReturn(List.of(inquiry));
//
//            List<InquiryDTO> result = inquiryService.getAgentInquiries(2);
//
//            assertNotNull(result);
//            assertEquals(1, result.size());
//            assertEquals(100, result.get(0).getId());
//            assertEquals(2, result.get(0).getAgentId());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getAgentInquiriesWhenAgentNotFound() {
//            when(userRepository.findById(2)).thenReturn(Optional.empty());
//
//            assertThrows(UserNotFoundException.class,
//                    () -> inquiryService.getAgentInquiries(2));
//        }
//
//        @org.junit.jupiter.api.Test
//        void getAgentInquiriesWhenEmpty() {
//            when(userRepository.findById(2)).thenReturn(Optional.of(agent));
//            when(inquiryRepository.findByAgent(agent)).thenReturn(List.of());
//
//            List<InquiryDTO> result = inquiryService.getAgentInquiries(2);
//
//            assertNotNull(result);
//            assertTrue(result.isEmpty());
//        }
//
//        @org.junit.jupiter.api.Test
//        void deleteInquirySuccessfully() {
//            when(inquiryRepository.findById(100)).thenReturn(Optional.of(inquiry));
//
//            inquiryService.deleteInquiry(100);
//
//            verify(inquiryRepository).delete(inquiry);
//        }
//
//        @org.junit.jupiter.api.Test
//        void deleteInquiryWhenNotFound() {
//            when(inquiryRepository.findById(100)).thenReturn(Optional.empty());
//
//            assertThrows(RuntimeException.class,
//                    () -> inquiryService.deleteInquiry(100));
//
//            verify(inquiryRepository, never()).delete(any());
//        }
//    }
//
//    @ExtendWith(MockitoExtension.class)
//    static
//    class MessageServiceTest {
//
//        @Mock
//        private MessageRepo messageRepository;
//
//        @Mock
//        private InquiryRepo inquiryRepository;
//
//        @Mock
//        private UserRepo userRepository;
//
//        @InjectMocks
//        private MessageService messageService;
//
//        private Inquiry inquiry;
//        private User sender;
//        private Message message;
//        private MessageDTO dto;
//
//        @BeforeEach
//        void setUp() {
//            inquiry = new Inquiry();
//            inquiry.setId(10);
//
//            sender = new User();
//            sender.setId(1);
//
//            message = new Message();
//            message.setId(100);
//            message.setInquiry(inquiry);
//            message.setSender(sender);
//            message.setContent("Hello, I am interested in this property.");
//
//            dto = new MessageDTO();
//            dto.setInquiryId(10);
//            dto.setSenderId(1);
//            dto.setContent("Hello, I am interested in this property.");
//        }
//
//        @org.junit.jupiter.api.Test
//        void addMessageSuccessfully() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.of(inquiry));
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.of(sender));
//            when(messageRepository.save(any(Message.class)))
//                    .thenReturn(message);
//
//            MessageDTO result = messageService.addMessage(dto);
//
//            assertNotNull(result);
//            assertEquals(100, result.getId());
//            assertEquals(10, result.getInquiryId());
//            assertEquals(1, result.getSenderId());
//            assertEquals(
//                    "Hello, I am interested in this property.",
//                    result.getContent()
//            );
//
//            verify(messageRepository).save(any(Message.class));
//        }
//
//        @org.junit.jupiter.api.Test
//        void addMessageWhenInquiryNotFound() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(RuntimeException.class,
//                    () -> messageService.addMessage(dto));
//
//            verify(messageRepository, never()).save(any(Message.class));
//        }
//
//        @org.junit.jupiter.api.Test
//        void addMessageWhenSenderNotFound() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.of(inquiry));
//            when(userRepository.findById(1))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(UserNotFoundException.class,
//                    () -> messageService.addMessage(dto));
//
//            verify(messageRepository, never()).save(any(Message.class));
//        }
//
//        @org.junit.jupiter.api.Test
//        void getMessagesByInquirySuccessfully() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.of(inquiry));
//            when(messageRepository.findByInquiry(inquiry))
//                    .thenReturn(List.of(message));
//
//            List<MessageDTO> result =
//                    messageService.getMessagesByInquiry(10);
//
//            assertNotNull(result);
//            assertEquals(1, result.size());
//            assertEquals(100, result.get(0).getId());
//            assertEquals(10, result.get(0).getInquiryId());
//            assertEquals(1, result.get(0).getSenderId());
//            assertEquals(
//                    "Hello, I am interested in this property.",
//                    result.get(0).getContent()
//            );
//        }
//
//        @org.junit.jupiter.api.Test
//        void getMessagesByInquiryWhenInquiryNotFound() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(RuntimeException.class,
//                    () -> messageService.getMessagesByInquiry(10));
//
//            verify(messageRepository, never()).findByInquiry(any());
//        }
//
//        @org.junit.jupiter.api.Test
//        void getMessagesByInquiryWhenEmpty() {
//            when(inquiryRepository.findById(10))
//                    .thenReturn(Optional.of(inquiry));
//            when(messageRepository.findByInquiry(inquiry))
//                    .thenReturn(List.of());
//
//            List<MessageDTO> result =
//                    messageService.getMessagesByInquiry(10);
//
//            assertNotNull(result);
//            assertTrue(result.isEmpty());
//        }
//    }
//
//    @SpringBootTest
//    static
//    class PropertyServiceTest {
//
//        @Autowired
//        private PropertyService propertyService;
//
//        @MockitoBean
//        private ProperityRepo propertyRepository;
//
//        @MockitoBean
//        private UserRepo userRepository;
//
//
//        private User createAgent() {
//            User agent = new User();
//            agent.setId(10);
//            agent.setName("Agent");
//            agent.setEmail("agent@test.com");
//            agent.setRole("AGENT");
//            return agent;
//        }
//
//
//        private PropertyDTO createPropertyDTO() {
//            PropertyDTO dto = new PropertyDTO();
//            dto.setTitle("Modern Apartment");
//            dto.setLocation("New Cairo");
//            dto.setPropertyType("Apartment");
//            dto.setListingType("SALE");
//            dto.setImageUrl("/uploads/apartment.jpg");
//            dto.setDescription("Modern apartment in Cairo");
//            dto.setPropertyStatus("PENDING");
//            return dto;
//        }
//
//
//        private Property createProperty(Integer id, User agent) {
//            Property property = new Property();
//            property.setId(id);
//            property.setTitle("Modern Apartment");
//            property.setLocation("New Cairo");
//            property.setPropertyType("Apartment");
//            property.setListingType("SALE");
//            property.setImageUrl("/uploads/apartment.jpg");
//            property.setDescription("Modern apartment in Cairo");
//            property.setPropertyStatus("PENDING");
//            property.setAgent(agent);
//            return property;
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void addPropertySuccessfully() {
//
//            User agent = createAgent();
//            PropertyDTO dto = createPropertyDTO();
//
//            when(userRepository.findById(10))
//                    .thenReturn(Optional.of(agent));
//
//            when(propertyRepository.save(any(Property.class)))
//                    .thenAnswer(invocation -> {
//                        Property property = invocation.getArgument(0);
//                        property.setId(1);
//                        return property;
//                    });
//
//            PropertyDTO result = propertyService.addProperty(10, dto);
//
//            assertNotNull(result);
//            assertEquals(1, result.getId());
//            assertEquals("Modern Apartment", result.getTitle());
//            assertEquals("New Cairo", result.getLocation());
//            assertEquals("PENDING", result.getPropertyStatus());
//            assertEquals(10, result.getAgentId());
//
//            verify(propertyRepository, times(1))
//                    .save(any(Property.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void addPropertyWithNonExistingAgent() {
//
//            PropertyDTO dto = createPropertyDTO();
//
//            when(userRepository.findById(99))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    UserNotFoundException.class,
//                    () -> propertyService.addProperty(99, dto)
//            );
//
//            verify(propertyRepository, never())
//                    .save(any(Property.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getPropertyByIdSuccessfully() {
//
//            User agent = createAgent();
//            Property property = createProperty(1, agent);
//
//            when(propertyRepository.findById(1))
//                    .thenReturn(Optional.of(property));
//
//            PropertyDTO result = propertyService.getPropertyById(1);
//
//            assertNotNull(result);
//            assertEquals(1, result.getId());
//            assertEquals("Modern Apartment", result.getTitle());
//            assertEquals("New Cairo", result.getLocation());
//            assertEquals(10, result.getAgentId());
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getPropertyByIdNotFound() {
//
//            when(propertyRepository.findById(99))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    PropertyNotFoundException.class,
//                    () -> propertyService.getPropertyById(99)
//            );
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getAllPropertiesSuccessfully() {
//
//            User agent = createAgent();
//
//            Property property1 = createProperty(1, agent);
//            Property property2 = createProperty(2, agent);
//            property2.setTitle("Luxury Villa");
//
//            when(propertyRepository.findAll())
//                    .thenReturn(List.of(property1, property2));
//
//            List<PropertyDTO> result = propertyService.getAllProperties();
//
//            assertNotNull(result);
//            assertEquals(2, result.size());
//            assertEquals("Modern Apartment", result.get(0).getTitle());
//            assertEquals("Luxury Villa", result.get(1).getTitle());
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void getAllPropertiesWhenEmpty() {
//
//            when(propertyRepository.findAll())
//                    .thenReturn(List.of());
//
//            List<PropertyDTO> result = propertyService.getAllProperties();
//
//            assertNotNull(result);
//            assertTrue(result.isEmpty());
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void updatePropertySuccessfully() {
//
//            User agent = createAgent();
//            Property property = createProperty(1, agent);
//
//            PropertyDTO dto = createPropertyDTO();
//            dto.setTitle("Updated Apartment");
//            dto.setLocation("Sheikh Zayed");
//            dto.setDescription("Updated description");
//
//            when(propertyRepository.findById(1))
//                    .thenReturn(Optional.of(property));
//
//            when(propertyRepository.save(any(Property.class)))
//                    .thenAnswer(invocation -> invocation.getArgument(0));
//
//            PropertyDTO result = propertyService.updateProperty(1, dto);
//
//            assertNotNull(result);
//            assertEquals(1, result.getId());
//            assertEquals("Updated Apartment", result.getTitle());
//            assertEquals("Sheikh Zayed", result.getLocation());
//            assertEquals("Updated description", result.getDescription());
//            assertEquals(10, result.getAgentId());
//
//            verify(propertyRepository, times(1))
//                    .save(any(Property.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void updatePropertyNotFound() {
//
//            PropertyDTO dto = createPropertyDTO();
//
//            when(propertyRepository.findById(99))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    PropertyNotFoundException.class,
//                    () -> propertyService.updateProperty(99, dto)
//            );
//
//            verify(propertyRepository, never())
//                    .save(any(Property.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void deletePropertySuccessfully() {
//
//            User agent = createAgent();
//            Property property = createProperty(1, agent);
//
//            when(propertyRepository.findById(1))
//                    .thenReturn(Optional.of(property));
//
//            assertDoesNotThrow(
//                    () -> propertyService.deleteProperty(1)
//            );
//
//            verify(propertyRepository, times(1))
//                    .delete(property);
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void deletePropertyNotFound() {
//
//            when(propertyRepository.findById(99))
//                    .thenReturn(Optional.empty());
//
//            assertThrows(
//                    PropertyNotFoundException.class,
//                    () -> propertyService.deleteProperty(99)
//            );
//
//            verify(propertyRepository, never())
//                    .delete(any(Property.class));
//        }
//    }
//
//    @SpringBootTest
//    static
//    class SecurityServiceTest {
//
//        @Autowired
//        private SecurityService securityService;
//
//        @Autowired
//        private PasswordEncoder passwordEncoder;
//
//        @MockitoBean
//        private UserRepo userRepo;
//
//        @MockitoBean
//        private AuthenticationManager authenticationManager;
//
//        @MockitoBean
//        private JwtService jwtService;
//
//
//        @org.junit.jupiter.api.Test
//        void addUserSuccessfully() {
//
//            UserDTO dto = new UserDTO(
//                    null,
//                    "Saeed",
//                    "saeed.test@gmail.com",
//                    "Saeed@123",
//                    "USER"
//            );
//
//            when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
//                User user = invocation.getArgument(0);
//                user.setId(1);
//                return user;
//            });
//
//            UserDTO result = securityService.addUser(dto);
//
//            assertNotNull(result);
//            assertEquals(1, result.getId());
//            assertEquals("Saeed", result.getName());
//            assertEquals("saeed.test@gmail.com", result.getEmail());
//            assertEquals("USER", result.getRole());
//            assertNull(result.getPassword());
//
//            verify(userRepo, times(1)).save(any(User.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void addAgentSuccessfully() {
//
//            UserDTO dto = new UserDTO(
//                    null,
//                    "Agent",
//                    "agent.test@gmail.com",
//                    "Agent@123",
//                    "AGENT"
//            );
//
//            when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
//                User user = invocation.getArgument(0);
//                user.setId(2);
//                return user;
//            });
//
//            UserDTO result = securityService.addUser(dto);
//
//            assertNotNull(result);
//            assertEquals(2, result.getId());
//            assertEquals("AGENT", result.getRole());
//
//            verify(userRepo, times(1)).save(any(User.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void addUserWithInvalidRole() {
//
//            UserDTO dto = new UserDTO(
//                    null,
//                    "Saeed",
//                    "saeed.test@gmail.com",
//                    "Saeed@123",
//                    "ADMIN"
//            );
//
//            assertThrows(
//                    IllegalArgumentException.class,
//                    () -> securityService.addUser(dto)
//            );
//
//            verify(userRepo, never()).save(any(User.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void addUserWithNullRole() {
//
//            UserDTO dto = new UserDTO(
//                    null,
//                    "Saeed",
//                    "saeed.test@gmail.com",
//                    "Saeed@123",
//                    null
//            );
//
//            when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
//                User user = invocation.getArgument(0);
//                user.setId(3);
//                return user;
//            });
//
//            UserDTO result = securityService.addUser(dto);
//
//            assertEquals("USER", result.getRole());
//
//            verify(userRepo, times(1)).save(any(User.class));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void passwordShouldBeEncoded() {
//
//            UserDTO dto = new UserDTO(
//                    null,
//                    "Saeed",
//                    "password.test@gmail.com",
//                    "Saeed@123",
//                    "USER"
//            );
//
//            when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
//                User user = invocation.getArgument(0);
//                user.setId(4);
//                return user;
//            });
//
//            securityService.addUser(dto);
//
//            verify(userRepo).save(argThat(user ->
//                    !user.getPassword().equals("Saeed@123")
//                            && passwordEncoder.matches(
//                            "Saeed@123",
//                            user.getPassword()
//                    )
//            ));
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void loginSuccessfully() {
//
//            LoginDTO dto = new LoginDTO();
//            dto.setEmail("saeed.test@gmail.com");
//            dto.setPassword("Saeed@123");
//
//            when(jwtService.generateToken("saeed.test@gmail.com"))
//                    .thenReturn("test.jwt.token");
//
//            String token = securityService.login(dto);
//
//            assertNotNull(token);
//            assertEquals("test.jwt.token", token);
//
//            verify(authenticationManager, times(1))
//                    .authenticate(any());
//
//            verify(jwtService, times(1))
//                    .generateToken("saeed.test@gmail.com");
//        }
//
//
//        @org.junit.jupiter.api.Test
//        void loginWithInvalidCredentials() {
//
//            LoginDTO dto = new LoginDTO();
//            dto.setEmail("wrong@gmail.com");
//            dto.setPassword("Wrong@123");
//
//            when(authenticationManager.authenticate(any()))
//                    .thenThrow(new BadCredentialsException("Invalid credentials"));
//
//            assertThrows(
//                    LoginException.class,
//                    () -> securityService.login(dto)
//            );
//
//            verify(jwtService, never()).generateToken(any());
//        }
//    }
//}
