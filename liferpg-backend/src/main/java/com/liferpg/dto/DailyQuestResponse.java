package com.liferpg.dto;

import com.liferpg.model.Task;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyQuestResponse {
    private Long id;
    private String title;
    private String description;
    private Task.AttributeCategory category;
    private int currentStreak;
    private boolean completedToday;

    // 7-day matrix (S M T W T F S)
    private boolean sunday;
    private boolean monday;
    private boolean tuesday;
    private boolean wednesday;
    private boolean thursday;
    private boolean friday;
    private boolean saturday;
}