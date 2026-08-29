package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AdminStats;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(
            JobRepository jobRepository,
            UserRepository userRepository,
            ApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    // ==========================================
    // DASHBOARD STATS
    // ==========================================

    @GetMapping("/stats")
    public AdminStats getDashboardStats() {

        long totalJobs = jobRepository.count();

        long totalUsers = userRepository.count();

        long totalApplications = applicationRepository.count();

        long totalApplied =
                applicationRepository.countByStatus(
                        ApplicationStatus.APPLIED
                );

        long totalShortlisted =
                applicationRepository.countByStatus(
                        ApplicationStatus.SHORTLISTED
                );

        long totalInterviewScheduled =
                applicationRepository.countByStatus(
                        ApplicationStatus.INTERVIEW_SCHEDULED
                );

        long totalInterviewed =
                applicationRepository.countByStatus(
                        ApplicationStatus.INTERVIEWED
                );

        long totalOffered =
                applicationRepository.countByStatus(
                        ApplicationStatus.OFFERED
                );

        long totalHired =
                applicationRepository.countByStatus(
                        ApplicationStatus.HIRED
                );

        long totalRejected =
                applicationRepository.countByStatus(
                        ApplicationStatus.REJECTED
                );

        return new AdminStats(
                totalUsers,
                totalJobs,
                totalApplications,
                totalApplied,
                totalShortlisted,
                totalInterviewScheduled,
                totalInterviewed,
                totalOffered,
                totalHired,
                totalRejected
        );
    }


    // ==========================================
    // GET ALL APPLICATIONS
    // ==========================================

    @GetMapping("/applications")
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }
}