package com.jobportal.backend.controller;

import com.jobportal.backend.dto.UserResponse;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResumeService resumeService;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public UsersController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ResumeService resumeService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.resumeService = resumeService;
    }


    // ============================================================
    // GET ALL USERS
    // ============================================================

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }


    // ============================================================
    // CREATE USER
    // ============================================================

    @PostMapping
    public UserResponse createUser(
            @RequestBody User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        user.setRole("USER");


        User savedUser =
                userRepository.save(user);


        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }


    // ============================================================
    // UPLOAD RESUME - USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @PostMapping(
            value = "/resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        String fileName =
                resumeService.uploadResume(file);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Resume uploaded successfully",

                        "fileName",
                        fileName
                )
        );
    }


    // ============================================================
    // GET / VIEW RESUME - USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/resume")
    public ResponseEntity<Resource> getResume() {

        Resource resource =
                resumeService.getResume();


        return ResponseEntity.ok()
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                resource.getFilename() +
                                "\""
                )
                .body(resource);
    }


    // ============================================================
    // DELETE RESUME - USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/resume")
    public ResponseEntity<Map<String, String>> deleteResume() {

        resumeService.deleteResume();


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Resume deleted successfully"
                )
        );
    }
}