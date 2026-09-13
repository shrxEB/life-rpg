package com.liferpg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String title;
    private String avatar;

    // Progression
    private int level;
    private int currentXp;
    private int totalXp;
    private int xpRequiredForNextLevel;
    private int gold;
    private int streakDays;
    private int mysteryChests;

    // Attributes
    private int strength;
    private int intellect;
    private int discipline;
    private int creativity;
    private int charisma;

    // Social
    private String partyName;
    private String partyInviteCode;

    // Calculated Power Score for Leaderboards
    private int powerScore;
}
