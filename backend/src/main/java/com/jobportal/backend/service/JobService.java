package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobDTO;
import java.util.List;

public interface JobService {

    JobDTO createJob(JobDTO jobDTO);

    List<JobDTO> getAllJobs();

    JobDTO getJobById(Long id);

    JobDTO updateJob(Long id, JobDTO jobDTO);

    void deleteJob(Long id);
}
