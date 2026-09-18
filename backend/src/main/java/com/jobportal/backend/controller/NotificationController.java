package com.jobportal.backend.controller;

import com.jobportal.backend.dto.NotificationDTO;
import com.jobportal.backend.service.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER')")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    // =========================
    // GET ALL NOTIFICATIONS
    // =========================

    @GetMapping
    public List<NotificationDTO> getMyNotifications() {

        return notificationService
                .getMyNotifications();
    }

    // =========================
    // GET UNREAD NOTIFICATIONS
    // =========================

    @GetMapping("/unread")
    public List<NotificationDTO> getUnreadNotifications() {

        return notificationService
                .getUnreadNotifications();
    }

    // =========================
    // GET UNREAD COUNT
    // =========================

    @GetMapping("/unread/count")
    public long getUnreadCount() {

        return notificationService
                .getUnreadCount();
    }

    // =========================
    // MARK ONE AS READ
    // =========================

    @PutMapping("/{id}/read")
    public String markAsRead(
            @PathVariable Long id) {

        notificationService.markAsRead(id);

        return "Notification marked as read";
    }

    // =========================
    // MARK ALL AS READ
    // =========================

    @PutMapping("/read-all")
    public String markAllAsRead() {

        notificationService.markAllAsRead();

        return "All notifications marked as read";
    }
}