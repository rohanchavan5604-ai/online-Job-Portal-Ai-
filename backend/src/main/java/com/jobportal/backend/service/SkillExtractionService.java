package com.jobportal.backend.service;

import java.util.List;

public interface SkillExtractionService {

    List<String> extractSkills(String resumeText);
}