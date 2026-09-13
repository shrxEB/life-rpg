package com.liferpg.dto;

import com.liferpg.model.Task;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyQuestRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Attribute category is required")
    private Task.AttributeCategory category;

    @Min(value = 1, message = "Target value must be at least 1")
    private int targetValue; // e.g. 30 (days), 11 (pull-ups), 3 (new activities)

    private int xpReward;
    private int goldReward;
}