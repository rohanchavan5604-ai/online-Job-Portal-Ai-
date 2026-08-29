package com.jobportal.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }


    // ============================================================
    // SEND EMAIL
    // ============================================================

    public void sendEmail(
            String to,
            String subject,
            String message) {

        SimpleMailMessage mail =
                new SimpleMailMessage();

        mail.setFrom(
                "rohanchavan5604@gmail.com"
        );

        mail.setTo(to);

        mail.setSubject(subject);

        mail.setText(message);

        mailSender.send(mail);
    }
}