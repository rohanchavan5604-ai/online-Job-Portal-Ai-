package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ApplicationService {

    Application applyToJob(Long jobId);

    List<Application> getAllApplications();

    List<Application> getMyApplications();

    Application getApplicationById(Long applicationId);

    Application updateStatus(
            Long applicationId,
            ApplicationStatus status
    );

    Application scheduleInterview(
            Long applicationId,
            LocalDateTime interviewDate,
            String remarks
    );
}