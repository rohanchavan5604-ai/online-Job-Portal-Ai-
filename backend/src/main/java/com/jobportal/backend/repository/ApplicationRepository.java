package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser(User user);

    List<Application> findByJob(Job job);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByJobAndStatus(Job job, ApplicationStatus status);

    boolean existsByUserAndJob(User user, Job job);

    long countByStatus(ApplicationStatus status);

}