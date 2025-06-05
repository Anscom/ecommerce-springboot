package com.anscom.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;

@Builder
public class ImageDto {
    private Long id;
    private String imageName;
    private String imageType;
    @JsonIgnore
    private byte[] imageData;
    @JsonIgnore
    private ItemDto item;

    public ImageDto() {
    }

    public ImageDto(Long id, String imageName, String imageType) {
        this.imageName = imageName;
        this.id = id;
        this.imageType = imageType;
    }

    public ImageDto(Long id, String imageName, String imageType, byte[] imageData, ItemDto item) {
        this.id = id;
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageData = imageData;
        this.item = item;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public ItemDto getItem() {
        return item;
    }

    public void setItem(ItemDto item) {
        this.item = item;
    }
}