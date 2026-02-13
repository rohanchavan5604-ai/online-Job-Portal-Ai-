package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;

import java.util.List;

public interface ApplicationService {

    Application applyToJob(Long jobId);

    List<Application> getAllApplications();

    List<Application> getMyApplications();

    Application updateStatus(Long applicationId, ApplicationStatus status);
}
