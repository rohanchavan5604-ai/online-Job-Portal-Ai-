package com.jobportal.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    String uploadResume(MultipartFile file);

    Resource getResume();

    void deleteResume();
}