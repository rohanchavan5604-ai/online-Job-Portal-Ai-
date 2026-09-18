package com.jobportal.backend.service;

import com.jobportal.backend.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    List<NotificationDTO> getMyNotifications();

    List<NotificationDTO> getUnreadNotifications();

    long getUnreadCount();

    void markAsRead(Long notificationId);

    void markAllAsRead();
}