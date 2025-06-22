package com.anscom.ecommerce.service;

import com.anscom.ecommerce.dto.CartDto;
import com.anscom.ecommerce.dto.CartItemDto;
import com.anscom.ecommerce.model.Cart;
import com.anscom.ecommerce.model.CartItem;
import com.anscom.ecommerce.model.Item;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.repository.CartRepository;
import com.anscom.ecommerce.repository.ItemRepository;
import com.anscom.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Override
    public CartDto clearCart() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().clear();

        cartRepository.save(cart);

        return convertToDto(cart);
    }

    @Override
    public CartDto removeItemFromCart(Long itemId) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().removeIf(cartItem -> cartItem.getItem().equals(item));

        cartRepository.save(cart);

        return convertToDto(cart);
    }

    @Override
    public CartDto getUserCart() {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        return convertToDto(cart);
    }

    @Override
    public CartDto addItemToCart(Long itemId, int quantity) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(ci -> ci.getItem().equals(item))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(quantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setItem(item);
            cartItem.setQuantity(quantity);
            cart.getCartItems().add(cartItem);
        }
        cartRepository.save(cart); // ✅ Save the cart with updated items
        return convertToDto(cart);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // typically the email/username
    }

    private CartDto convertToDto(Cart cart) {
        List<CartItemDto> items = cart.getCartItems().stream().map(ci -> {
            CartItemDto dto = new CartItemDto();
            dto.setItemId(ci.getItem().getId());
            dto.setItemName(ci.getItem().getName());
            dto.setQuantity(ci.getQuantity());
            dto.setPrice(ci.getItem().getPrice());
            return dto;
        }).collect(Collectors.toList());
        // Calculate total amount: sum of quantity * price
        double totalAmount = cart.getCartItems().stream()
                .mapToDouble(ci -> ci.getQuantity() * ci.getItem().getPrice())
                .sum();

        return new CartDto(items, totalAmount);
    }
}