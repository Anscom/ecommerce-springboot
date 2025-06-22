package com.anscom.ecommerce.service;


import com.anscom.ecommerce.model.Payment;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface StripeService {
    PaymentIntent createPaymentIntent(Payment payment) throws StripeException;
}