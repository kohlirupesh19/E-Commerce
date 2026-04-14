package com.obsidian.curator.util;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailUtil {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        sendText(to, "Your Obsidian Curator verification code", "Your Obsidian Curator verification code: " + otp);
    }

    public void sendText(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("EMAIL ERROR: Could not send email to " + to + ". Reason: " + e.getMessage());
        }
    }
}
