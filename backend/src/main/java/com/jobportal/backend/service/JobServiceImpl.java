package com.jobportal.backend.service;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    @Override
    public Job updateJob(Long id, Job job) {
        Job existingJob = getJobById(id);

        existingJob.setTitle(job.getTitle());
        existingJob.setDescription(job.getDescription());
        existingJob.setCompany(job.getCompany());
        existingJob.setLocation(job.getLocation());

        return jobRepository.save(existingJob);
    }

    @Override
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
