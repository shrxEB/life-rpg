package com.liferpg.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartyResponse {
    private Long id;
    private String name;
    private String description;
    private String inviteCode;
    private int memberCount;
    private List<LeaderboardEntry> members;
}