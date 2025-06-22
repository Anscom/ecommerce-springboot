package com.anscom.ecommerce.service;

import com.anscom.ecommerce.dto.CartDto;

public interface CartService {
    CartDto removeItemFromCart(Long itemId);
    CartDto getUserCart();
    CartDto addItemToCart(Long itemId, int quantity);
    CartDto clearCart();
}
