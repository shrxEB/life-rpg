package com.liferpg.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomRewardRequest {

    @NotBlank(message = "Reward name is required")
    private String name;

    private String description;

    @Min(value = 10, message = "Price must be at least 10 gold")
    private int price;

    private String icon; // e.g. "🎮", "🍕", "☕"
}