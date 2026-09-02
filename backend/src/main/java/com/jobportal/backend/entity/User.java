package com.jobportal.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    // ============================================================
    // ID
    // ============================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ============================================================
    // USER DETAILS
    // ============================================================

    @Column(name = "full_name", nullable = false)
    private String fullName;


    @Column(unique = true, nullable = false)
    private String email;


    // ============================================================
    // PASSWORD
    // ============================================================

    @JsonIgnore
    @Column(nullable = false)
    private String password;


    // ============================================================
    // ROLE
    // ============================================================

    @Column(nullable = false)
    private String role;


    // ============================================================
    // RESUME DETAILS
    // ============================================================

    @Column(name = "resume_file_name")
    private String resumeFileName;


    @Column(name = "resume_file_path")
    private String resumeFilePath;


    // ============================================================
    // GETTERS
    // ============================================================

    public Long getId() {
        return id;
    }


    public String getFullName() {
        return fullName;
    }


    public String getEmail() {
        return email;
    }


    public String getPassword() {
        return password;
    }


    public String getRole() {
        return role;
    }


    public String getResumeFileName() {
        return resumeFileName;
    }


    public String getResumeFilePath() {
        return resumeFilePath;
    }


    // ============================================================
    // SETTERS
    // ============================================================

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    public void setRole(String role) {
        this.role = role;
    }


    public void setResumeFileName(
            String resumeFileName) {

        this.resumeFileName =
                resumeFileName;
    }


    public void setResumeFilePath(
            String resumeFilePath) {

        this.resumeFilePath =
                resumeFilePath;
    }
}