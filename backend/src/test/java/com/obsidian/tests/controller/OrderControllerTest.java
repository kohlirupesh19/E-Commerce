package com.obsidian.tests.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.obsidian.curator.controller.OrderController;
import com.obsidian.curator.dto.request.OrderCreateRequest;
import com.obsidian.curator.dto.request.OrderVerifyPaymentRequest;
import com.obsidian.curator.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders
                .standaloneSetup(new OrderController(orderService))
                .build();
    }

    @Test
    void shouldCreateAndVerifyOrder() throws Exception {
        UUID orderId = UUID.randomUUID();

        when(orderService.createOrder(ArgumentMatchers.anyString(), ArgumentMatchers.any(OrderCreateRequest.class)))
                .thenReturn(Map.of("orderId", orderId.toString(), "status", "PENDING_PAYMENT"));
        when(orderService.verifyPayment(ArgumentMatchers.anyString(), ArgumentMatchers.any(OrderVerifyPaymentRequest.class)))
                .thenReturn(Map.of("orderId", orderId.toString(), "status", "CONFIRMED"));

        mockMvc.perform(post("/api/orders/create")
                        .principal(() -> "user@example.com")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "addressId", UUID.randomUUID().toString(),
                                "paymentMethod", "UPI"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING_PAYMENT"));

        mockMvc.perform(post("/api/orders/verify-payment")
                        .principal(() -> "user@example.com")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "orderId", orderId.toString(),
                                "razorpayOrderId", "rzp_order_1",
                                "razorpayPaymentId", "rzp_pay_1",
                                "razorpaySignature", "sig_1"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void shouldCancelAndReorder() throws Exception {
        UUID orderId = UUID.randomUUID();

        when(orderService.cancelOrder("user@example.com", orderId))
                .thenReturn(Map.of("orderId", orderId.toString(), "status", "CANCELLED"));
        when(orderService.reorder("user@example.com", orderId))
                .thenReturn(Map.of("orderId", UUID.randomUUID().toString(), "status", "PENDING_PAYMENT"));

        mockMvc.perform(post("/api/orders/{id}/cancel", orderId)
                        .principal(() -> "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(post("/api/orders/{id}/reorder", orderId)
                        .principal(() -> "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING_PAYMENT"));

        verify(orderService).cancelOrder("user@example.com", orderId);
        verify(orderService).reorder("user@example.com", orderId);
    }

    @Test
    void shouldReturnOrdersAndInvoice() throws Exception {
        UUID orderId = UUID.randomUUID();
        byte[] invoice = "invoice-content".getBytes(StandardCharsets.UTF_8);

        when(orderService.getMyOrders("user@example.com"))
                .thenReturn(List.of(Map.of("orderId", orderId.toString(), "status", "CONFIRMED")));
        when(orderService.generateInvoice("user@example.com", orderId)).thenReturn(invoice);

        mockMvc.perform(get("/api/orders/my").principal(() -> "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("CONFIRMED"));

        mockMvc.perform(get("/api/orders/{id}/invoice", orderId).principal(() -> "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=invoice-" + orderId + ".pdf"))
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(content().bytes(invoice));
    }
}
