package com.liferpg.dto;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyProgressRequest {

    @Min(value = 1, message = "Increment must be at least 1")
    private int increment = 1; // Default increments by 1
}