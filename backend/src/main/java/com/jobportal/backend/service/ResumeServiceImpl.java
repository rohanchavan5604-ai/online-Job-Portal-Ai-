package com.jobportal.backend.service;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.UserRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final UserRepository userRepository;

    // ============================================================
    // RESUME UPLOAD DIRECTORY
    // ============================================================

    private final Path uploadDirectory =
            Paths.get("uploads", "resumes");


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public ResumeServiceImpl(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }


    // ============================================================
    // UPLOAD RESUME
    // ============================================================

    @Override
    public String uploadResume(MultipartFile file) {

        // --------------------------------------------------------
        // CHECK FILE
        // --------------------------------------------------------

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select a resume file"
            );
        }


        // --------------------------------------------------------
        // GET ORIGINAL FILE NAME
        // --------------------------------------------------------

        String originalFileName =
                file.getOriginalFilename();


        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid resume file"
            );
        }


        // --------------------------------------------------------
        // CHECK FILE TYPE
        // --------------------------------------------------------

        String contentType =
                file.getContentType();


        if (!"application/pdf".equalsIgnoreCase(
                contentType)) {

            throw new IllegalArgumentException(
                    "Only PDF resume is allowed"
            );
        }


        // --------------------------------------------------------
        // CHECK PDF EXTENSION
        // --------------------------------------------------------

        if (!originalFileName
                .toLowerCase()
                .endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF resume is allowed"
            );
        }


        // --------------------------------------------------------
        // CHECK FILE SIZE - 5 MB
        // --------------------------------------------------------

        long maxFileSize =
                5L * 1024 * 1024;


        if (file.getSize() > maxFileSize) {

            throw new IllegalArgumentException(
                    "Resume size must be less than 5 MB"
            );
        }


        // --------------------------------------------------------
        // GET LOGGED-IN USER
        // --------------------------------------------------------

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        try {

            // ----------------------------------------------------
            // CREATE UPLOAD DIRECTORY
            // ----------------------------------------------------

            Files.createDirectories(
                    uploadDirectory
            );


            // ----------------------------------------------------
            // DELETE OLD RESUME
            // ----------------------------------------------------

            if (user.getResumeFilePath() != null &&
                    !user.getResumeFilePath().isBlank()) {

                Path oldFile =
                        Paths.get(
                                user.getResumeFilePath()
                        );

                Files.deleteIfExists(oldFile);
            }


            // ----------------------------------------------------
            // CREATE UNIQUE FILE NAME
            // ----------------------------------------------------

            String fileName =
                    user.getId() + "_resume.pdf";


            Path filePath =
                    uploadDirectory.resolve(
                            fileName
                    );


            // ----------------------------------------------------
            // SAVE NEW RESUME
            // ----------------------------------------------------

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );


            // ----------------------------------------------------
            // SAVE RESUME DETAILS IN DATABASE
            // ----------------------------------------------------

            user.setResumeFileName(
                    originalFileName
            );

            user.setResumeFilePath(
                    filePath.toString()
            );


            userRepository.save(user);


            // ----------------------------------------------------
            // RETURN ORIGINAL FILE NAME
            // ----------------------------------------------------

            return originalFileName;

        }
        catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload resume",
                    e
            );
        }
    }


    // ============================================================
    // GET / VIEW RESUME
    // ============================================================

    @Override
    public Resource getResume() {

        // --------------------------------------------------------
        // GET LOGGED-IN USER
        // --------------------------------------------------------

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        // --------------------------------------------------------
        // CHECK RESUME PATH
        // --------------------------------------------------------

        if (user.getResumeFilePath() == null ||
                user.getResumeFilePath().isBlank()) {

            throw new ResourceNotFoundException(
                    "Resume not found"
            );
        }


        // --------------------------------------------------------
        // CREATE RESOURCE
        // --------------------------------------------------------

        Resource resource =
                new FileSystemResource(
                        user.getResumeFilePath()
                );


        // --------------------------------------------------------
        // CHECK FILE EXISTS
        // --------------------------------------------------------

        if (!resource.exists() ||
                !resource.isReadable()) {

            throw new ResourceNotFoundException(
                    "Resume file not found"
            );
        }


        return resource;
    }


    // ============================================================
    // DELETE RESUME
    // ============================================================

    @Override
    public void deleteResume() {

        // --------------------------------------------------------
        // GET LOGGED-IN USER
        // --------------------------------------------------------

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        // --------------------------------------------------------
        // DELETE PHYSICAL FILE
        // --------------------------------------------------------

        if (user.getResumeFilePath() != null &&
                !user.getResumeFilePath().isBlank()) {

            try {

                Path filePath =
                        Paths.get(
                                user.getResumeFilePath()
                        );


                Files.deleteIfExists(
                        filePath
                );

            }
            catch (IOException e) {

                throw new RuntimeException(
                        "Failed to delete resume",
                        e
                );
            }
        }


        // --------------------------------------------------------
        // REMOVE RESUME DETAILS FROM DATABASE
        // --------------------------------------------------------

        user.setResumeFileName(null);

        user.setResumeFilePath(null);


        userRepository.save(user);
    }
}