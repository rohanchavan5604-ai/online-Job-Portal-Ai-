package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {

    JobDTO createJob(JobDTO jobDTO);

    List<JobDTO> getAllJobs();

    JobDTO getJobById(Long id);

    JobDTO updateJob(Long id, JobDTO jobDTO);

    void deleteJob(Long id);

    Page<JobDTO> searchJobs(String title,
                            String location,
                            Double minSalary,
                            Pageable pageable);
}
