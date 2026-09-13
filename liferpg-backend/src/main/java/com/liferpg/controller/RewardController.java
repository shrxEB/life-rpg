package com.liferpg.controller;

import com.liferpg.dto.ChestOpenResult;
import com.liferpg.dto.CustomRewardRequest;
import com.liferpg.dto.EquipRequest;
import com.liferpg.model.ShopItem;
import com.liferpg.model.UserInventory;
import com.liferpg.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    // View shop catalog
    @GetMapping
    public ResponseEntity<List<ShopItem>> getShopCatalog(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rewardService.getAvailableShopItems(userDetails.getUsername()));
    }

    // View personal inventory
    @GetMapping("/inventory")
    public ResponseEntity<List<UserInventory>> getMyInventory(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rewardService.getMyInventory(userDetails.getUsername()));
    }

    // Buy an item from the shop
    @PostMapping("/buy/{id}")
    public ResponseEntity<UserInventory> buyItem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(rewardService.buyItem(id, userDetails.getUsername()));
    }

    // Create a custom real-life reward (e.g. 1hr Netflix for 200 Gold)
    @PostMapping("/custom-reward")
    public ResponseEntity<ShopItem> createCustomReward(
            @Valid @RequestBody CustomRewardRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(rewardService.createCustomReward(request, userDetails.getUsername()));
    }

    // Open a Level-Up Mystery Chest!
    @PostMapping("/chest/open")
    public ResponseEntity<ChestOpenResult> openChest(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rewardService.openMysteryChest(userDetails.getUsername()));
    }

    // Equip title or avatar
    @PostMapping("/equip")
    public ResponseEntity<Void> equipItem(
            @Valid @RequestBody EquipRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        rewardService.equipItem(request.getInventoryId(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}