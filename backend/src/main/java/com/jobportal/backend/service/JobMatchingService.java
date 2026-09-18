package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobMatchResult;

import java.util.List;

public interface JobMatchingService {

    JobMatchResult calculateMatch(Long jobId);

    List<JobMatchResult> getRecommendedJobs();
}