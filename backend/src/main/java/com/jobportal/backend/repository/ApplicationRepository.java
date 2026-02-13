package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser(User user);
}
