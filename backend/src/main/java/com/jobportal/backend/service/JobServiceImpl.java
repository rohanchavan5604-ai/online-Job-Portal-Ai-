package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobDTO;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobServiceImpl(JobRepository jobRepository,
                          ApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    // =========================
    // CREATE JOB
    // =========================

    @Override
    public JobDTO createJob(JobDTO jobDTO) {

        Job job = mapToEntity(jobDTO);

        return mapToDTO(
                jobRepository.save(job)
        );
    }

    // =========================
    // GET ALL JOBS
    // =========================

    @Override
    public List<JobDTO> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET JOB BY ID
    // =========================

    @Override
    public JobDTO getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        return mapToDTO(job);
    }

    // =========================
    // UPDATE JOB
    // =========================

    @Override
    public JobDTO updateJob(Long id, JobDTO jobDTO) {

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        existingJob.setTitle(jobDTO.getTitle());
        existingJob.setDescription(jobDTO.getDescription());
        existingJob.setCompany(jobDTO.getCompany());
        existingJob.setLocation(jobDTO.getLocation());
        existingJob.setSalary(jobDTO.getSalary());

        return mapToDTO(
                jobRepository.save(existingJob)
        );
    }

    // =========================
    // DELETE JOB
    // =========================

    @Override
    public void deleteJob(Long id) {

        // Step 1: Check job exists
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        // Step 2: Check whether applications exist
        if (applicationRepository.existsByJob(job)) {

            throw new RuntimeException(
                    "Cannot delete job because applications already exist"
            );
        }

        // Step 3: Delete job
        jobRepository.delete(job);
    }

    // =========================
    // SEARCH JOBS
    // =========================

    @Override
    public Page<JobDTO> searchJobs(
            String title,
            String location,
            Double minSalary,
            Pageable pageable) {

        if (title != null && title.trim().isEmpty()) {
            title = null;
        }

        if (location != null && location.trim().isEmpty()) {
            location = null;
        }

        return jobRepository
                .searchJobs(
                        title,
                        location,
                        minSalary,
                        pageable
                )
                .map(this::mapToDTO);
    }

    // =========================
    // ENTITY → DTO
    // =========================

    private JobDTO mapToDTO(Job job) {

        JobDTO dto = new JobDTO();

        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setCreatedAt(job.getCreatedAt());

        return dto;
    }

    // =========================
    // DTO → ENTITY
    // =========================

    private Job mapToEntity(JobDTO dto) {

        Job job = new Job();

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());

        return job;
    }
}