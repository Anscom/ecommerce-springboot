package com.anscom.ecommerce.repository;

import com.anscom.ecommerce.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByItemId(Long itemId); // Fetch images by item ID
    int countByItemId(Long itemId);

    Optional<Image> findById(Long id);

    @Modifying
    @Query("DELETE FROM Image i WHERE i.item.id = :itemId")
    @Transactional
    void deleteByItemId(@Param("itemId") Long itemId);

}