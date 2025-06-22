package com.anscom.ecommerce.controller;

import com.anscom.ecommerce.dto.CartDto;
import com.anscom.ecommerce.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/mycart")
    public CartDto getUserCart() {
        return cartService.getUserCart();
    }

    // POST: add item to cart
    @PostMapping("/add")
    public CartDto addItemToCart(
            @RequestParam Long itemId,
            @RequestParam int quantity
    ) {
        return cartService.addItemToCart(itemId, quantity);
    }

    @DeleteMapping("/remove")
    public CartDto removeItemFromCart(@RequestParam Long itemId) {
        return cartService.removeItemFromCart(itemId);
    }

    @DeleteMapping("/clearCart")
    public CartDto clearCart() {
        return cartService.clearCart();
    }

}
