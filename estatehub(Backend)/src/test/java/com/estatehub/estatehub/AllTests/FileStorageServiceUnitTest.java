package com.estatehub.estatehub.AllTests;

import com.estatehub.estatehub.Service.FileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceUnitTest {
    @TempDir Path tempDir;

    @Test
    void savesFileAndReturnsUploadUrl() throws Exception {
        FileStorageService service = new FileStorageService(tempDir);
        MockMultipartFile file = new MockMultipartFile("file", "home.jpg", "image/jpeg", "image-bytes".getBytes());
        String url = service.saveFile(file);
        assertTrue(url.startsWith("/uploads/"));
        Path savedFile = tempDir.resolve(url.substring("/uploads/".length()));
        assertTrue(Files.exists(savedFile));
        assertArrayEquals("image-bytes".getBytes(), Files.readAllBytes(savedFile));
    }

    @Test
    void createsUploadDirectoryWhenMissing() throws Exception {
        Path nested = tempDir.resolve("nested").resolve("uploads");
        FileStorageService service = new FileStorageService(nested);
        MockMultipartFile file = new MockMultipartFile("file", "plan.png", "image/png", new byte[]{1, 2, 3});
        String url = service.saveFile(file);
        assertTrue(Files.exists(nested));
        assertTrue(Files.exists(nested.resolve(url.substring("/uploads/".length()))));
    }
}
