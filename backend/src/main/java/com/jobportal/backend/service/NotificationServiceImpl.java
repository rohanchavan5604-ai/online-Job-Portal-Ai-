package com.jobportal.backend.service;

import com.jobportal.backend.dto.NotificationDTO;
import com.jobportal.backend.entity.Notification;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.NotificationRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;
    }

    // =========================
    // GET CURRENT USER
    // =========================

    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    // =========================
    // GET ALL NOTIFICATIONS
    // =========================

    @Override
    public List<NotificationDTO> getMyNotifications() {

        User user = getCurrentUser();

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET UNREAD NOTIFICATIONS
    // =========================

    @Override
    public List<NotificationDTO> getUnreadNotifications() {

        User user = getCurrentUser();

        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // GET UNREAD COUNT
    // =========================

    @Override
    public long getUnreadCount() {

        User user = getCurrentUser();

        return notificationRepository
                .countByUserAndIsReadFalse(user);
    }

    // =========================
    // MARK ONE AS READ
    // =========================

    @Override
    public void markAsRead(Long notificationId) {

        User user = getCurrentUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // User can only access
        // their own notification

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot access this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(
                notification
        );
    }

    // =========================
    // MARK ALL AS READ
    // =========================

    @Override
    public void markAllAsRead() {

        User user = getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(user);

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(
                notifications
        );
    }

    // =========================
    // ENTITY → DTO
    // =========================

    private NotificationDTO mapToDTO(
            Notification notification) {

        Long jobId = null;
        String jobTitle = null;
        String company = null;

        if (notification.getJob() != null) {

            jobId =
                    notification.getJob().getId();

            jobTitle =
                    notification.getJob().getTitle();

            company =
                    notification.getJob().getCompany();
        }

        return new NotificationDTO(
                notification.getId(),
                jobId,
                jobTitle,
                company,
                notification.getMatchPercentage(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}