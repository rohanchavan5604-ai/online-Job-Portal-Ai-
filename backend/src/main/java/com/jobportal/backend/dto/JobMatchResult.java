package com.jobportal.backend.dto;

import java.util.List;

public class JobMatchResult {

    private Long jobId;
    private String title;
    private String company;

    private Double matchPercentage;

    // AI score breakdown
    private Double skillScore;
    private Double semanticScore;

    private List<String> matchedSkills;
    private List<String> missingSkills;


    // ============================================================
    // CONSTRUCTOR FOR RECOMMENDED JOBS
    // ============================================================

    public JobMatchResult(
            Long jobId,
            String title,
            String company,
            Double matchPercentage,
            Double skillScore,
            Double semanticScore,
            List<String> matchedSkills,
            List<String> missingSkills) {

        this.jobId = jobId;
        this.title = title;
        this.company = company;

        this.matchPercentage = matchPercentage;

        this.skillScore = skillScore;
        this.semanticScore = semanticScore;

        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
    }


    // ============================================================
    // OLD CONSTRUCTOR
    // Keeps existing code working
    // ============================================================

    public JobMatchResult(
            Long jobId,
            String title,
            String company,
            Double matchPercentage,
            List<String> matchedSkills,
            List<String> missingSkills) {

        this(
                jobId,
                title,
                company,
                matchPercentage,
                null,
                null,
                matchedSkills,
                missingSkills
        );
    }


    // ============================================================
    // OLD CONSTRUCTOR
    // ============================================================

    public JobMatchResult(
            Double matchPercentage,
            List<String> matchedSkills,
            List<String> missingSkills) {

        this(
                null,
                null,
                null,
                matchPercentage,
                null,
                null,
                matchedSkills,
                missingSkills
        );
    }


    // ============================================================
    // GETTERS
    // ============================================================

    public Long getJobId() {
        return jobId;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public Double getSkillScore() {
        return skillScore;
    }

    public Double getSemanticScore() {
        return semanticScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }


    // ============================================================
    // SETTERS
    // ============================================================

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public void setSkillScore(Double skillScore) {
        this.skillScore = skillScore;
    }

    public void setSemanticScore(Double semanticScore) {
        this.semanticScore = semanticScore;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
}