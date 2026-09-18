package com.jobportal.backend.service;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.Notification;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.NotificationRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobNotificationServiceImpl
        implements JobNotificationService {

    private static final double MATCH_THRESHOLD = 80.0;

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SkillExtractionService skillExtractionService;
    private final OpenAIEmbeddingService openAIEmbeddingService;
    private final ResumeTextExtractor resumeTextExtractor;

    public JobNotificationServiceImpl(
            UserRepository userRepository,
            NotificationRepository notificationRepository,
            SkillExtractionService skillExtractionService,
            OpenAIEmbeddingService openAIEmbeddingService,
            ResumeTextExtractor resumeTextExtractor) {

        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.skillExtractionService = skillExtractionService;
        this.openAIEmbeddingService = openAIEmbeddingService;
        this.resumeTextExtractor = resumeTextExtractor;
    }

    @Override
    public void processNewJob(Job job) {

        if (job == null) {
            return;
        }

        List<User> users =
                userRepository.findAll();

        for (User user : users) {

            /*
             * Only users having a resume
             * should receive AI job notifications.
             */

            if (user.getResumeFilePath() == null ||
                    user.getResumeFilePath().isBlank()) {

                continue;
            }

            try {

                String resumeText =
                        resumeTextExtractor.extractResumeText(
                                user.getEmail()
                        );

                if (resumeText == null ||
                        resumeText.isBlank()) {

                    continue;
                }

                double matchPercentage =
                        calculateMatch(
                                resumeText,
                                job
                        );

                if (matchPercentage >= MATCH_THRESHOLD) {

                    createNotification(
                            user,
                            job,
                            matchPercentage
                    );
                }

            }
            catch (Exception e) {

                /*
                 * One user's invalid resume should
                 * not stop notification processing
                 * for other users.
                 */

                System.err.println(
                        "AI notification failed for user: "
                                + user.getEmail()
                                + " - "
                                + e.getMessage()
                );
            }
        }
    }

    // =====================================================
    // CALCULATE AI MATCH
    // =====================================================

    private double calculateMatch(
            String resumeText,
            Job job) {

        /*
         * Skill matching
         */

        List<String> resumeSkills =
                skillExtractionService.extractSkills(
                        resumeText
                );

        String requiredSkills =
                job.getRequiredSkills();

        double skillScore = 0.0;

        if (requiredSkills != null &&
                !requiredSkills.isBlank() &&
                resumeSkills != null &&
                !resumeSkills.isEmpty()) {

            String resumeLower =
                    resumeText.toLowerCase();

            String[] skills =
                    requiredSkills
                            .toLowerCase()
                            .split(",");

            int matched = 0;

            for (String skill : skills) {

                String cleanSkill =
                        skill.trim();

                if (!cleanSkill.isBlank() &&
                        resumeLower.contains(cleanSkill)) {

                    matched++;
                }
            }

            if (skills.length > 0) {

                skillScore =
                        ((double) matched
                                / skills.length)
                                * 100.0;
            }
        }

        /*
         * Semantic matching
         */

        String jobText =
                buildJobText(job);

        List<Double> resumeEmbedding =
                openAIEmbeddingService.createEmbedding(
                        resumeText
                );

        List<Double> jobEmbedding =
                openAIEmbeddingService.createEmbedding(
                        jobText
                );

        double semanticSimilarity =
                cosineSimilarity(
                        resumeEmbedding,
                        jobEmbedding
                );

        double semanticScore =
                semanticSimilarity * 100.0;

        if (semanticScore < 0.0) {
            semanticScore = 0.0;
        }

        if (semanticScore > 100.0) {
            semanticScore = 100.0;
        }

        /*
         * Final hybrid AI score
         */

        double finalScore =
                (skillScore * 0.60)
                        +
                (semanticScore * 0.40);

        return Math.round(
                finalScore * 100.0
        ) / 100.0;
    }

    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    private void createNotification(
            User user,
            Job job,
            double matchPercentage) {

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setJob(job);

        notification.setMatchPercentage(
                matchPercentage
        );

        notification.setMessage(
                "New job match found: "
                        + job.getTitle()
                        + " at "
                        + job.getCompany()
                        + " - "
                        + matchPercentage
                        + "% AI match"
        );

        notification.setRead(false);

        notificationRepository.save(
                notification
        );
    }

    // =====================================================
    // BUILD JOB TEXT
    // =====================================================

    private String buildJobText(Job job) {

        StringBuilder text =
                new StringBuilder();

        if (job.getTitle() != null) {

            text.append(
                    "Job Title: "
            );

            text.append(
                    job.getTitle()
            );

            text.append(". ");
        }

        if (job.getDescription() != null) {

            text.append(
                    "Job Description: "
            );

            text.append(
                    job.getDescription()
            );

            text.append(". ");
        }

        if (job.getRequiredSkills() != null) {

            text.append(
                    "Required Skills: "
            );

            text.append(
                    job.getRequiredSkills()
            );

            text.append(". ");
        }

        return text.toString();
    }

    // =====================================================
    // COSINE SIMILARITY
    // =====================================================

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

        for (int i = 0;
             i < vectorA.size();
             i++) {

            double valueA =
                    vectorA.get(i);

            double valueB =
                    vectorB.get(i);

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

        return dotProduct /
                (
                    Math.sqrt(magnitudeA)
                    *
                    Math.sqrt(magnitudeB)
                );
    }
}