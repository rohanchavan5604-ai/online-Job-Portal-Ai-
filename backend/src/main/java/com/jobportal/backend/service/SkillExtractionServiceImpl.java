package com.jobportal.backend.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SkillExtractionServiceImpl
        implements SkillExtractionService {

    private final List<String> skills = Arrays.asList(

            // Programming Languages
            "java",
            "python",
            "c",
            "c++",
            "c#",
            "javascript",
            "typescript",

            // Backend
            "spring",
            "spring boot",
            "hibernate",
            "servlet",
            "jsp",
            "rest api",

            // Database
            "mysql",
            "sql",
            "oracle",
            "mongodb",
            "postgresql",

            // Frontend
            "html",
            "css",
            "javascript",
            "react",
            "angular",

            // Tools
            "git",
            "github",
            "maven",
            "docker",

            // Concepts
            "oops",
            "data structures",
            "algorithms"
    );


    @Override
    public List<String> extractSkills(String resumeText) {

        List<String> extractedSkills =
                new ArrayList<>();

        if (resumeText == null ||
                resumeText.isBlank()) {

            return extractedSkills;
        }

        String text =
                resumeText.toLowerCase();

        for (String skill : skills) {

            if (text.contains(skill.toLowerCase())) {

                extractedSkills.add(skill);
            }
        }

        return extractedSkills;
    }
}