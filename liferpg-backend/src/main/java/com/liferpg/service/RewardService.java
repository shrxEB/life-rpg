package com.liferpg.service;

import com.liferpg.dto.ChestOpenResult;
import com.liferpg.dto.CustomRewardRequest;
import com.liferpg.model.ActivityLog;
import com.liferpg.model.ShopItem;
import com.liferpg.model.User;
import com.liferpg.model.UserInventory;
import com.liferpg.repository.ActivityLogRepository;
import com.liferpg.repository.ShopItemRepository;
import com.liferpg.repository.UserInventoryRepository;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final UserRepository userRepository;
    private final ShopItemRepository shopItemRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final ActivityLogRepository activityLogRepository;

    public List<ShopItem> getAvailableShopItems(String username) {
        User user = getUserByUsername(username);
        return shopItemRepository.findAvailableItemsForUser(user);
    }

    public List<UserInventory> getMyInventory(String username) {
        User user = getUserByUsername(username);
        return userInventoryRepository.findByUserOrderByAcquiredAtDesc(user);
    }

    public ShopItem createCustomReward(CustomRewardRequest request, String username) {
        User user = getUserByUsername(username);

        ShopItem customReward = ShopItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .type(ShopItem.ItemType.REAL_REWARD)
                .icon(request.getIcon() != null && !request.getIcon().isBlank() ? request.getIcon() : "🎁")
                .rarity("COMMON")
                .createdBy(user)
                .build();

        return shopItemRepository.save(customReward);
    }

    @Transactional
    public UserInventory buyItem(Long itemId, String username) {
        User user = getUserByUsername(username);
        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Shop item not found!"));

        if (user.getGold() < item.getPrice()) {
            throw new RuntimeException("Not enough gold! Quest more to earn gold.");
        }

        // Check if user already owns unique items (titles, avatars)
        if (item.getType() != ShopItem.ItemType.REAL_REWARD &&
                userInventoryRepository.existsByUserAndShopItem(user, item)) {
            throw new RuntimeException("You already own this item!");
        }

        // Deduct Gold
        user.setGold(user.getGold() - item.getPrice());
        userRepository.save(user);

        UserInventory inventory = UserInventory.builder()
                .user(user)
                .shopItem(item)
                .build();

        userInventoryRepository.save(inventory);

        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("purchased \"" + item.getName() + "\" from the Shop! 🛍️")
                .xpGained(0)
                .build());

        return inventory;
    }

    @Transactional
    public ChestOpenResult openMysteryChest(String username) {
        User user = getUserByUsername(username);

        if (user.getMysteryChests() <= 0) {
            throw new RuntimeException("No mystery chests available! Level up to earn more chests.");
        }

        user.setMysteryChests(user.getMysteryChests() - 1);

        SecureRandom random = new SecureRandom();
        int roll = random.nextInt(100); // 0 to 99

        ChestOpenResult result;

        if (roll < 55) {
            // Common: Gold Drop (100 to 250 Gold)
            int gold = 100 + random.nextInt(151);
            user.setGold(user.getGold() + gold);
            result = ChestOpenResult.builder()
                    .rewardType("GOLD")
                    .rewardName(gold + " Gold Coins")
                    .rewardDescription("A pouch brimming with shiny gold coins!")
                    .rarity("COMMON")
                    .goldWon(gold)
                    .build();
        } else if (roll < 85) {
            // Rare: XP Booster (150 to 300 XP)
            int xp = 150 + random.nextInt(151);
            user.setTotalXp(user.getTotalXp() + xp);
            user.setCurrentXp(user.getCurrentXp() + xp);
            result = ChestOpenResult.builder()
                    .rewardType("XP")
                    .rewardName("Elixir of Knowledge (+" + xp + " XP)")
                    .rewardDescription("A swirling glowing potion granting instant experience!")
                    .rarity("RARE")
                    .xpWon(xp)
                    .build();
        } else {
            // Epic: Legendary Title
            String[] titles = {"Shadow Hunter", "Dragon Slayer", "Apex Scholar", "Iron Titan", "Grandmaster"};
            String wonTitle = titles[random.nextInt(titles.length)];
            user.setTitle(wonTitle);
            result = ChestOpenResult.builder()
                    .rewardType("TITLE")
                    .rewardName("Legendary Title: \"" + wonTitle + "\"")
                    .rewardDescription("A prestigious title bestowed upon elite adventurers!")
                    .rarity("EPIC")
                    .build();
        }

        userRepository.save(user);

        result.setRemainingChests(user.getMysteryChests());
        result.setUpdatedGold(user.getGold());
        result.setUpdatedTotalXp(user.getTotalXp());

        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("opened a Mystery Chest and found: " + result.getRewardName() + "! 🎁")
                .xpGained(result.getXpWon())
                .build());

        return result;
    }

    @Transactional
    public void equipItem(Long inventoryId, String username) {
        User user = getUserByUsername(username);
        UserInventory inventory = userInventoryRepository.findByIdAndUser(inventoryId, user)
                .orElseThrow(() -> new RuntimeException("Item not found in your inventory!"));

        ShopItem item = inventory.getShopItem();
        if (item.getType() == ShopItem.ItemType.TITLE) {
            user.setTitle(item.getName());
        } else if (item.getType() == ShopItem.ItemType.AVATAR) {
            user.setAvatar(item.getName());
        }

        userRepository.save(user);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}