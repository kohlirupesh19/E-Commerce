package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.NewsletterRequest;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.entity.NewsletterSubscriber;
import com.obsidian.curator.repository.NewsletterSubscriberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterSubscriberRepository repository;

    @PostMapping("/subscribe")
    public MessageResponse subscribe(@Valid @RequestBody NewsletterRequest request) {
        if (repository.existsByEmailIgnoreCase(request.getEmail())) {
            return new MessageResponse("You are already subscribed to our concierge series.");
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(request.getEmail().toLowerCase());
        repository.save(subscriber);

        return new MessageResponse("Subscribed successfully. Invitations will arrive in your inbox.");
    }
}
