package com.anscom.ecommerce.service;

import com.anscom.ecommerce.constant.CategoryEnum;
import com.anscom.ecommerce.constant.SizeEnum;
import com.anscom.ecommerce.dto.ImageDto;
import com.anscom.ecommerce.dto.ItemDto;
import com.anscom.ecommerce.exception.ItemNotFoundException;
import com.anscom.ecommerce.model.Image;
import com.anscom.ecommerce.model.Item;
import com.anscom.ecommerce.repository.ImageRepository;
import com.anscom.ecommerce.repository.ItemRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ItemServiceImpl implements ItemService{

    private final ItemRepository itemRepository;
    private final ImageRepository imageRepository;

    public ItemServiceImpl(ItemRepository itemRepository, ImageRepository imageRepository) {
        this.itemRepository = itemRepository;
        this.imageRepository = imageRepository;
    }

    @Override
    public ItemDto getItemById(long id) {
        log.info("Fetching item by id {} ", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("There's no item with id " + id));
        ItemDto itemDto = newItemDto(item);
        log.info("Fetched item {} ", itemDto);
        return itemDto;
    }

    @Override
    public Page<ItemDto> getItems(Pageable pageable, SizeEnum size, String color, Long minPrice, Long maxPrice, String keyword, CategoryEnum category) {
        Specification<Item> spec = (root, query, cb) -> cb.conjunction(); // always true

        if(size != null) {
            spec = spec.and(((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("size"), size)));
        }
        if(color != null && !color.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("color"), color));
        }
        // Price range filtering
        if (minPrice != null && maxPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.between(root.get("price"), minPrice, maxPrice));
        } else if (minPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
        } else if (maxPrice != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if(keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("name"), "%" + keyword + "%"));
        }

        if(category != null) {
            spec = spec.and(((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category"), category)));
        }
        return itemRepository.findAll(spec, pageable).map(this::newItemDto);
    }

    //    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
    //        product.setImageName(imageFile.getOriginalFilename());
    //        product.setImageType(imageFile.getContentType());
    //        product.setImageData(imageFile.getBytes());
    //
    //        return repo.save(product);
    //    }
    @Override
    public ItemDto saveItem(ItemDto itemDto, MultipartFile[] imageFiles) {
        log.info("Saving new item: {}", itemDto);

        try {
            // 1. Create and save the item first
            Item item = new Item();
            item.setName(itemDto.getName());
            item.setDescription(itemDto.getDescription());
            item.setPrice(itemDto.getPrice());
            item.setColor(itemDto.getColor());
            item.setStock(itemDto.getStock());
            item.setGender(itemDto.getGender());
            item.setSize(itemDto.getSize());
            item.setMaterial(itemDto.getMaterial());
            item.setRating(itemDto.getRating());
            item.setCategory(itemDto.getCategory());

            Item savedItem = itemRepository.save(item); // Save item first
            // 2. Save multiple images and link them to the item
            if (imageFiles != null && imageFiles.length > 0) {
                List<Image> imageList = new ArrayList<>();
                for (MultipartFile imageFile : imageFiles) {
                    if (!imageFile.isEmpty()) {
                        Image image = new Image();
                        image.setImageName(imageFile.getOriginalFilename());
                        image.setImageType(imageFile.getContentType());
                        image.setImageData(imageFile.getBytes());
                        image.setItem(savedItem);  // Link image to the item
                        imageList.add(image);
                    }
                }
                imageRepository.saveAll(imageList);
            }

            log.info("Item and image saved successfully");

            return newItemDto(savedItem);

        } catch (Exception e) {
            log.error("Error saving item: {}", e.getMessage(), e);
            return null;
        }
    }



    @Override
    public List<ImageDto> getImagesByItemId(Long itemId) {
        List<Image> images = imageRepository.findByItemId(itemId);  // Ensure correct field reference

        log.info("Fetched {} images for item {}", images.size(), itemId);
        images.forEach(img -> log.info("Image: ID={}, Name={}", img.getId(), img.getImageName()));

        return images.stream()
                .map(this::convertToImageDto)
                .collect(Collectors.toList());
    }

    @Override
    public ItemDto updateItem(Long itemId, ItemDto itemDto, MultipartFile[] imageFiles) {
        log.info("Updating item with ID: {}", itemId);
        try {
            Item existingItem = itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
            // ✅ Update only provided fields, keep old values if null
            if (itemDto.getName() != null) existingItem.setName(itemDto.getName());
            if (itemDto.getDescription() != null) existingItem.setDescription(itemDto.getDescription());
            if (itemDto.getPrice() != null) existingItem.setPrice(itemDto.getPrice());
            if (itemDto.getColor() != null) existingItem.setColor(itemDto.getColor());
            if (itemDto.getStock() != 0) existingItem.setStock(itemDto.getStock());
            if (itemDto.getGender() != null) existingItem.setGender(itemDto.getGender());
            if (itemDto.getSize() != null) existingItem.setSize(itemDto.getSize());
            if (itemDto.getMaterial() != null) existingItem.setMaterial(itemDto.getMaterial());
            if (itemDto.getRating() != null) existingItem.setRating(itemDto.getRating());
            if (itemDto.getCategory() != null) existingItem.setCategory(itemDto.getCategory());

            // 3. Handle image updates
            if(imageFiles != null && imageFiles.length > 0) {
                imageRepository.deleteByItemId(itemId);

                List<Image> newImages = new ArrayList<>();
                for (MultipartFile imageFile : imageFiles) {
                    if (!imageFile.isEmpty()) {
                        Image newImage = new Image();
                        newImage.setImageName(imageFile.getOriginalFilename());
                        newImage.setImageType(imageFile.getContentType());
                        newImage.setImageData(imageFile.getBytes());
                        newImage.setItem(existingItem);
                        newImages.add(newImage);
                    }
                }
                imageRepository.saveAll(newImages);
            }

            // 4. Save updated Item
            Item updatedItem = itemRepository.save(existingItem);
            log.info("Item updated successfully: {}", updatedItem.getId());
            return newItemDto(updatedItem);
        } catch (Exception e) {
            log.error("Error updating item: {}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public void deleteItem(Long itemId) {
        log.info("Deleting item with ID: {}", itemId);
        Item existingItem = itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));

        imageRepository.deleteByItemId(itemId);
        itemRepository.delete(existingItem);
        log.info("Item deleted successfully: {}", itemId);

    }

    @Override
    public List<ItemDto> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return items.stream().map(this::newItemDto).collect(Collectors.toList());
    }


    private ImageDto convertToImageDto(Image image) {
        return ImageDto.builder()
                .id(image.getId())
                .imageName(image.getImageName())
                .imageType(image.getImageType())
                .build();
    }


    private ItemDto newItemDto(Item item) {
        int imageCount = imageRepository.countByItemId(item.getId());
        return ItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .color(item.getColor())
                .stock(item.getStock())
                .gender(item.getGender())
                .size(item.getSize())
                .material(item.getMaterial())
                .rating(item.getRating())
                .imageCount(imageCount)
                .category(item.getCategory())
                .build();
    }
}