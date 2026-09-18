package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobMatchResult;
import com.jobportal.backend.service.JobMatchingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-matching")
@CrossOrigin
public class JobMatchingController {

    private final JobMatchingService jobMatchingService;


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public JobMatchingController(
            JobMatchingService jobMatchingService) {

        this.jobMatchingService =
                jobMatchingService;
    }


    // ============================================================
    // RECOMMENDED JOBS
    // ============================================================

    @GetMapping("/recommended")
    public ResponseEntity<List<JobMatchResult>> getRecommendedJobs() {

        List<JobMatchResult> results =
                jobMatchingService.getRecommendedJobs();

        return ResponseEntity.ok(results);
    }


    // ============================================================
    // SINGLE JOB MATCHING RESULT
    // Only numeric job IDs are accepted
    // ============================================================

    @GetMapping("/{jobId:\\d+}")
    public ResponseEntity<JobMatchResult> getMatchResult(
            @PathVariable Long jobId) {

        JobMatchResult result =
                jobMatchingService.calculateMatch(jobId);

        return ResponseEntity.ok(result);
    }
}