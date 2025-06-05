package com.anscom.ecommerce.controller;

import com.anscom.ecommerce.constant.CategoryEnum;
import com.anscom.ecommerce.constant.SizeEnum;
import com.anscom.ecommerce.dto.ImageDto;
import com.anscom.ecommerce.dto.ItemDto;
import com.anscom.ecommerce.service.ImageService;
import com.anscom.ecommerce.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/item")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {
    private final ItemService itemService;
    private final ImageService imageService;

    public ItemController(ItemService itemService, ImageService imageService) {
        this.itemService = itemService;
        this.imageService = imageService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable("id")Long id) {
        ItemDto itemDto = itemService.getItemById(id);
        return new ResponseEntity<>(itemDto, HttpStatus.OK);
    }

    @GetMapping("/{itemId}/imageAmount")
    public ResponseEntity<List<ImageDto>> getItemImage(@PathVariable("itemId") Long itemId) {
        List<ImageDto> images = itemService.getImagesByItemId(itemId);

        if (images.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(images);
    }

    @GetMapping("/image/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable("imageId") Long imageId) {
        ImageDto imageDto = imageService.getImageById(imageId);

        if (imageDto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(imageDto.getImageType()))
                .body(imageDto.getImageData());
    }

    @GetMapping("/allItems")
    public ResponseEntity<List<ItemDto>> getAllItems() {
        List<ItemDto> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }


    @GetMapping("/")
    public ResponseEntity<Page<ItemDto>> getItems(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "size", required = false) SizeEnum size,
            @RequestParam(name = "category", required = false) CategoryEnum category,
            @RequestParam(name = "color", required = false) String color,
            @RequestParam(name = "minPrice", required = false) Long minPrice,
            @RequestParam(name = "maxPrice", required = false) Long maxPrice,
            @RequestParam(name = "sort", defaultValue = "name") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC: Sort.Direction.ASC;
        Sort sorting = Sort.by(direction, sort);
        Pageable pageable = PageRequest.of(page, pageSize, sorting);
        Page<ItemDto> itemDtos = itemService.getItems(pageable, size, color, minPrice, maxPrice, keyword, category);
        return new ResponseEntity<>(itemDtos, HttpStatus.OK);
    }


    @PostMapping(value = "/createItem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemDto> createItem(
            @RequestPart("body") ItemDto itemDto,
            @RequestPart("files") MultipartFile[] imageFile) {

        System.out.printf("Received request to create item: {}", itemDto);

        try {
            ItemDto savedItem = itemService.saveItem(itemDto, imageFile);
            return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PutMapping("/updateItem/{itemId}")
    public ResponseEntity<ItemDto> updateItem(
            @PathVariable("itemId") Long itemId,
            @ModelAttribute ItemDto itemDto,
            @RequestParam(value = "files", required = false) MultipartFile[] imageFiles) {

        ItemDto updatedItem = itemService.updateItem(itemId, itemDto, imageFiles);
        if(updatedItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/deleteItem/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable("itemId") Long itemId) {
        try {
            itemService.deleteItem(itemId);
            return ResponseEntity.ok("Item deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
        }
    }

}