package com.anscom.ecommerce.dto;

import com.anscom.ecommerce.constant.CategoryEnum;
import com.anscom.ecommerce.constant.SizeEnum;
import lombok.Builder;

@Builder
public class ItemDto {
    private Long id;
    private String name;
    private String description;
    private String gender;
    private String material;
    private Long price;
    private Integer rating;
    private String color;
    private SizeEnum size;
    private int stock;
    private CategoryEnum category;
    private int imageCount; // New field to store the number of images



    public ItemDto() {
    }

    public ItemDto(Long id, String name, String description, String gender, String material, Long price, Integer rating, String color, SizeEnum size, int stock, CategoryEnum category, int imageCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.gender = gender;
        this.material = material;
        this.price = price;
        this.rating = rating;
        this.color = color;
        this.size = size;
        this.stock = stock;
        this.category = category;
        this.imageCount = imageCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public SizeEnum getSize() {
        return size;
    }

    public void setSize(SizeEnum size) {
        this.size = size;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getImageCount() {
        return imageCount;
    }

    public void setImageCount(int imageCount) {
        this.imageCount = imageCount;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }
}