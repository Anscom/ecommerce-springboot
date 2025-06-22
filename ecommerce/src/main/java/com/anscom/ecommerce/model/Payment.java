package com.anscom.ecommerce.model;

import lombok.Data;

@Data
public class Payment {
    private int amount; // in cents (e.g., 500 = $5.00)
    private String currency;
    private String paymentMethodId; // provided by Stripe.js on frontend
}
