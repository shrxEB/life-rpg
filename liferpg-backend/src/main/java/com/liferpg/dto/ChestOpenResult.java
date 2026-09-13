package com.liferpg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChestOpenResult {
    private String rewardType; // "GOLD", "XP", "TITLE", "AVATAR"
    private String rewardName;
    private String rewardDescription;
    private String rarity;     // "COMMON", "RARE", "EPIC"
    private int goldWon;
    private int xpWon;
    private int remainingChests;
    private int updatedGold;
    private int updatedTotalXp;
}