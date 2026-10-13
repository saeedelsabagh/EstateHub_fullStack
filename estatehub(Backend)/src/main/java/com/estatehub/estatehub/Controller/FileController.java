
package com.estatehub.estatehub.controller;

import com.estatehub.estatehub.Service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No file was uploaded");
        }

        if (file.getContentType() == null ||
                !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body("Please upload an image");
        }

        String fileUrl = fileStorageService.saveFile(file);

        System.out.println("Uploaded file: " + fileUrl);

        return ResponseEntity.ok(fileUrl);
    }
}
