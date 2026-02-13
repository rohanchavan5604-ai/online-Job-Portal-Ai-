package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.service.ApplicationService;
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

    @PostMapping("/{jobId}")
    public Application applyToJob(@PathVariable Long jobId) {
        return applicationService.applyToJob(jobId);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/my")
    public List<Application> getMyApplications() {
        return applicationService.getMyApplications();
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id,
                                    @RequestParam ApplicationStatus status) {
        return applicationService.updateStatus(id, status);
    }
}
