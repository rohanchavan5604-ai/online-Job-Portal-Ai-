package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobMatchResult;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.JobRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobMatchingServiceImpl
        implements JobMatchingService {

    private final JobRepository jobRepository;
    private final SkillExtractionService skillExtractionService;
    private final ResumeTextExtractor resumeTextExtractor;
    private final OpenAIEmbeddingService openAIEmbeddingService;

    // ============================================================
    // JOB EMBEDDING CACHE
    // ============================================================

    private final Map<Long, List<Double>> jobEmbeddingCache =
            new HashMap<>();


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public JobMatchingServiceImpl(
            JobRepository jobRepository,
            SkillExtractionService skillExtractionService,
            ResumeTextExtractor resumeTextExtractor,
            OpenAIEmbeddingService openAIEmbeddingService) {

        this.jobRepository = jobRepository;
        this.skillExtractionService = skillExtractionService;
        this.resumeTextExtractor = resumeTextExtractor;
        this.openAIEmbeddingService = openAIEmbeddingService;
    }


    // ============================================================
    // CALCULATE MATCH FOR SINGLE JOB
    // ============================================================

    @Override
    public JobMatchResult calculateMatch(Long jobId) {

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Job not found"
                                )
                        );

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        String resumeText =
                resumeTextExtractor.extractResumeText(email);

        if (resumeText == null ||
                resumeText.isBlank()) {

            return new JobMatchResult(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    0.0,
                    0.0,
                    0.0,
                    Collections.emptyList(),
                    getRequiredSkills(job)
            );
        }

        List<String> resumeSkills =
                skillExtractionService.extractSkills(
                        resumeText
                );

        Set<String> userSkills =
                resumeSkills == null
                        ? new HashSet<>()
                        : resumeSkills.stream()
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .filter(skill -> !skill.isBlank())
                                .collect(Collectors.toSet());

        Set<String> requiredSkills =
                getRequiredSkillsSet(job);

        if (requiredSkills.isEmpty()) {

            return new JobMatchResult(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    0.0,
                    0.0,
                    0.0,
                    Collections.emptyList(),
                    Collections.emptyList()
            );
        }

        Set<String> matchedSkills =
                new HashSet<>(requiredSkills);

        matchedSkills.retainAll(userSkills);

        Set<String> missingSkills =
                new HashSet<>(requiredSkills);

        missingSkills.removeAll(userSkills);

        double skillScore =
                calculateSkillScore(
                        requiredSkills,
                        userSkills
                );

        String jobText =
                buildJobText(job);

        double semanticScore =
                calculateSemanticScore(
                        resumeText,
                        jobText,
                        job.getId()
                );

        double finalScore =
                (skillScore * 0.60)
                        + (semanticScore * 0.40);

        finalScore =
                Math.round(
                        finalScore * 100.0
                ) / 100.0;

        return new JobMatchResult(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                finalScore,
                skillScore,
                semanticScore,
                matchedSkills.stream()
                        .sorted()
                        .collect(Collectors.toList()),
                missingSkills.stream()
                        .sorted()
                        .collect(Collectors.toList())
        );
    }


    // ============================================================
    // RECOMMENDED JOBS
    // ============================================================

    @Override
    public List<JobMatchResult> getRecommendedJobs() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        String resumeText =
                resumeTextExtractor.extractResumeText(email);

        if (resumeText == null ||
                resumeText.isBlank()) {

            return Collections.emptyList();
        }

        List<String> resumeSkills =
                skillExtractionService.extractSkills(
                        resumeText
                );

        Set<String> userSkills =
                resumeSkills == null
                        ? new HashSet<>()
                        : resumeSkills.stream()
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .filter(skill -> !skill.isBlank())
                                .collect(Collectors.toSet());

        // ========================================================
        // RESUME EMBEDDING
        // ONLY ONE CALL PER REQUEST
        // ========================================================

        List<Double> resumeEmbedding =
                openAIEmbeddingService.createEmbedding(
                        resumeText
                );

        List<Job> jobs =
                jobRepository.findAll();

        return jobs.stream()

                .filter(job ->
                        job.getRequiredSkills() != null &&
                        !job.getRequiredSkills().isBlank()
                )

                .map(job -> {

                    Set<String> requiredSkills =
                            getRequiredSkillsSet(job);

                    if (requiredSkills.isEmpty()) {
                        return null;
                    }

                    Set<String> matchedSkills =
                            new HashSet<>(requiredSkills);

                    matchedSkills.retainAll(userSkills);

                    Set<String> missingSkills =
                            new HashSet<>(requiredSkills);

                    missingSkills.removeAll(userSkills);

                    double skillScore =
                            calculateSkillScore(
                                    requiredSkills,
                                    userSkills
                            );

                    String jobText =
                            buildJobText(job);

                    // =================================================
                    // GET JOB EMBEDDING FROM CACHE
                    // =================================================

                    List<Double> jobEmbedding =
                            getJobEmbedding(
                                    job.getId(),
                                    jobText
                            );

                    // =================================================
                    // SEMANTIC SCORE
                    // =================================================

                    double semanticScore =
                            cosineSimilarity(
                                    resumeEmbedding,
                                    jobEmbedding
                            ) * 100.0;

                    if (semanticScore < 0.0) {
                        semanticScore = 0.0;
                    }

                    if (semanticScore > 100.0) {
                        semanticScore = 100.0;
                    }

                    // =================================================
                    // FINAL HYBRID SCORE
                    // =================================================

                    double finalScore =
                            (skillScore * 0.60)
                                    + (semanticScore * 0.40);

                    finalScore =
                            Math.round(
                                    finalScore * 100.0
                            ) / 100.0;

                    // =================================================
                    // RESULT
                    // =================================================

                    return new JobMatchResult(
                            job.getId(),
                            job.getTitle(),
                            job.getCompany(),
                            finalScore,
                            skillScore,
                            semanticScore,
                            matchedSkills.stream()
                                    .sorted()
                                    .collect(Collectors.toList()),
                            missingSkills.stream()
                                    .sorted()
                                    .collect(Collectors.toList())
                    );
                })

                .filter(result -> result != null)

                .sorted(
                        (a, b) ->
                                Double.compare(
                                        b.getMatchPercentage(),
                                        a.getMatchPercentage()
                                )
                )

                .limit(10)

                .collect(Collectors.toList());
    }


    // ============================================================
    // GET JOB EMBEDDING
    // ============================================================

    private synchronized List<Double> getJobEmbedding(
            Long jobId,
            String jobText) {

        if (jobEmbeddingCache.containsKey(jobId)) {

            return jobEmbeddingCache.get(jobId);
        }

        List<Double> embedding =
                openAIEmbeddingService.createEmbedding(
                        jobText
                );

        jobEmbeddingCache.put(
                jobId,
                embedding
        );

        return embedding;
    }


    // ============================================================
    // CALCULATE SKILL SCORE
    // ============================================================

    private double calculateSkillScore(
            Set<String> requiredSkills,
            Set<String> userSkills) {

        if (requiredSkills == null ||
                requiredSkills.isEmpty()) {

            return 0.0;
        }

        Set<String> matched =
                new HashSet<>(requiredSkills);

        matched.retainAll(userSkills);

        return
                ((double) matched.size()
                        / requiredSkills.size())
                        * 100.0;
    }


    // ============================================================
    // CALCULATE SEMANTIC SCORE
    // ============================================================

    private double calculateSemanticScore(
            String resumeText,
            String jobText,
            Long jobId) {

        if (resumeText == null ||
                resumeText.isBlank() ||
                jobText == null ||
                jobText.isBlank()) {

            return 0.0;
        }

        List<Double> resumeEmbedding =
                openAIEmbeddingService.createEmbedding(
                        resumeText
                );

        List<Double> jobEmbedding =
                getJobEmbedding(
                        jobId,
                        jobText
                );

        double similarity =
                cosineSimilarity(
                        resumeEmbedding,
                        jobEmbedding
                );

        double score =
                similarity * 100.0;

        if (score < 0.0) {
            score = 0.0;
        }

        if (score > 100.0) {
            score = 100.0;
        }

        return score;
    }


    // ============================================================
    // COSINE SIMILARITY
    // ============================================================

    private double cosineSimilarity(
            List<Double> vectorA,
            List<Double> vectorB) {

        if (vectorA == null ||
                vectorB == null ||
                vectorA.isEmpty() ||
                vectorB.isEmpty()) {

            return 0.0;
        }

        if (vectorA.size() != vectorB.size()) {

            return 0.0;
        }

        double dotProduct = 0.0;
        double magnitudeA = 0.0;
        double magnitudeB = 0.0;

        for (int i = 0; i < vectorA.size(); i++) {

            double valueA = vectorA.get(i);
            double valueB = vectorB.get(i);

            dotProduct +=
                    valueA * valueB;

            magnitudeA +=
                    valueA * valueA;

            magnitudeB +=
                    valueB * valueB;
        }

        if (magnitudeA == 0.0 ||
                magnitudeB == 0.0) {

            return 0.0;
        }

        return
                dotProduct
                        /
                        (
                                Math.sqrt(magnitudeA)
                                        *
                                Math.sqrt(magnitudeB)
                        );
    }


    // ============================================================
    // BUILD JOB TEXT
    // ============================================================

    private String buildJobText(Job job) {

        StringBuilder text =
                new StringBuilder();

        if (job.getTitle() != null) {

            text.append("Job Title: ");
            text.append(job.getTitle());
            text.append(". ");
        }

        if (job.getDescription() != null) {

            text.append("Job Description: ");
            text.append(job.getDescription());
            text.append(". ");
        }

        if (job.getRequiredSkills() != null) {

            text.append("Required Skills: ");
            text.append(job.getRequiredSkills());
            text.append(". ");
        }

        return text.toString();
    }


    // ============================================================
    // GET REQUIRED SKILLS SET
    // ============================================================

    private Set<String> getRequiredSkillsSet(Job job) {

        if (job == null ||
                job.getRequiredSkills() == null ||
                job.getRequiredSkills().isBlank()) {

            return new HashSet<>();
        }

        return Arrays.stream(
                        job.getRequiredSkills()
                                .split(",")
                )
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(skill -> !skill.isBlank())
                .collect(Collectors.toSet());
    }


    // ============================================================
    // GET REQUIRED SKILLS LIST
    // ============================================================

    private List<String> getRequiredSkills(Job job) {

        return getRequiredSkillsSet(job)
                .stream()
                .sorted()
                .collect(Collectors.toList());
    }
}