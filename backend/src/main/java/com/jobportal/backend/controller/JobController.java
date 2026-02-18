package com.jobportal.backend.controller;

import com.jobportal.backend.dto.JobDTO;
import com.jobportal.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobDTO> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobDTO getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/search")
    public Page<JobDTO> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {

        if (title != null && title.trim().isEmpty()) {
            title = null;
        }

        if (location != null && location.trim().isEmpty()) {
            location = null;
        }

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return jobService.searchJobs(title, location, minSalary, pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public JobDTO createJob(@Valid @RequestBody JobDTO jobDTO) {
        return jobService.createJob(jobDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public JobDTO updateJob(@PathVariable Long id,
                            @Valid @RequestBody JobDTO jobDTO) {
        return jobService.updateJob(id, jobDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
}
