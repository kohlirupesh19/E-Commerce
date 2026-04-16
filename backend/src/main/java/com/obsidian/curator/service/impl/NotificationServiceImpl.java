package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.NotificationDto;
import com.obsidian.curator.entity.Notification;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.enums.NotificationType;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.NotificationRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationDto> getUserNotifications(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse markAsRead(String email, UUID id) {
        User user = getUserByEmail(email);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
        return new MessageResponse("Notification marked as read");
    }

    @Override
    public long getUnreadCount(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(mapTitle(notification.getType()))
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private String mapTitle(NotificationType type) {
        if (type == null) {
            return "Notification";
        }

        return switch (type) {
            case ORDER -> "Order Update";
            case DELIVERY -> "Delivery Update";
            case PROMO -> "Exclusive Offer";
            case SECURITY -> "Security Alert";
        };
    }
}
