package com.estatehub.estatehub.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService() {
        this(Path.of(System.getProperty("user.dir"), "uploads"));
    }

    public FileStorageService(Path uploadPath) {
        this.uploadPath = uploadPath;
    }


    public String saveFile(MultipartFile file) throws IOException {
        Files.createDirectories(uploadPath);

        String originalFileName = Path.of(file.getOriginalFilename())
                .getFileName()
                .toString();

        String fileName = System.currentTimeMillis()
                + "_" + originalFileName;

        Path filePath = uploadPath.resolve(fileName);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath);
        }

        return "/uploads/" + fileName;
    }
}