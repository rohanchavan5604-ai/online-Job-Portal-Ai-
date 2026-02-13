package com.jobportal.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime appliedDate;

    public Application() {
    }

    public Application(User user, Job job, ApplicationStatus status, LocalDateTime appliedDate) {
        this.user = user;
        this.job = job;
        this.status = status;
        this.appliedDate = appliedDate;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Job getJob() {
        return job;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
