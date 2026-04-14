package com.obsidian.curator.service;

import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.NotificationDto;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationDto> getUserNotifications(String email);
    MessageResponse markAsRead(String email, UUID id);
    long getUnreadCount(String email);
}
