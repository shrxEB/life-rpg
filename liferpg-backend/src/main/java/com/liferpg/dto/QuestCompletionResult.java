package com.liferpg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestCompletionResult {

    private Long questId;
    private String questTitle;
    private int xpGained;
    private int goldGained;
    private String attributeBoosted;
    private int newAttributeValue;

    // Progression details
    private int currentXp;
    private int xpNeededForNextLevel;
    private int level;
    private boolean leveledUp;
    private int newMysteryChests;
    private int streakDays;
}