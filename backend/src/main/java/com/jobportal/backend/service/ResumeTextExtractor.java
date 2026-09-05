package com.jobportal.backend.service;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.UserRepository;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ResumeTextExtractor {

    private final UserRepository userRepository;

    public ResumeTextExtractor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String extractResumeText(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        String resumePath = user.getResumeFilePath();

        if (resumePath == null || resumePath.isBlank()) {
            throw new ResourceNotFoundException(
                    "Resume not found. Please upload your resume first."
            );
        }

        Path path = Path.of(resumePath);

        if (!Files.exists(path)) {
            throw new ResourceNotFoundException(
                    "Resume file not found."
            );
        }

        try {

            byte[] pdfBytes = Files.readAllBytes(path);

            try (var document = Loader.loadPDF(pdfBytes)) {

                PDFTextStripper stripper =
                        new PDFTextStripper();

                return stripper.getText(document);
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to extract text from resume",
                    e
            );
        }
    }
}