package com.liferpg.repository;

import com.liferpg.model.ShopItem;
import com.liferpg.model.User;
import com.liferpg.model.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    List<UserInventory> findByUserOrderByAcquiredAtDesc(User user);
    boolean existsByUserAndShopItem(User user, ShopItem shopItem);
    Optional<UserInventory> findByIdAndUser(Long id, User user);
}