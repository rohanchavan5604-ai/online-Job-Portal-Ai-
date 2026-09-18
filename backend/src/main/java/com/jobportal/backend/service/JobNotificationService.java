package com.jobportal.backend.service;

import com.jobportal.backend.entity.Job;

public interface JobNotificationService {

    void processNewJob(Job job);
}