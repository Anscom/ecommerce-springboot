package com.anscom.ecommerce.controller;

import com.anscom.ecommerce.model.Payment;
import com.anscom.ecommerce.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // frontend Vite dev server
public class StripeController {

    private final StripeService stripeService;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Payment request) {
        try {
            PaymentIntent intent = stripeService.createPaymentIntent(request);
            return ResponseEntity.ok(intent.getClientSecret()); // Send clientSecret to frontend
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Stripe Error: " + e.getMessage());
        }
    }
}