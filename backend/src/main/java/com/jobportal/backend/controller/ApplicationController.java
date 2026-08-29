package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.service.ApplicationService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }


    // ============================================================
    // APPLY TO JOB - USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/apply/{jobId}")
    public Application applyToJob(
            @PathVariable Long jobId) {

        return applicationService.applyToJob(jobId);
    }


    // ============================================================
    // MY APPLICATIONS - USER ONLY
    // ============================================================

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public List<Application> getMyApplications() {

        return applicationService.getMyApplications();
    }


    // ============================================================
    // GET ALL APPLICATIONS - ADMIN ONLY
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Application> getAllApplications() {

        return applicationService.getAllApplications();
    }


    // ============================================================
    // GET APPLICATION BY ID - ADMIN ONLY
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{applicationId}")
    public Application getApplicationById(
            @PathVariable Long applicationId) {

        return applicationService.getApplicationById(
                applicationId
        );
    }


    // ============================================================
    // UPDATE APPLICATION STATUS - ADMIN ONLY
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{applicationId}/status")
    public Map<String, String> updateStatus(

            @PathVariable Long applicationId,

            @RequestBody Map<String, String> body) {


        String statusValue =
                body.get("status");


        if (statusValue == null ||
                statusValue.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Status is required"
            );
        }


        ApplicationStatus status =
                ApplicationStatus.valueOf(
                        statusValue
                                .toUpperCase()
                                .trim()
                );


        applicationService.updateStatus(
                applicationId,
                status
        );


        return Map.of(

                "message",
                "Application status updated successfully",

                "status",
                status.name()

        );
    }


    // ============================================================
    // SCHEDULE INTERVIEW - ADMIN ONLY
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{applicationId}/schedule-interview")
    public Map<String, String> scheduleInterview(

            @PathVariable Long applicationId,

            @RequestBody Map<String, String> body) {


        // Get interview date from request

        String interviewDateValue =
                body.get("interviewDate");


        // Get optional remarks

        String remarks =
                body.get("remarks");


        // Validate interview date

        if (interviewDateValue == null ||
                interviewDateValue.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Interview date and time are required"
            );
        }


        // Convert String to LocalDateTime

        LocalDateTime interviewDate;

        try {

            interviewDate =
                    LocalDateTime.parse(
                            interviewDateValue.trim()
                    );

        }
        catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid interview date format. Use yyyy-MM-ddTHH:mm"
            );

        }


        // Schedule interview

        Application application =
                applicationService.scheduleInterview(

                        applicationId,

                        interviewDate,

                        remarks

                );


        // Return response

        return Map.of(

                "message",
                "Interview scheduled successfully",

                "status",
                application
                        .getStatus()
                        .name(),

                "interviewDate",
                application
                        .getInterviewDate()
                        .toString()

        );
    }
}