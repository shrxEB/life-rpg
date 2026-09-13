package com.liferpg.repository;

import com.liferpg.model.ShopItem;
import com.liferpg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    // Fetch system global items OR custom rewards created by this user
    @Query("SELECT s FROM ShopItem s WHERE s.createdBy IS NULL OR s.createdBy = :user")
    List<ShopItem> findAvailableItemsForUser(User user);
}