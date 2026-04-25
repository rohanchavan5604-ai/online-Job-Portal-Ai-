package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.service.ApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }
 
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/apply/{jobId}")
    public Application applyToJob(@PathVariable Long jobId) {
        return applicationService.applyToJob(jobId);
    }
 
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public List<Application> getMyApplications() {
        return applicationService.getMyApplications();
    }
 
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }
 
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId,
                                @RequestBody java.util.Map<String,String> body) {

    String statusValue = body.get("status");

    ApplicationStatus status =
            ApplicationStatus.valueOf(statusValue.toUpperCase());

    return applicationService.updateStatus(applicationId, status);
    }
}
