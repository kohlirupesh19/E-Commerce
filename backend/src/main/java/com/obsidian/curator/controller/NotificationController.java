package com.obsidian.curator.controller;

import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.NotificationDto;
import com.obsidian.curator.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationDto> getUserNotifications(Authentication authentication) {
        return notificationService.getUserNotifications(authentication.getName());
    }

    @PatchMapping("/{id}/read")
    public MessageResponse markAsRead(Authentication authentication, @PathVariable UUID id) {
        return notificationService.markAsRead(authentication.getName(), id);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication authentication) {
        return notificationService.getUnreadCount(authentication.getName());
    }
}
