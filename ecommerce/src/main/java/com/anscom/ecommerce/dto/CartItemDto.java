package com.anscom.ecommerce.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long itemId;
    private String itemName;
    private int quantity;
    private Long price;
}