package com.jobportal.backend.dto;

import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;

    private Long jobId;

    private String jobTitle;

    private String company;

    private Double matchPercentage;

    private String message;

    private boolean read;

    private LocalDateTime createdAt;

    // =========================
    // CONSTRUCTOR
    // =========================

    public NotificationDTO(
            Long id,
            Long jobId,
            String jobTitle,
            String company,
            Double matchPercentage,
            String message,
            boolean read,
            LocalDateTime createdAt) {

        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.matchPercentage = matchPercentage;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    // =========================
    // GETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // =========================
    // SETTERS
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}