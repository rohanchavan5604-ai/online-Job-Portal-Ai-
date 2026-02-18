package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("""
        SELECT j FROM Job j
        WHERE (:title IS NULL OR 
               LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%')) 
               OR LOWER(j.description) LIKE LOWER(CONCAT('%', :title, '%')))
        AND (:location IS NULL OR 
             LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:minSalary IS NULL OR j.salary >= :minSalary)
    """)
    Page<Job> searchJobs(
            @Param("title") String title,
            @Param("location") String location,
            @Param("minSalary") Double minSalary,
            Pageable pageable
    );
}
