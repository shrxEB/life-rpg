package com.liferpg.dto;

import com.liferpg.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyQuestRequest {

    @NotBlank(message = "Daily habit title is required")
    private String title;

    private String description;

    @NotNull(message = "Attribute category is required")
    private Task.AttributeCategory category; // STRENGTH, INTELLECT, DISCIPLINE, etc.
}
