package com.jobportal.backend.controller;

import com.jobportal.backend.service.ResumeTextExtractor;
import com.jobportal.backend.service.SkillExtractionService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeSkillController {

    private final ResumeTextExtractor resumeTextExtractor;
    private final SkillExtractionService skillExtractionService;

    public ResumeSkillController(
            ResumeTextExtractor resumeTextExtractor,
            SkillExtractionService skillExtractionService) {

        this.resumeTextExtractor = resumeTextExtractor;
        this.skillExtractionService = skillExtractionService;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/skills")
    public List<String> extractSkills() {

        String email =
                org.springframework.security.core.context
                        .SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        String resumeText =
                resumeTextExtractor.extractResumeText(email);

        return skillExtractionService.extractSkills(resumeText);
    }
}