package com.liferpg.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {
    private int rank;
    private Long userId;
    private String username;
    private String title;
    private String avatar;
    private int level;
    private int totalXp;
    private int streakDays;
    private int powerScore;
    private String partyName;
}