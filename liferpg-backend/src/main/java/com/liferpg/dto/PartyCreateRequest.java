package com.liferpg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartyCreateRequest {

    @NotBlank(message = "Party name is required")
    @Size(min = 3, max = 30, message = "Party name must be between 3 and 30 characters")
    private String name;

    private String description;
}