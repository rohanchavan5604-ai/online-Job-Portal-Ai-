package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.ApplicationStatus;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // ============================================================
    // APPLY TO JOB - USER
    // ============================================================

    @Override
    public Application applyToJob(Long jobId) {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        // --------------------------------------------------------
        // CHECK RESUME
        // --------------------------------------------------------

        if (user.getResumeFilePath() == null ||
                user.getResumeFilePath().isBlank()) {

            throw new IllegalStateException(
                    "Please upload your resume before applying for a job"
            );
        }

        // --------------------------------------------------------
        // FIND JOB
        // --------------------------------------------------------

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Job not found"
                                )
                        );

        // --------------------------------------------------------
        // PREVENT DUPLICATE APPLICATION
        // --------------------------------------------------------

        if (applicationRepository
                .existsByUserAndJob(user, job)) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        // --------------------------------------------------------
        // CREATE APPLICATION
        // --------------------------------------------------------

        Application application =
                new Application();

        application.setUser(user);

        application.setJob(job);

        application.setStatus(
                ApplicationStatus.APPLIED
        );

        return applicationRepository.save(
                application
        );
    }

    // ============================================================
    // GET ALL APPLICATIONS - ADMIN
    // ============================================================

    @Override
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }

    // ============================================================
    // GET MY APPLICATIONS - USER
    // ============================================================

    @Override
    public List<Application> getMyApplications() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return applicationRepository.findByUser(
                user
        );
    }

    // ============================================================
    // GET APPLICATION BY ID - ADMIN
    // ============================================================

    @Override
    public Application getApplicationById(
            Long applicationId) {

        return applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found"
                        )
                );
    }

    // ============================================================
    // UPDATE APPLICATION STATUS - ADMIN
    // ============================================================

    @Override
    public Application updateStatus(
            Long applicationId,
            ApplicationStatus status) {

        // --------------------------------------------------------
        // FIND APPLICATION
        // --------------------------------------------------------

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                )
                        );

        // --------------------------------------------------------
        // VALIDATE STATUS
        // --------------------------------------------------------

        if (status == null) {

            throw new IllegalArgumentException(
                    "Application status is required"
            );
        }

        // --------------------------------------------------------
        // UPDATE STATUS
        // --------------------------------------------------------

        application.setStatus(status);

        // --------------------------------------------------------
        // SAVE APPLICATION
        // --------------------------------------------------------

        Application savedApplication =
                applicationRepository.saveAndFlush(
                        application
                );

        // --------------------------------------------------------
        // GET CANDIDATE DETAILS
        // --------------------------------------------------------

        String candidateEmail =
                application.getUser().getEmail();

        String candidateName =
                application.getUser().getFullName();

        String jobTitle =
                application.getJob().getTitle();

        String company =
                application.getJob().getCompany();

        // --------------------------------------------------------
        // EMAIL SUBJECT & MESSAGE
        // --------------------------------------------------------

        String subject = null;

        String message = null;

        // ========================================================
        // INTERVIEWED
        // ========================================================

        if (status == ApplicationStatus.INTERVIEWED) {

            subject =
                    "Interview Completed - Job Portal AI";

            message =

                    "Hello " +
                    candidateName +
                    ",\n\n" +

                    "Your interview for the following "
                    + "position has been completed successfully.\n\n" +

                    "Job: " +
                    jobTitle +
                    "\n" +

                    "Company: " +
                    company +
                    "\n\n" +

                    "Our team will review your interview "
                    + "and get back to you regarding the next steps.\n\n" +

                    "Thank you for your time and interest.\n\n" +

                    "Best Regards,\n" +
                    "Job Portal AI";
        }

        // ========================================================
        // OFFERED
        // ========================================================

        else if (status == ApplicationStatus.OFFERED) {

            subject =
                    "Job Offer - Job Portal AI";

            message =

                    "Hello " +
                    candidateName +
                    ",\n\n" +

                    "Congratulations!\n\n" +

                    "We are pleased to inform you that "
                    + "you have been selected for the following position.\n\n" +

                    "Job: " +
                    jobTitle +
                    "\n" +

                    "Company: " +
                    company +
                    "\n\n" +

                    "Our team will provide you with "
                    + "the next steps regarding your job offer.\n\n" +

                    "Congratulations once again!\n\n" +

                    "Best Regards,\n" +
                    "Job Portal AI";
        }

        // ========================================================
        // HIRED
        // ========================================================

        else if (status == ApplicationStatus.HIRED) {

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "HIRED EMAIL BLOCK STARTED"
            );

            System.out.println(
                    "Application ID: " +
                    applicationId
            );

            System.out.println(
                    "Candidate Email: " +
                    candidateEmail
            );

            System.out.println(
                    "Candidate Name: " +
                    candidateName
            );

            System.out.println(
                    "Job: " +
                    jobTitle
            );

            System.out.println(
                    "Company: " +
                    company
            );

            subject =
                    "Congratulations! You are Hired - Job Portal AI";

            message =

                    "Hello " +
                    candidateName +
                    ",\n\n" +

                    "Congratulations!\n\n" +

                    "We are delighted to inform you that "
                    + "you have been successfully hired.\n\n" +

                    "Job: " +
                    jobTitle +
                    "\n" +

                    "Company: " +
                    company +
                    "\n\n" +

                    "Welcome to the team!\n\n" +

                    "Further joining details will be "
                    + "shared with you by the company.\n\n" +

                    "Best Regards,\n" +
                    "Job Portal AI";

            System.out.println(
                    "Subject: " +
                    subject
            );

            System.out.println(
                    "HIRED EMAIL BLOCK COMPLETED"
            );

            System.out.println(
                    "================================="
            );
        }

        // ========================================================
        // REJECTED
        // ========================================================

        else if (status == ApplicationStatus.REJECTED) {

            subject =
                    "Application Update - Job Portal AI";

            message =

                    "Hello " +
                    candidateName +
                    ",\n\n" +

                    "Thank you for your interest in the "
                    + "following position.\n\n" +

                    "Job: " +
                    jobTitle +
                    "\n" +

                    "Company: " +
                    company +
                    "\n\n" +

                    "After careful consideration, we regret "
                    + "to inform you that your application has "
                    + "not been selected at this time.\n\n" +

                    "We appreciate your time and effort and "
                    + "wish you all the best in your future career.\n\n" +

                    "Best Regards,\n" +
                    "Job Portal AI";
        }

        // ========================================================
        // SEND EMAIL
        // ========================================================

        if (subject != null && message != null) {

            System.out.println(
                    "SENDING EMAIL NOW..."
            );

            System.out.println(
                    "TO: " +
                    candidateEmail
            );

            System.out.println(
                    "SUBJECT: " +
                    subject
            );

            emailService.sendEmail(
                    candidateEmail,
                    subject,
                    message
            );

            System.out.println(
                    "EMAIL SERVICE CALLED SUCCESSFULLY"
            );
        }

        // --------------------------------------------------------
        // RETURN APPLICATION
        // --------------------------------------------------------

        return savedApplication;
    }

    // ============================================================
    // SCHEDULE INTERVIEW - ADMIN
    // ============================================================

    @Override
    public Application scheduleInterview(
            Long applicationId,
            LocalDateTime interviewDate,
            String remarks) {

        // --------------------------------------------------------
        // FIND APPLICATION
        // --------------------------------------------------------

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                )
                        );

        // --------------------------------------------------------
        // VALIDATE INTERVIEW DATE
        // --------------------------------------------------------

        if (interviewDate == null) {

            throw new IllegalArgumentException(
                    "Interview date and time are required"
            );
        }

        // --------------------------------------------------------
        // CHECK FUTURE DATE
        // --------------------------------------------------------

        if (!interviewDate.isAfter(
                LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Interview date and time must be in the future"
            );
        }

        // --------------------------------------------------------
        // CHECK APPLICATION STATUS
        // --------------------------------------------------------

        if (application.getStatus()
                != ApplicationStatus.SHORTLISTED) {

            throw new IllegalStateException(
                    "Only shortlisted applications can be scheduled for interview"
            );
        }

        // --------------------------------------------------------
        // SET INTERVIEW DATE
        // --------------------------------------------------------

        application.setInterviewDate(
                interviewDate
        );

        // --------------------------------------------------------
        // SET REMARKS
        // --------------------------------------------------------

        if (remarks == null) {

            application.setRemarks("");

        } else {

            application.setRemarks(
                    remarks.trim()
            );
        }

        // --------------------------------------------------------
        // CHANGE STATUS
        // --------------------------------------------------------

        application.setStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED
        );

        // --------------------------------------------------------
        // SAVE APPLICATION
        // --------------------------------------------------------

        Application savedApplication =
                applicationRepository.saveAndFlush(
                        application
                );

        // --------------------------------------------------------
        // GET CANDIDATE DETAILS
        // --------------------------------------------------------

        String candidateEmail =
                application.getUser().getEmail();

        String candidateName =
                application.getUser().getFullName();

        String jobTitle =
                application.getJob().getTitle();

        String company =
                application.getJob().getCompany();

        String emailRemarks =
                application.getRemarks();

        // --------------------------------------------------------
        // FORMAT DATE & TIME
        // --------------------------------------------------------

        DateTimeFormatter dateFormatter =
                DateTimeFormatter.ofPattern(
                        "dd MMM yyyy"
                );

        DateTimeFormatter timeFormatter =
                DateTimeFormatter.ofPattern(
                        "hh:mm a"
                );

        String formattedDate =
                interviewDate.format(
                        dateFormatter
                );

        String formattedTime =
                interviewDate.format(
                        timeFormatter
                );

        // --------------------------------------------------------
        // CREATE INTERVIEW EMAIL
        // --------------------------------------------------------

        String emailMessage =

                "Hello " +
                candidateName +
                ",\n\n" +

                "Your interview has been scheduled successfully.\n\n" +

                "Here are your interview details:\n\n" +

                "Job: " +
                jobTitle +
                "\n" +

                "Company: " +
                company +
                "\n" +

                "Interview Date: " +
                formattedDate +
                "\n" +

                "Interview Time: " +
                formattedTime +
                "\n" +

                "Remarks: " +
                (
                    emailRemarks == null ||
                    emailRemarks.isEmpty()
                        ? "No remarks"
                        : emailRemarks
                ) +

                "\n\n" +

                "Please be available at the scheduled time.\n\n" +

                "Best Regards,\n" +
                "Job Portal AI";

        // --------------------------------------------------------
        // SEND INTERVIEW EMAIL
        // --------------------------------------------------------

        emailService.sendEmail(

                candidateEmail,

                "Interview Scheduled - Job Portal AI",

                emailMessage

        );

        // --------------------------------------------------------
        // RETURN SAVED APPLICATION
        // --------------------------------------------------------

        return savedApplication;
    }
}