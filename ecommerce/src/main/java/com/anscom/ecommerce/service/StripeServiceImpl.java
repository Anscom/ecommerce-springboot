package com.anscom.ecommerce.service;

import com.anscom.ecommerce.model.Payment;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;

@Service
public class StripeServiceImpl implements StripeService {

    @Override
    public PaymentIntent createPaymentIntent(Payment request) throws StripeException {
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount((long) request.getAmount())
                        .setCurrency(request.getCurrency())
                        .addPaymentMethodType("card")
                        .build();

        return PaymentIntent.create(params);
    }
}